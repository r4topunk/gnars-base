import { NextApiRequest, NextApiResponse } from "next";
import {
  DAO_ADDRESS,
  USDC_ADDRESS,
  BASE_SENDIT_TOKEN_ADDRESS,
  BASE_WETH_TOKEN_ADDRESS,
} from "constants/addresses";
import { useBalance } from "wagmi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // const { data: usdcData } = useBalance({
    //   address: DAO_ADDRESS.treasury,
    //   token: USDC_ADDRESS,
    // });
    // const { data: senditData } = useBalance({
    //   address: DAO_ADDRESS.treasury,
    //   token: BASE_SENDIT_TOKEN_ADDRESS,
    // });
    // const { data: wethData } = useBalance({
    //   address: DAO_ADDRESS.treasury,
    //   token: BASE_WETH_TOKEN_ADDRESS,
    // });
    // const { data: ethData } = useBalance({
    //   address: DAO_ADDRESS.treasury,
    // });

    // const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum,sendit&vs_currencies=usd`);
    // const prices = await response.json();

    // const ethPrice = prices.ethereum.usd;
    // const senditPrice = prices.sendit.usd;

    // const usdcAmount = Number(usdcData?.value) / 10 ** Number(usdcData?.decimals);
    // const ethAmount = Number(ethData?.value) / 10 ** Number(ethData?.decimals);
    // const senditAmount = Number(senditData?.value) / 10 ** Number(senditData?.decimals);
    // const wethAmount = Number(wethData?.value) / 10 ** Number(wethData?.decimals);

    // const usdcBalance = usdcAmount; // Assuming USDC is already in USD
    // const ethBalance = ethAmount * ethPrice;
    // const wethBalance = wethAmount * ethPrice;
    // const senditBalance = senditAmount * senditPrice;

    // const totalBalance = usdcBalance + ethBalance + senditBalance + wethBalance;

    // res.status(200).json({ totalBalance });

    const res = await fetch(
      `https://pioneers.dev/api/v1/portfolio/${DAO_ADDRESS.treasury}`
    );
    const data = await res.json();
    
    console.log(data);
    // console.dir({ data }, { depth: null, colors: true });
  } catch (error) {
    console.error("Failed to fetch prices:", error);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
}
