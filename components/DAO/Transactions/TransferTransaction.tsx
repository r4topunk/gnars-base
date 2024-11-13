import { BigNumber, ethers } from "ethers";
import { AbiCoder, hexDataSlice } from "ethers/lib/utils.js";
import { Address } from "viem";
import FormatedTransactionValue from "./FormatedTransactionValue";
import TokenDataRender from "./TokenDataRender";
import TokenValueRender from "./TokenValueRender";
import TransactionCardWrapper from "./TransactionCardWrapper";

export function TransferTransaction({
    target,
    value,
    calldata,
}: {
    target: string;
    value: number;
    calldata: string;
}) {
    const abiCoder = new AbiCoder();
    const decodedData = abiCoder.decode(["address", "uint256"], hexDataSlice(calldata, 4));
    const toAddress = decodedData[0] as Address;
    const transferValue = BigInt(decodedData[1]);

    return (
        <TransactionCardWrapper title="Transfer">
            <div className="transaction-detail">
                <span className="font-semibold">Token:</span>
                <TokenDataRender address={target} />
            </div>
            <div className="transaction-detail">
                <span className="font-semibold">Value:</span>
                {calldata ? (
                    <TokenValueRender address={target} value={transferValue} />
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
