import { BigNumber, utils } from "ethers";
import Image from "next/image";
import { Fragment, useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
  Address,
} from "wagmi";
import { AuctionABI } from "@buildersdk/sdk";
import { useDebounce } from "@/hooks/useDebounce";
import { useTheme } from "@/hooks/useTheme";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export const PlaceBid = ({
  highestBid,
  auction,
  tokenId,
}: {
  highestBid?: string;
  auction?: string;
  tokenId?: string;
}) => {
  const { address } = useAccount();
  const [bid, setBid] = useState("");
  const debouncedBid = useDebounce(bid, 500);
  const [theme] = useTheme();

  const { config, error } = usePrepareContractWrite({
    address: auction as Address,
    abi: AuctionABI,
    functionName: "createBid",
    args: [BigNumber.from(tokenId || 1)],
    overrides: {
      value: utils.parseEther(debouncedBid || "0"),
    },
    enabled: !!auction && !!debouncedBid,
  });
  const { write, data } = useContractWrite(config);
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  const highestBidBN = BigNumber.from(highestBid);
  const amountIncrease = highestBidBN.div("10");
  const nextBidAmount = highestBidBN.add(amountIncrease);

  const getError = () => {
    if (!error?.message) return;
    const message = error?.message;

    if (message.includes("insufficient funds"))
      return "Error insufficent funds for bid";

    if (debouncedBid && debouncedBid < utils.formatEther(nextBidAmount))
      return "Error invalid bid";
  };

  return (
    <Fragment>
      <div className="mt-12 sm:mt-6 flex flex-col sm:flex-row gap-2">
        <div className="w-full relative group">
          <input
            value={bid}
            type="number"
            onChange={(e) => setBid(e.target.value)}
            className="bg-gray text-skin-base placeholder:text-neutral-400 px-2 py-2 rounded-lg w-full text-xl mr-2 border border-neutral-400 focus:border-amber-400 focus:outline-none"
            placeholder={
              nextBidAmount ? `Ξ ${utils.formatEther(nextBidAmount)} or more` : ""
            }
          />
          <div onClick={(e) => setBid(utils.formatEther(nextBidAmount))} className="invisible group-hover:visible absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 rounded-md bg-amber-400 px-2">min</div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (isConnected) {
              write?.();
            } else {
              openConnectModal?.();
            }
          }}
          className="bg-skin-button-accent transition ease-in-out hover:scale-[1.04] text-skin-base rounded-lg text-xl w-full sm:h-auto h-12 mt-4 sm:mt-0 sm:w-40 flex items-center justify-around"
        >
          {isLoading ? (
            <Image src="/spinner.svg" height={24} width={24} alt="spinner" />
          ) : (
            <span>{theme.strings.placeBid || "Place bid"}</span>
          )}
        </button>
      </div>
      {error && (
        <p className="w-96 h-auto break-words text-center mt-5 text-red-500">
          {getError()}
        </p>
      )}
    </Fragment>
  );
};
