import { BigNumber, ethers, utils } from "ethers";
import Image from "next/image";
import { CountdownDisplay } from "../CountdownDisplay";
import { useCurrentAuctionInfo, useContractInfo, useTokenInfo } from "hooks";
import { compareAddress } from "@/utils/compareAddress";
import { SettleAuction } from "./SettleAuction";
import { PlaceBid } from "./PlaceBid";
import { HighestBidder } from "./HighestBidder";
import { Fragment, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { AuctionInfo, getBidHistory } from "@/services/nouns-builder/auction";
import { ContractInfo } from "@/services/nouns-builder/token";
import { usePreviousAuctions } from "@/hooks/fetch/usePreviousAuctions";
import { shortenAddress } from "@/utils/shortenAddress";
import { getAddress, size, zeroAddress } from "viem";
import useEnsName from "@/hooks/fetch/useEnsName";
import UserAvatar from "../UserAvatar";
import { useRouter } from "next/router";
import BidHistory from "./BidHistory";
import Loading from "../Loading";

// number of bids in history before full history button
const bidsShow = 2;

export default function Hero() {
  const { data: contractInfo } = useContractInfo();
  const { data: auctionInfo } = useCurrentAuctionInfo({
    auctionContract: contractInfo?.auction,
  });
  const { query, push } = useRouter();

  const currentTokenId = auctionInfo ? auctionInfo?.tokenId : "";

  const tokenId = query.tokenid
    ? BigNumber.from(query.tokenid as string).toHexString()
    : currentTokenId;

  const { data: tokenInfo } = useTokenInfo({ tokenId });
  const [imageLoaded, setImageLoaded] = useState(false);

  const pageBack = () => {
    const bnTokenId = BigNumber.from(tokenId);
    if (bnTokenId.eq(0)) return;
    setImageLoaded(false);
    push(`/token/${bnTokenId.sub(1).toNumber()}`, undefined, {
      shallow: true,
    });
  };

  const pageForward = () => {
    const bnTokenId = BigNumber.from(tokenId);
    if (bnTokenId.eq(currentTokenId)) return;
    push(`/token/${bnTokenId.add(1).toNumber()}`, undefined, {
      shallow: true,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 relative bg-transparent items-top h-full lg:max-h-[600px] p-4">
      <div className="flex flex-col min-h-auto lg:min-h-auto justify-baseline items-end lg:pr-4 relative mx-auto lg:mx-0">
        <div className="h-full w-full aspect-square flex items-center justify-around">
          {tokenInfo && (
            <Image
              src={tokenInfo.image.replace("api.zora.co", "nouns.build/api")}
              onLoad={() => setImageLoaded(true)}
              height={450}
              width={450}
              alt="Token"
              className={`h-full object-cover rounded-md z-20 ${imageLoaded ? "relative" : "hidden"}`}
              priority />
          )}
        </div>
        <div className={`${imageLoaded ? "hidden" : "absolute"} inset-0 flex justify-center items-center`}>
          <Loading />
        </div>
      </div>
      <div className="px-4 w-full lg:w-auto min-h-64 lg:h-full flex flex-col justify-stretch items-stretch mt-6 lg:mt-0">
        <div className="flex items-center mb-4">
          <button
            onClick={pageBack}
            className={`flex items-center ${tokenId === "0x00"
              ? "border border-skin-stroke"
              : "bg-skin-backdrop"
              } rounded-full p-2 mr-4`}
          >
            <ArrowLeftIcon
              className={`h-4 ${tokenId === "0x00" ? "text-skin-muted" : "text-skin-base"
                }`}
            />
          </button>
          <button
            onClick={pageForward}
            className={`flex items-center ${tokenId === currentTokenId
              ? "border border-skin-stroke"
              : "bg-skin-backdrop"
              } rounded-full p-2 mr-4`}
          >
            <ArrowRightIcon
              className={`h-4 ${tokenId === currentTokenId
                ? "text-skin-muted"
                : "text-skin-base"
                }`}
            />
          </button>
        </div>

        <div className="text-4xl font-heading text-skin-base font-semibold">
          {tokenInfo?.name || "---"}
        </div>

        {tokenId === currentTokenId ? (
          <CurrentAuction
            auctionInfo={auctionInfo}
            contractInfo={contractInfo}
            tokenId={currentTokenId}
            tokenImg={tokenInfo?.image || ""}
            tokenName={tokenInfo?.name || ""}
          />
        ) : (
          <EndedAuction
            auctionContract={contractInfo?.auction}
            tokenId={tokenId}
            owner={tokenInfo?.owner}
            tokenImg={tokenInfo?.image || ""}
            tokenName={tokenInfo?.name || ""}
          />
        )}
      </div>
    </div>
  );
}

const EndedAuction = ({
  auctionContract,
  tokenId,
  owner,
  tokenImg,
  tokenName,
}: {
  auctionContract?: string;
  tokenId?: string;
  owner?: `0x${string}`;
  tokenImg: string;
  tokenName: string;
}) => {
  const { data } = usePreviousAuctions({ auctionContract });
  const auctionData = data?.find((auction) =>
    compareAddress(auction.tokenId, tokenId || "")
  );

  const { data: ensName } = useEnsName(owner);

  return (
    <Fragment>
        <div className="flex flex-col gap-4 mt-4 pb-8 lg:pb-0">
          <div>
            <div className="text-lg text-skin-muted text-nowrap">{"Winning Bid"}</div>
            <div className="text-xl font-semibold sm:text-2xl text-skin-base">
              {auctionData ? (
                <>Ξ {utils.formatEther(auctionData.amount || "0")}</>
              ) : (
                <>n/a</>
              )}
            </div>
          </div>
        <div className="lg:w-64">
          <div className="text-lg text-skin-muted">{"Held by"}</div>

          <div className="flex items-center mt-2">
            <UserAvatar
              diameter={32}
              className="w-8 h-8 rounded-full mr-2"
              address={owner || ethers.constants.AddressZero}
            />
            <div className="text-xl font-semibold sm:text-2xl text-skin-base">
              {ensName?.ensName || shortenAddress(owner ? getAddress(owner) : ethers.constants.AddressZero, 0)}
            </div>
          </div>
        </div>
      </div>
      {/* <BidHistory bids={auctionData?.bids} numToShow={bidsShow} title="Last Bids" imgsrc={tokenImg.replace("api.zora.co", "nouns.build/api")} tokenName={tokenName || "0"} /> */}
    </Fragment>
  );
};

const CurrentAuction = ({
  auctionInfo,
  contractInfo,
  tokenId,
  tokenImg,
  tokenName,
}: {
  auctionInfo?: AuctionInfo;
  contractInfo?: ContractInfo;
  tokenId: string;
  tokenImg: string;
  tokenName: string;
}) => {
  const [theme] = useTheme();
  const { data: ensName } = useEnsName(auctionInfo?.highestBidder);

  // leilão finalizado - aguardando settle
  if ((auctionInfo?.endTime || 0) < Math.round(Date.now() / 1000)) {
    return (
      <Fragment>
        <div className="flex flex-col gap-4 mt-4 pb-8 lg:pb-0">
          <div>
            <div className="text-lg text-skin-muted text-nowrap">{"Winning Bid"}</div>
            <div className="text-xl font-semibold sm:text-2xl text-skin-base">
              {auctionInfo ? (
                <>Ξ {utils.formatEther(auctionInfo.highestBid || "0")}</>
              ) : (
                <>n/a</>
              )}
            </div>
          </div>
          <div className="w-auto">
            <div className="text-lg text-skin-muted">{"Held by"}</div>

            <div className="flex items-center">
              <UserAvatar
                diameter={32}
                className="w-8 h-8 rounded-full mr-2"
                address={auctionInfo?.highestBidder || ethers.constants.AddressZero}
              />
              <div className="text-xl font-semibold sm:text-2xl text-skin-base text-nowrap">
                {ensName?.ensName || shortenAddress(auctionInfo?.highestBidder ? getAddress(auctionInfo?.highestBidder) : ethers.constants.AddressZero, 2)}
              </div>
            </div>
          </div>
        </div>
        <SettleAuction auction={contractInfo?.auction} />
        {/* <BidHistory bids={auctionInfo?.bids} numToShow={bidsShow} title="Last Bids" imgsrc={tokenImg.replace("api.zora.co", "nouns.build/api")} tokenName={tokenName || "0"} /> */}
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div className="flex flex-col gap-4 mt-4 pb-8 lg:pb-0">
          <div>
            <div className="text-lg text-skin-muted text-nowrap">{"Winning Bid"}</div>
            <div className="text-xl font-semibold sm:text-2xl text-skin-base">
              {auctionInfo ? (
                <>Ξ {utils.formatEther(auctionInfo.highestBid || "0")}</>
              ) : (
                <>n/a</>
              )}
            </div>
          </div>
        <div className="lg:w-64">
          <div className="text-lg text-skin-muted">
            {theme.strings.auctionEndsIn || "Auction ends in"}
          </div>
          {auctionInfo && (
            <div className="text-xl font-semibold sm:text-2xl text-skin-base mt-2">
              <CountdownDisplay to={auctionInfo.endTime || "0"} />
            </div>
          )}
        </div>
      </div>
      <PlaceBid
        highestBid={auctionInfo?.highestBid || "0"}
        auction={contractInfo?.auction}
        tokenId={tokenId}
      />

      {/*auctionInfo?.highestBidder &&
        !compareAddress(
          auctionInfo?.highestBidder,
          ethers.constants.AddressZero
        ) && <HighestBidder address={auctionInfo?.highestBidder} />*/}

      {/* <BidHistory bids={auctionInfo?.bids} numToShow={bidsShow} title="Last Bids" imgsrc={tokenImg.replace("api.zora.co", "nouns.build/api")} tokenName={tokenName} /> */}
    </Fragment>
  );
};
