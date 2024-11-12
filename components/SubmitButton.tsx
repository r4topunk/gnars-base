'use client';
import { useFormikContext } from "formik";
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
import { Interface, parseEther } from "ethers/lib/utils.js";
import { parseUnits } from "ethers/lib/utils.js";
export interface FormTransaction {
    address: string;
    value: number; // Use a single 'value' field
    transactionType: "ETH" | "USDC";
}

const SubmitButton = () => {
    const { values: formValues } = useFormikContext<{ transactions: FormTransaction[]; title: string; summary: string }>();
    const { transactions, title, summary } = formValues || {};

    // console.log("Form Values:", formValues); // Debugging statement

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
                const target = t.address as `0x${string}`;
                let value = BigNumber.from(0);
                let callData: `0x${string}` = "0x";

                if (t.transactionType === "ETH") {
                    value = parseEther(t.value.toString());
                } else if (t.transactionType === "USDC") {
                    const amount = parseUnits(t.value.toString(), 6);
                    callData = usdcInterface.encodeFunctionData("transfer", [target, amount]) as `0x${string}`;
                }

                // console.log("Prepared Transaction:", { target, value: value.toString(), callData, tValue: t.value }); // Debugging statement

                return { target, value, callData };
            });

        return {
            targets: preparedTransactions.map(pt => pt.target) as readonly `0x${string}`[],
            values: preparedTransactions.map(pt => pt.value) as readonly BigNumber[],
            callDatas: preparedTransactions.map(pt => pt.callData) as readonly `0x${string}`[],
        };
    }, [transactions]);

    const description = `${title}&&${summary}`;

    // Ensure args are properly typed
    const args: readonly [readonly `0x${string}`[], readonly BigNumber[], readonly `0x${string}`[], string] = [
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
