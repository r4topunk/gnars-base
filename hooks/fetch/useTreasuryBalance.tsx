import { BigNumber } from "ethers";
import { TokenData } from "pages/api/treasury/[address]";
import useSWR from "swr";

export const useTreasuryBalance = ({
  treasuryContract,
}: {
  treasuryContract?: string;
}) => {
  return useSWR<{ tokens: TokenData, totalBalance: number }>(
    treasuryContract ? `/api/treasury/${treasuryContract}` : undefined
  );
};
