import { Address } from "viem";
import { BigNumber } from "ethers";
import useSWR from "swr";
import { ETHER_ACTOR_BASEURL, ETHERSCAN_BASEURL } from "constants/urls";
// import Skeleton from "./Transactions/Skeleton";
// import { Address } from "viem";
import { useTokenInfo } from "@/hooks/fetch";
import Skeleton from "./Skeleton";
import FormatedTransactionValue from "./FormatedTransactionValue";
import TransactionCardWrapper from "./TransactionCardWrapper";

type EtherActorResponse = {
    name: string;
    decoded: string[];
    functionName: string;
    isVerified: boolean;
  };

const NFTTransferTransaction = ({
    target,
    // decoded,
    calldata,
}: {
    target: string;
    // decoded: string[];
    calldata: string;
}) => {
    const { data, error } = useSWR<EtherActorResponse>(
        calldata && calldata !== "0x" ? `${ETHER_ACTOR_BASEURL}/decode/${target}/${calldata}` : null
    );

    if (!data && calldata && calldata !== "0x") return <Skeleton />;
    if (error) return <div>Error loading transaction data</div>;

    const functionName = data?.functionName || "transfer";
    const toAddress = data?.decoded?.[0] as Address | undefined;

    const tokenId = decoded?.[2];
    const fromAddress = decoded?.[0] as Address | undefined;
    // const toAddress = decoded?.[1] as Address | undefined;
    const { data: tokenInfo, error: tokenError } = useTokenInfo({ tokenId });

    console.log("NFTTransferTransaction", { target, decoded, tokenId, fromAddress, toAddress, tokenInfo, tokenError });

    // Check for loading and error states
    if (!tokenInfo && !tokenError) return <Skeleton />;
    if (tokenError) return <div>Error loading NFT data</div>;

    // Ensure tokenInfo.image is a valid URL (adjust for IPFS or other formats if necessary)
    const imageUrl = tokenInfo?.image?.startsWith("ipfs://")
        ? `https://ipfs.io/ipfs/${tokenInfo.image.slice(7)}`
        : tokenInfo?.image;

    return (
        <TransactionCardWrapper title="Transfer NFT">
            <div className="flex flex-col items-center space-y-4">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={tokenInfo?.name || "NFT Image"}
                        className="w-24 h-24 object-cover rounded-lg shadow-md"
                    />
                ) : (
                    <div className="flex items-center justify-center w-24 h-24 bg-gray-200 text-gray-500 rounded-lg">
                        No Image Available
                    </div>
                )}
                <div className="transaction-detail">
                    <span className="font-semibold text-gray-600">Token ID:</span>
                    <span className="ml-2 text-gray-800 dark:text-gray-300">{tokenId || "N/A"}</span>
                </div>
                <div className="transaction-detail flex items-center gap-2">
                    <span className="font-semibold text-gray-600">From:</span>
                    {fromAddress ? (
                        <FormatedTransactionValue address={fromAddress} />
                    ) : (
                        <span className="text-gray-500">Address not available</span>
                    )}
                </div>
                <div className="transaction-detail flex items-center gap-2">
                    <span className="font-semibold text-gray-600">To:</span>
                    {toAddress ? (
                        <FormatedTransactionValue address={toAddress} />
                    ) : (
                        <span className="text-gray-500">Address not available</span>
                    )}
                </div>
            </div>
        </TransactionCardWrapper>
    );
};

export default NFTTransferTransaction;
