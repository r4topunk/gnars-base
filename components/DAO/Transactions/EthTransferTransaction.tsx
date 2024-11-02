import { ethers, BigNumber } from "ethers";
import FormatedTransactionValue from "./FormatedTransactionValue";
import TransactionCardWrapper from "./TransactionCardWrapper";

const EthTransferTransaction = ({
    toAddress,
    value,
}: {
    toAddress: `0x${string}`;
    value: number;
}) => (
    <TransactionCardWrapper title="Ethereum Transfer">
        <div className="transaction-detail flex flex-col space-y-2">
            <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-600">Value:</span>
                <span className="text-lg font-bold text-blue-600">
                    {`${ethers.utils.formatEther(BigNumber.from(value))} ETH`}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-600">To:</span>
                <FormatedTransactionValue address={toAddress} />
            </div>
        </div>
    </TransactionCardWrapper>
);

export default EthTransferTransaction;
