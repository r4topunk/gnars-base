import { BuilderSDK } from "@buildersdk/sdk";
import DefaultProvider from "@/utils/DefaultProvider";
import { MANAGER_CONTRACT } from "constants/addresses";

const { manager } = BuilderSDK.connect({ signerOrProvider: DefaultProvider });

export type DAOAddresses = {
  metadata: `0x${string}`;
  auction: `0x${string}`;
  treasury: `0x${string}`;
  governor: `0x${string}`;
};

export const getAddresses = async ({
  tokenAddress,
}: {
  tokenAddress: `0x${string}`;
}): Promise<DAOAddresses> => {
  /*
  const { metadata, auction, treasury, governor } = await manager({
    address: MANAGER_CONTRACT,
  }).getAddresses(tokenAddress);
  */
  const metadata = "0xdc9799d424ebfdcf5310f3bad3ddcce3931d4b58";
  const auction = "0x494eaa55ecf6310658b8fc004b0888dcb698097f";
  const treasury = "0x72ad986ebac0246d2b3c565ab2a1ce3a14ce6f88";
  const governor = "0x3dd4e53a232b7b715c9ae455f4e732465ed71b4c";

  return { metadata, auction, treasury, governor };
};
