import { shortenAddress } from "@/utils/shortenAddress";
import { BASE_SENDIT_TOKEN_ADDRESS, BASE_USDC_TOKEN_ADDRESS } from "constants/gnarsDao";
import { ETHERSCAN_BASEURL, ETHER_ACTOR_BASEURL } from "constants/urls";
import { BigNumber, ethers } from "ethers";
import Link from "next/link";
import { Fragment } from "react";
import useSWR from "swr";
import { Address, formatUnits } from "viem";
import UserAvatar from "../UserAvatar";
import useEnsName from "@/hooks/fetch/useEnsName";
import Image from "next/image";

type EtherActorResponse = {
  name: string;
  decoded: string[];
  functionName: string;
  isVerified: boolean;
};

export const ProposedTransactions = ({
  target,
  value,
  calldata,
}: {
  target: string;
  value: number;
  calldata: string;
}) => {
  const { data, error } = useSWR<EtherActorResponse>(
    calldata && calldata !== "0x" ? `${ETHER_ACTOR_BASEURL}/decode/${target}/${calldata}` : undefined
  );
  const valueBN = BigNumber.from(value);

  console.log("ProposedTransactions", { data }, { error }, { calldata }, valueBN, value, ethers.utils.formatEther(valueBN))

  if (calldata !== "0x" && (!data || error)) return <Fragment />;

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
    <div className="w-full">
      <div className="break-words">
        {linkIfAddress(target)}
        <span>{`.${data?.functionName || "transfer"}(`}</span>
      </div>
      {
        data?.decoded.length ? (
          data.decoded.map((decoded, index) => (
            <div className="ml-4" key={index}>
              {linkIfAddress(decoded)}
            </div>
          ))
        ) : (
          !valueBN.isZero() && (
            <div className="ml-4">{`${ethers.utils.formatEther(valueBN)} ETH`}</div>
          )
        )
      }
      <div>{")"}</div>
    </div>
  );
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
  const valueBN = BigNumber.from(value);

  const { data, error } = useSWR<EtherActorResponse>(
    calldata ? `${ETHER_ACTOR_BASEURL}/decode/${target}/${calldata}` : undefined
  );
  if (!data || error) return <Fragment />;

  const toAddress = data.decoded[0] as Address

  return (
    <div className="flex max-w-72 w-full flex-col gap-2 bg-skin-muted border border-skin-stroke rounded-xl overflow-hidden">
      {/* Function */}
      <div className="text-xl w-full bg-skin-button-accent p-2 text-center">
        {data?.functionName || "transfer"}
      </div>
      <div className="flex flex-col ml-2 p-2 items-center">
        {/* Token */}
        <div className="flex gap-2">
          <span className="">Token:</span>
          <TokenDataRender address={target} />
        </div>
        <div className="flex gap-2">
          <span className="">Value:</span>
          {
            data?.decoded?.length ? <TokenValueRender address={target} value={BigInt(data.decoded[1])} /> : !valueBN.isZero() && (
              <div className="ml-4">{`${ethers.utils.formatEther(valueBN)} ETH`}</div>
            )
          }

        </div>
        {/* Params */}
        <div>
          <span className="mr-2 ">To:</span>
          <FormatedTransactionValue address={toAddress} />
        </div>
      </div>
    </div>
  )
}

function TokenValueRender({ address, value }: { address: string, value: bigint }) {
  if (address === BASE_USDC_TOKEN_ADDRESS) {
    return (
      <div className="flex">
        <span>$</span>
        <span>{formatUnits(value, 6)}</span>
      </div>
    )
  } else if (address === BASE_SENDIT_TOKEN_ADDRESS) {
    return (
      <div className="flex">
        <span>↗</span>
        <span>{formatUnits(value, 14)}</span>
      </div>
    )
  }

  return null;
}

function TokenDataRender({ address }: { address: string }) {
  if (address === BASE_USDC_TOKEN_ADDRESS) {
    return (
      <div className="flex gap-1">
        <Image className="object-contain" width={16} height={16} src={"/usdc-logo.png"} alt="usdc logo" />
        <span>USDC</span>
      </div>
    )
  } else if (address === BASE_SENDIT_TOKEN_ADDRESS) {
    return (
      <div className="flex gap-1">
        <Image className="object-contain" width={16} height={16} src={"/sendit-logo.png"} alt="sendit logo" />
        <span>Sendit</span>
      </div>
    )
  }

  return null;
}

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