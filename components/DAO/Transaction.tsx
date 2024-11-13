import { Address } from "viem";
import { BigNumber } from "ethers";
import useSWR from "swr";
import { ETHER_ACTOR_BASEURL, ETHERSCAN_BASEURL } from "constants/urls";
import Skeleton from "./Transactions/Skeleton";
import NFTTransferTransaction from "./Transactions/NFTTransferTransaction";
import TransferTransaction from "./Transactions/TransferTransaction";
import EthTransferTransaction from "./Transactions/EthTransferTransaction";
import { USDC_ADDRESS } from "constants/addresses";

export function ProposedTransactions({
  target,
  value,
  calldata,
}: {
  target: string;
  value: BigInt;
  calldata: string;
}) {
  // Determine the type of transaction to render
  if (calldata === "0x") {
    // Render EthTransferTransaction for ETH transfers without calldata
    return <EthTransferTransaction toAddress={target as `0x${string}`} value={value} />;
  } else if (target === USDC_ADDRESS) {
    // Render NFTTransferTransaction for NFT transfers
    return <NFTTransferTransaction target={target} calldata={calldata} />;
  } else {
    // Render TransferTransaction for other transfers
    return <TransferTransaction target={target} value={Number(value)} calldata={calldata} />;
  }
}

export default ProposedTransactions;
