import { ethers, BigNumber } from "ethers";
import FormatedTransactionValue from "./FormatedTransactionValue";
import TransactionCardWrapper from "./TransactionCardWrapper";

const EthTransferTransaction = ({
    toAddress,
    value,
}: {
    toAddress: `0x${string}`;
    value: BigInt | { hex: string; type: string };
}) => {
    // Determine the BigNumber value from `value`
    const bigNumberValue = BigNumber.isBigNumber(value)
        ? value
        : BigNumber.from((value as { hex: string }).hex);

    return (
        <TransactionCardWrapper title="Ethereum Transfer">
            <div className="transaction-detail flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-600">Value:</span>
                    <span className="text-lg font-bold text-blue-600">
                        {`${ethers.utils.formatEther(bigNumberValue)} ETH`}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-600">To:</span>
                    <FormatedTransactionValue address={toAddress} />
                </div>
            </div>
        </TransactionCardWrapper>
    );
};

export default EthTransferTransaction;
