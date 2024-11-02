import { Address, formatUnits } from "viem";
import { BigNumber, ethers } from "ethers";
import FormatedTransactionValue from "./FormatedTransactionValue";
import TokenDataRender from "./TokenDataRender";
import TokenValueRender from "./TokenValueRender";
import Skeleton from "./Skeleton";
import useSWR from "swr";
import { ETHER_ACTOR_BASEURL } from "constants/urls";
import TransactionCardWrapper from "./TransactionCardWrapper";

type EtherActorResponse = {
    functionName: string;
    decoded: string[];
};

export function TransferTransaction({
    target,
    value,
    calldata,
}: {
    target: string;
    value: number;
    calldata: string;
}) {
    const swrKey = calldata ? `${ETHER_ACTOR_BASEURL}/decode/${target}/${calldata}` : null;
    const { data, error } = useSWR<EtherActorResponse>(swrKey);

    if (!data && !error) return <Skeleton />;
    if (error) return <div>Error loading transaction data</div>;

    const toAddress = data?.decoded?.[0] as Address | undefined;

    return (
        <TransactionCardWrapper title={data?.functionName || "Transfer"}>
            <div className="transaction-detail">
                <span className="font-semibold">Token:</span>
                <TokenDataRender address={target} />
            </div>
            <div className="transaction-detail">
                <span className="font-semibold">Value:</span>
                {data?.decoded && data.decoded.length > 1 ? (
                    <TokenValueRender address={target} value={BigInt(data.decoded[1])} />
                ) : (
                    value && <span>{`${ethers.utils.formatEther(BigNumber.from(value))} ETH`}</span>
                )}
            </div>
            <div className="transaction-detail">
                <span className="font-semibold">To:</span>
                {toAddress ? (
                    <FormatedTransactionValue address={toAddress} />
                ) : (
                    <span className="text-gray-500">Address not available</span>
                )}
            </div>
        </TransactionCardWrapper>
    );
}

export default TransferTransaction;
