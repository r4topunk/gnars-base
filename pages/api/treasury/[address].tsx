import { BASE_SENDIT_TOKEN_ADDRESS, BASE_USDC_TOKEN_ADDRESS, BASE_WETH_TOKEN_ADDRESS } from "constants/addresses";
import { NextApiRequest, NextApiResponse } from "next";

export interface Token {
  address: string;
  network: string;
  label: string;
  name: string;
  symbol: string;
  decimals: string;
  verified: boolean;
  price: string;
  balance: number;
  balanceUSD: number;
  balanceRaw: string;
}

export interface TokenData {
  key: string;
  address: string;
  network: string;
  updatedAt: string;
  token: Token;
  networkId: string;
  assetCaip: string;
}

const TOKEN_ADDRESSES = [
  BASE_USDC_TOKEN_ADDRESS.toLowerCase(),
  BASE_SENDIT_TOKEN_ADDRESS.toLowerCase(),
  BASE_WETH_TOKEN_ADDRESS.toLowerCase()
];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;

  const fetchRes = await fetch(
    `https://pioneers.dev/api/v1/portfolio/${address as string}`
  );
  const data: { tokens: TokenData[], totalBalanceUsdTokens: number } = await fetchRes.json();

  const filteredTokens = data.tokens.filter((i: TokenData) =>
    TOKEN_ADDRESSES.includes(i.token.address)
  );

  const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
  res.setHeader(
    "Cache-Control",
    `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`
  );

  res.send({
    tokens: filteredTokens,
    totalBalance: data.totalBalanceUsdTokens,
  });
};

export default handler;