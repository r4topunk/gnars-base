import { Address, formatUnits } from "viem";
import { BigNumber, ethers } from "ethers";
import useSWR from "swr";
import { ETHER_ACTOR_BASEURL, ETHERSCAN_BASEURL } from "constants/urls";
import FormatedTransactionValue from "./Transactions/FormatedTransactionValue";
import TokenDataRender from "./Transactions/TokenDataRender";
import TokenValueRender from "./Transactions/TokenValueRender";
import Skeleton from "./Transactions/Skeleton";
import Link from "next/link";
import { Fragment } from "react";

type EtherActorResponse = {
  name: string;
  decoded: string[];
  functionName: string;
  isVerified: boolean;
};

export function ProposedTransactions({
  target,
  value,
  calldata,
}: {
  target: string;
  value: number;
  calldata: string;
}) {
  const { data, error } = useSWR<EtherActorResponse>(
    calldata && calldata !== "0x" ? `${ETHER_ACTOR_BASEURL}/decode/${target}/${calldata}` : null
  );

  console.log(data);

  if (!data && calldata && calldata !== "0x") return <Skeleton />;
  if (error) return <div>Error loading transaction data</div>;

  const valueBN = BigNumber.from(value);
  const functionName = data?.functionName || "transfer";

  const toAddress = data?.decoded?.[0] as Address | undefined;

  const linkIfAddress = (value: string) => {
    if (ethers.utils.isAddress(value))
      return (
        <Link
          href={`${ETHERSCAN_BASEURL}/address/${value}`}
          rel="noopener noreferrer"
          target="_blank"
          className="text-skin-highlighted underline"
        >
          {value}
        </Link>
      );
    return value;
  };

  return (
    <div className="transaction-card">
      <div className="transaction-header">{functionName}</div>
      <div className="transaction-content">
        <div className="transaction-detail">
          {linkIfAddress(target)}
          <span>{`.${functionName}(`}</span>
        </div>
        {data?.decoded?.length ? (
          data.decoded.map((decoded, index) => (
            <div className="ml-4" key={index}>
              {linkIfAddress(decoded)}
            </div>
          ))
        ) : (
          !valueBN.isZero() && (
            <div className="ml-4">{`${ethers.utils.formatEther(valueBN)} ETH`}</div>
          )
        )}
        <div>{")"}</div>
      </div>
    </div>
  );
}

export function TransferTransaction({
  target,
  value,
  calldata,
}: {
  target: string;
  value: number;
  calldata: string;
}) {
  const valueBN = BigNumber.from(value);
  const { data, error } = useSWR<EtherActorResponse>(
    calldata ? `${ETHER_ACTOR_BASEURL}/decode/${target}/${calldata}` : null
  );
  if (!data && calldata && calldata !== "0x") return <Skeleton />;
  if (error) return <div>Error loading transaction data</div>;
  const toAddress = data?.decoded?.[0] as Address | undefined;

  console.log({ toAddress }, { data }, { valueBN });

  return (
    <div className="transaction-card">
      <div className="transaction-header">{data?.functionName || "transfer"}</div>
      <div className="transaction-content">
        <div className="transaction-detail">
          <span className="font-semibold">Token:</span>
          <TokenDataRender address={target} />
        </div>
        <div className="transaction-detail">
          <span className="font-semibold">Value:</span>
          {data?.decoded?.length ? (
            <TokenValueRender address={target} value={BigInt(data.decoded[1])} />
          ) : (
            !valueBN.isZero() && <span>{`${ethers.utils.formatEther(valueBN)} ETH`}</span>
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
      </div>
    </div>
  );
}

export default TransferTransaction;
