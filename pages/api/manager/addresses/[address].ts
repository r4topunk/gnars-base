import { NextApiRequest, NextApiResponse } from "next";
import { DAO_ADDRESS } from "constants/addresses";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const daoAddresses = DAO_ADDRESS;

  const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
  res.setHeader(
    "Cache-Control",
    `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`
  );
  res.send(daoAddresses);
};

export default handler;
