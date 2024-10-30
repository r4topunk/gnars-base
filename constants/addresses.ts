export const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT!;

export const USDC_ADDRESS = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"

export const MANAGER_CONTRACT = {
  "1": "0xd310A3041dFcF14Def5ccBc508668974b5da7174",
  "5": "0x0E9F3382Cf2508E3bc83248B5b4707FbA86D7Ee0",
  "999": "0xc521f85613985b7e417fccd5b348f64263d79397",
  "7777777": "0x3ac0e64fe2931f8e082c6bb29283540de9b5371c",
}[process.env.NEXT_PUBLIC_TOKEN_NETWORK ?? "1"]!;

export const DAO_ADDRESS = {
  nft: process.env.NEXT_PUBLIC_NFT as `0x${string}` || "0x880fb3cf5c6cc2d7dfc13a993e839a9411200c17",
  metadata: process.env.NEXT_PUBLIC_METADATA as `0x${string}` || "0xdc9799d424ebfdcf5310f3bad3ddcce3931d4b58",
  auction: process.env.NEXT_PUBLIC_AUCTION as `0x${string}` || "0x494eaa55ecf6310658b8fc004b0888dcb698097f",
  treasury: process.env.NEXT_PUBLIC_TREASURY as `0x${string}` || "0x72ad986ebac0246d2b3c565ab2a1ce3a14ce6f88",
  governor: process.env.NEXT_PUBLIC_GOVERNOR as `0x${string}` || "0x3dd4e53a232b7b715c9ae455f4e732465ed71b4c",
};