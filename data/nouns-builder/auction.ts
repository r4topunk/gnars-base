import { BuilderSDK } from "@buildersdk/sdk";
import DefaultProvider from "@/utils/DefaultProvider";

//novo
import { request } from "graphql-request";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { parse } from "graphql";
import { GraphQLClient, gql } from "graphql-request";
import { BigNumber } from "ethers";
import { Address } from "wagmi";
import { SUBGRAPH_ENDPOINT } from "constants/urls";
import { DAO_ADDRESS } from "constants/addresses";

//novo
export type Bid = {
  bidder: Address;
  bidAmount: string;
  transactionHash: string;
}

export type AuctionInfo = {
  tokenId: string;
  highestBid: string;
  highestBidder: `0x${string}`;
  startTime: number;
  endTime: number;
  settled: boolean;
  bids: Bid[];
};

export type PreviousAuction = {
  tokenId: string;
  winner: `0x${string}`;
  amount: string;
  bids: Bid[];
};

const { auction } = BuilderSDK.connect({ signerOrProvider: DefaultProvider });

export const getCurrentAuction = async ({ address }: { address: string }) => {
  const { tokenId, highestBid, highestBidder, startTime, endTime, settled } =
    await auction({
      address,
    }).auction();

  //novo
  const bids = await getBidHistory({ tokenId });

  return {
    tokenId: tokenId.toHexString(),
    highestBid: highestBid.toHexString(),
    highestBidder,
    startTime,
    endTime,
    settled,
    bids
  } as AuctionInfo;
};

export const getPreviousAuctions = async ({ address }: { address: string }) => {
  const auctionContract = auction({ address });
  const filter = auctionContract.filters.AuctionSettled(null, null, null);
  const events = await auctionContract.queryFilter(filter);

  const previousAuctions: PreviousAuction[] = [];

  for (let event of events) {
    const tokenId = event.args?.tokenId.toHexString();
    const bids = await getBidHistory({ tokenId: BigNumber.from(tokenId) });
    previousAuctions.push({
      tokenId: tokenId,
      winner: event.args?.winner,
      amount: event.args?.amount.toHexString(),
      bids,
    } as PreviousAuction);
  }
  return previousAuctions;
/*
  return events.map(
    (x) =>
      ({
        tokenId: x.args?.tokenId.toHexString(),
        winner: x.args?.winner,
        amount: x.args?.amount.toHexString(),
      } as PreviousAuction)
  );
  */
};

//novo
export async function getBidHistory({ tokenId }: { tokenId: BigNumber }) {
  const query: TypedDocumentNode<
    { auction?: { bids: { id: string; bidder: string; amount: string}[] } },
    { id: string }
  > = parse(gql`
    query auctionBids($id: ID!) {
      auction(id: $id) {
        bids(orderBy: bidTime, orderDirection: desc) {
          id
          bidder
          amount
        }
      }
    }
  `);

  const client = new GraphQLClient(SUBGRAPH_ENDPOINT);
  const id = `${DAO_ADDRESS.nft.toLocaleLowerCase()}:${tokenId}`;
  const resp = await client.request({ document: query, variables: { id } });

  return (
    resp.auction?.bids.map(
      (entry: { bidder: any; amount: any; id: string; }) => 
        ({
          bidder: entry.bidder,
          bidAmount: entry.amount,
          transactionHash: entry.id.split(":")[0],
        } as Bid)
    ) ?? []
  );
}