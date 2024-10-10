import { shortenAddress } from "@/utils/shortenAddress";
import { BASE_USDC_TOKEN_ADDRESS } from "constants/gnarsDao";
import { ETHERSCAN_BASEURL, ETHER_ACTOR_BASEURL } from "constants/urls";
import { BigNumber, ethers } from "ethers";
import Link from "next/link";
import { Fragment } from "react";
import useSWR from "swr";
import { Address, formatUnits } from "viem";
import UserAvatar from "../UserAvatar";
import useEnsName from "@/hooks/fetch/useEnsName";

type EtherActorResponse = {
  name: string;
  decoded: string[];
  functionName: string;
  isVerified: boolean;
};

export const MockProposedTransactions = ({
  target,
  value,
  calldata,
}: {
  target: string;
  value: number;
  calldata: string;
}) => {
  const valueBN = BigNumber.from(value);
  let data = {
    name: "transfer(address,uint256)",
    decoded: [
      "0x9D4E88f7f2CCBB005426c1ed91eB2BB7d235937F",
      "6969000000"
    ],
    functionName: "transfer",
    isVerified: false
  }

  const linkIfAddress = (value: string) => {
    if (ethers.utils.isAddress(value))
      return (
        <Link
          href={`${ETHERSCAN_BASEURL}/address/${value}`}
          rel="noopener noreferrer"
          target="_blank"
          className="text-skin-highlighted underline"
        >
          {shortenAddress(value, 4)}
        </Link>
      );

    return value;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* <TransferTransaction target={target} value={value} /> */}
      <div className="w-full">
        <div className="break-words">
          {linkIfAddress(target)}
          <span>{`.${data?.functionName || "transfer"}(`}</span>
        </div>
        {!data?.decoded && !valueBN.isZero() && (
          <div className="ml-4">{`${ethers.utils.formatEther(valueBN)} ETH`}</div>
        )}
        {data?.decoded?.map((decoded, index) => (
          <div className="ml-4" key={index}>
            {linkIfAddress(decoded)}
          </div>
        ))}
        <div>{")"}</div>
      </div>
    </div>
  );
};

const FormatedTransactionValue = ({ address }: { address: Address }) => {
  const { data: ensName } = useEnsName(address);

  if (ensName?.ensName) {
    return (
      <div className="flex items-center mb-2">
        <UserAvatar address={address} className="rounded-full" diameter={18} />
        <p className="ml-2 text-sm">{ensName?.ensName || shortenAddress(address, 4)}</p>
      </div>
    )
  }

  if (ethers.utils.isAddress(address))
    return (
      <Link
        href={`${ETHERSCAN_BASEURL}/address/${address}`}
        rel="noopener noreferrer"
        target="_blank"
        className="text-skin-highlighted underline"
      >
        {shortenAddress(address, 4)}
      </Link>
    );

  return <span>{address}</span>;
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
  const { data, error } = useSWR<EtherActorResponse>(
    calldata ? `${ETHER_ACTOR_BASEURL}/decode/${target}/${calldata}` : undefined
  );
  const valueBN = BigNumber.from(value);

  if (!data || error) return <Fragment />;

  const toAddress = data.decoded[0] as Address

  return (
    <div className="flex flex-col gap-2bg-skin-muted border border-skin-stroke rounded-xl p-4 w-fit">
      {/* Function */}
      <div className="text-xl w-fit">
        {data?.functionName || "transfer"}
      </div>
      <div className="flex flex-col ml-2">
        {/* Token */}
        <div className="flex gap-2">
          <span>Token:</span>
          <span>USDC</span>
        </div>
        <div className="flex gap-2">
          <span>Value:</span>
          {
            data?.decoded?.length ? <TokenRender address={target} value={BigInt(data.decoded[1])} /> : !valueBN.isZero() && (
              <div className="ml-4">{`${ethers.utils.formatEther(valueBN)} ETH`}</div>
            )
          }

        </div>
        {/* Params */}
        <div>
          <span className="mr-2">To:</span>
          <FormatedTransactionValue address={toAddress} />
        </div>
      </div>
    </div>
  )
}

function TokenRender({ address, value }: { address: string, value: bigint }) {
  if (address === BASE_USDC_TOKEN_ADDRESS) {
    return (
      <div className="flex">
        <span>$</span>
        <span>{formatUnits(value, 6)}</span>
      </div>
    )
  }

  return null;
}