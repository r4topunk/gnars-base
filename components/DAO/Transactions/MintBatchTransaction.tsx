import { Address } from "viem";
import { shortenAddress } from "@/utils/shortenAddress";
import Link from "next/link";
import Image from "next/image";
import TransactionCardWrapper from "./TransactionCardWrapper";

const MintBatchTransaction = ({
    target,
    decoded,
}: {
    target: string;
    decoded: string[];
}) => {
    const amount = decoded?.[0];
    const recipient = decoded?.[1] as Address | undefined;

    return (
        <TransactionCardWrapper title="Create Gnar">
            <div className="flex justify-center items-center gap-2 mb-2">
                <Image className="object-contain" width={48} height={48} src="/loading.gif" alt="Gnar logo" />
            </div>
            <div className="transaction-detail">
                <span className="font-semibold">Amount:</span>
                <span>{amount || "N/A"}</span>
            </div>
            <div className="transaction-detail">
                <span className="font-semibold">For:</span>
                {recipient ? (
                    <Link href={`/address/${recipient}`} passHref>
                        <a className="text-blue-500 underline">{shortenAddress(recipient)}</a>
                    </Link>
                ) : (
                    <span className="text-gray-500">Address not available</span>
                )}
            </div>
        </TransactionCardWrapper>
    );
};

export default MintBatchTransaction;
