'use client';
import { useFormikContext } from "formik";
import { parseEther } from "ethers/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { useDAOAddresses } from "@/hooks/fetch";
import { TOKEN_CONTRACT, USDC_ADDRESS } from "constants/addresses";
import { useUserVotes } from "@/hooks/fetch/useUserVotes";
import { useCurrentThreshold } from "@/hooks/fetch/useCurrentThreshold";
import AuthWrapper from "@/components/AuthWrapper";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { Fragment, useMemo } from "react";
import { ethers } from "ethers";
import { GovernorABI } from "@buildersdk/sdk";
import USDC_ABI from "constants/USDC_ABI";
import { BigNumber } from "ethers";
export interface FormTransaction {
    address: string;
    valueInETH?: number;  // For ETH transactions
    valueInUSDC?: number; // For USDC transactions
    transactionType: "ETH" | "USDC";
}

const SubmitButton = () => {
    const { values: formValues } = useFormikContext<{ transactions: FormTransaction[]; title: string; summary: string }>();
    const { transactions, title, summary } = formValues || {};
    const { data: addresses } = useDAOAddresses({
        tokenContract: TOKEN_CONTRACT,
    });
    const { data: userVotes } = useUserVotes();
    const { data: currentThreshold } = useCurrentThreshold({
        governorContract: addresses?.governor,
    });

    // Separate ETH and USDC transactions
    const ethTransactions = transactions.filter((t) => t.transactionType === "ETH");
    const usdcTransactions = transactions.filter((t) => t.transactionType === "USDC");

    // Memoize USDC Call Data to avoid re-calculations on each render
    const usdcCallDatas = useMemo(() => {
        if (!usdcTransactions.length) return [];

        const usdcTargets = usdcTransactions.map((t) => t.address as `0x${string}`);
        const usdcValues = usdcTransactions.map((t) => ethers.utils.parseUnits(t.valueInUSDC?.toString() || "0", 6));

        return usdcTransactions.map((_, index) => {
            const usdcInterface = new ethers.utils.Interface(USDC_ABI);
            return usdcInterface.encodeFunctionData("transfer", [
                usdcTargets[index],  // Ensure this is a valid Ethereum address (0x...)
                usdcValues[index]    // Ensure this is a valid uint256 value parsed to 6 decimals
            ]);
        });
    }, [usdcTransactions]);  // Dependency array ensures recalculation only when usdcTransactions change

    // Prepare ETH transactions
    const ethTargets: readonly `0x${string}`[] = ethTransactions.map((t) => t.address as `0x${string}`);
    const ethValues: readonly BigNumber[] = ethTransactions.map((t) => t.valueInETH ? parseEther(t.valueInETH.toString()) : parseEther("0"));

    const ethCallDatas = ethTransactions?.map(() => "0x" as `0x${string}`) || [];

    // Combine ETH and USDC transactions
    const targets: readonly `0x${string}`[] = [...ethTargets, ...usdcTransactions.map(t => t.address as `0x${string}`)];
    const values: readonly BigNumber[] = [...ethValues, ...Array(usdcTransactions.length).fill(ethers.BigNumber.from(0))]; // USDC has no native value transfer
    const callDatas = [...ethCallDatas, ...usdcCallDatas] as readonly `0x${string}`[];
    const description = `${title}&&${summary}`;

    // Ensure args are properly typed
    const args: readonly [readonly `0x${string}`[], readonly BigNumber[], readonly `0x${string}`[], string] = [
        targets,
        values,
        callDatas,
        description
    ];

    const debouncedArgs = useDebounce(args);

    // Prepare the contract write
    const { config } = usePrepareContractWrite({
        address: addresses?.governor,
        abi: GovernorABI,
        functionName: "propose",
        args: debouncedArgs,
        // enabled: debouncedArgs && !values.find((x) => x.isZero()),
    });

    const { data, write } = useContractWrite(config);
    const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });
    const hasBalance = userVotes && userVotes >= (currentThreshold || 0);

    return (
        <AuthWrapper
            className={`${write ? "bg-skin-button-accent hover:bg-skin-button-accent-hover" : "bg-skin-button-muted"
                } text-skin-inverted rounded-lg text-md w-full h-12 mt-4 flex items-center justify-around`}
        >
            <button
                onClick={() => write?.()}
                disabled={!hasBalance || !write || isSuccess || isLoading}
                type="button"
            >
                {!hasBalance
                    ? "You don't have enough votes to submit a proposal"
                    : isSuccess
                        ? <><CheckCircleIcon className="h-5" /> Proposal Submitted</>
                        : isLoading
                            ? <Image src="/spinner.svg" alt="spinner" width={25} height={25} />
                            : "Submit Proposal"}
            </button>
        </AuthWrapper>
    );
};

export default SubmitButton;
