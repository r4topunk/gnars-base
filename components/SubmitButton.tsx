import { useFormikContext } from "formik";
import { parseEther } from "ethers/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { useDAOAddresses } from "@/hooks/fetch";
import { TOKEN_CONTRACT } from "constants/addresses";
import { useUserVotes } from "@/hooks/fetch/useUserVotes";
import { useCurrentThreshold } from "@/hooks/fetch/useCurrentThreshold";
import AuthWrapper from "@/components/AuthWrapper";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { Fragment } from "react";
import { GovernorABI } from "@buildersdk/sdk";
export interface FormTransaction {
    address: string;
    valueInETH: number;
};


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

    const targets = transactions?.map((t: FormTransaction) => t.address as `0x${string}`) || [];
    const values = transactions?.map((t: FormTransaction) => parseEther(t.valueInETH.toString())) || [];
    const callDatas = transactions?.map(() => "0x" as `0x${string}`) || [];
    const description = `${title}&&${summary}`;
    const args = [targets, values, callDatas, description] as const;
    const debouncedArgs = useDebounce(args);

    const { config } = usePrepareContractWrite({
        address: addresses?.governor,
        abi: GovernorABI,
        functionName: "propose",
        args: debouncedArgs,
        enabled: debouncedArgs && !values.find((x) => x.isZero()),
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
