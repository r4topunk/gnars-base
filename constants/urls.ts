import { base } from "@wagmi/chains";

export const ETHERSCAN_BASEURL = {
  "1": "https://etherscan.io",
  "5": "https://goerli.etherscan.io",
  "999": "https://explorer.zora.energy/",
  "7777777": "https://testnet.explorer.zora.energy/",
  "8453": base.blockExplorers.etherscan.url
}[process.env.NEXT_PUBLIC_TOKEN_NETWORK ?? "1"];

export const SUBGRAPH_ENDPOINT = {
  "1": "https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-ethereum-mainnet/stable/gn",
  "5": "https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-goerli-testnet/stable/gn",
  "999": "https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-zora-mainnet/stable/gn",
  "7777777": "https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-zora-testnet/stable/gn",
  "8453": "https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-base-mainnet/stable/gn",
}[process.env.NEXT_PUBLIC_TOKEN_NETWORK ?? "1"]!;

export const ETHER_ACTOR_BASEURL = "https://ether.actor";
export const IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs/";
export const ZORA_FEATURED_URL = process.env.NEXT_PUBLIC_ZORA_FEATURED_URL || "https://zora.co/collect/base:0xd2f21a72730259512f6edc60cfd182a79420dae6/embed?referrer=0x41CB654D1F47913ACAB158a8199191D160DAbe4A";
