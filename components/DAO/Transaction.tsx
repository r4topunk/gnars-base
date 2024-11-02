import { Address } from "viem";
import { BigNumber } from "ethers";
import useSWR from "swr";
import { ETHER_ACTOR_BASEURL, ETHERSCAN_BASEURL } from "constants/urls";
import Skeleton from "./Transactions/Skeleton";
import NFTTransferTransaction from "./Transactions/NFTTransferTransaction";
import TransferTransaction from "./Transactions/TransferTransaction";
import EthTransferTransaction from "./Transactions/EthTransferTransaction";

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
  value: BigInt;
  calldata: string;
}) {
  const { data, error } = useSWR<EtherActorResponse>(
    calldata && calldata !== "0x" ? `${ETHER_ACTOR_BASEURL}/decode/${target}/${calldata}` : null
  );

  if (!data && calldata && calldata !== "0x") return <Skeleton />;
  if (error) return <div>Error loading transaction data</div>;

  const functionName = data?.functionName || "transfer";
  const toAddress = data?.decoded?.[0] as Address | undefined;

  // Determine the type of transaction to render
  if (calldata === "0x") {
    // Render EthTransferTransaction for ETH transfers without calldata
    console.log("ProposedTransactions", { target, value, calldata, data });
    return <EthTransferTransaction toAddress={target as `0x${string}`} value={value} />;
  } else if (functionName === "transferFrom") {
    // Render NFTTransferTransaction for NFT transfers
    return <NFTTransferTransaction target={target} decoded={data?.decoded || []} calldata={calldata} />;
  } else {
    // Render TransferTransaction for other transfers
    return <TransferTransaction target={target} value={Number(value)} calldata={calldata} />;
  }
}

export default ProposedTransactions;
