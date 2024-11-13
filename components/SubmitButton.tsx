'use client';
import AuthWrapper from "@/components/AuthWrapper";
import { useDAOAddresses } from "@/hooks/fetch";
import { useCurrentThreshold } from "@/hooks/fetch/useCurrentThreshold";
import { useUserVotes } from "@/hooks/fetch/useUserVotes";
import { useDebounce } from "@/hooks/useDebounce";
import { GovernorABI } from "@buildersdk/sdk";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { TOKEN_CONTRACT, USDC_ADDRESS } from "constants/addresses";
import USDC_ABI from "constants/USDC_ABI";
import { BigNumber } from "ethers";
import { Interface, parseEther, parseUnits } from "ethers/lib/utils.js";
import { useFormikContext } from "formik";
import Image from "next/image";
import { useMemo } from "react";
import { Address, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

export interface FormTransaction {
    address: string;
    value: number;
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

    // Simplify transaction preparation
    const { targets, values, callDatas } = useMemo(() => {
        if (!transactions) return { targets: [], values: [], callDatas: [] };

        const usdcInterface = new Interface(USDC_ABI);

        const preparedTransactions = transactions
            .filter(t => t.address && t.value > 0 && t.transactionType) // Filter out incomplete or zero-value transactions
            .map((t) => {
                let value = BigNumber.from(0);
                let target: Address = "0x";
                let callData: Address = "0x";

                if (t.transactionType === "ETH") {
                    value = parseEther(t.value.toString());
                    target = t.address as Address;
                } else if (t.transactionType === "USDC") {
                    target = USDC_ADDRESS as Address;
                    const amount = parseUnits(t.value.toString(), 6);
                    callData = usdcInterface.encodeFunctionData("transfer", [t.address, amount]) as Address;
                }
                return { target, value, callData };
            });

        return {
            targets: preparedTransactions.map(pt => pt.target) as readonly Address[],
            values: preparedTransactions.map(pt => pt.value) as readonly BigNumber[],
            callDatas: preparedTransactions.map(pt => pt.callData) as readonly Address[],
        };
    }, [transactions]);

    const description = `${title}&&${summary}`;

    // Ensure args are properly typed
    const args: readonly [readonly Address[], readonly BigNumber[], readonly Address[], string] = [
        targets,
        values,
        callDatas,
        description
    ];

    // console.log("Args:", args); // Debugging statement

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
            className=""
        >
            <button
                className={`bg-amber-500 text-amber-950 font-bold disabled:bg-gray-200 tracking-wide rounded-lg text-md w-full h-12 mt-4 flex items-center justify-center gap-2`}
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
