import Hero from "@/components/Hero/Hero";
import Loading from "@/components/Loading";
import NewsCard from "@/components/News/NewsCard";
import ProposalCards from "@/components/Proposals/ProposalCards";
import { getAddresses } from "@/services/nouns-builder/manager";
import { AuctionInfo, getCurrentAuction } from "data/nouns-builder/auction";
import {
  ContractInfo,
  getContractInfo,
  getTokenInfo,
  TokenInfo,
} from "data/nouns-builder/token";
import { promises as fs } from "fs";
import { useIsMounted } from "hooks/useIsMounted";
import { GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import { Fragment, useState } from "react";
import { SWRConfig } from "swr";

type MarkdownSource = MDXRemoteSerializeResult<Record<string, unknown>>;

export const getStaticProps = async (): Promise<
  GetStaticPropsResult<{
    tokenContract: string;
    tokenId: string;
    contract: ContractInfo;
    token: TokenInfo;
    auction: AuctionInfo;
    descriptionSource: MarkdownSource;
    faqSources: MarkdownSource[];
  }>
> => {
  // Get token and auction info
  const tokenContract = process.env
    .NEXT_PUBLIC_TOKEN_CONTRACT! as `0x${string}`;

  const addresses = await getAddresses({ tokenAddress: tokenContract });

  const [contract, auction] = await Promise.all([
    getContractInfo({ address: tokenContract }),
    getCurrentAuction({ address: addresses.auction }),
  ]);

  const tokenId = auction.tokenId;
  const token = await getTokenInfo({
    address: tokenContract,
    tokenid: tokenId,
  });

  // Get description and faq markdown

  const templateDirectory = path.join(process.cwd(), "templates");
  const descFile = await fs.readFile(
    templateDirectory + "/home/description.md",
    "utf8"
  );
  const descMD = await serialize(descFile);

  let faqSources: MarkdownSource[] = [];
  try {
    const faqFiles = await fs.readdir(templateDirectory + "/home/faq", {
      withFileTypes: true,
    });

    faqSources = await Promise.all(
      faqFiles
        .filter((dirent) => dirent.isFile())
        .map(async (file) => {
          const faqFile = await fs.readFile(
            templateDirectory + "/home/faq/" + file.name,
            "utf8"
          );

          return serialize(faqFile, { parseFrontmatter: true });
        })
    ).then((x) =>
      x.sort(
        (a, b) =>
          Number(a.frontmatter?.order || 0) - Number(b.frontmatter?.order || 0)
      )
    );
  } catch {
    //Do Nothing (no FAQ directory)
  }

  if (!contract.image) contract.image = "";

  return {
    props: {
      tokenContract,
      tokenId,
      contract,
      token,
      auction,
      descriptionSource: descMD,
      faqSources,
    },
    revalidate: 60,
  };
};

export default function SiteComponent({
  tokenContract,
  tokenId,
  contract,
  token,
  auction,
  descriptionSource,
  faqSources,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isMounted = useIsMounted();

  if (!isMounted) return <Fragment />;

  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/token/${tokenContract}`]: contract,
          [`/api/token/${tokenContract}/${tokenId}`]: token,
          [`/api/auction/${contract.auction}`]: auction,
        },
      }}
    >
      <div className="flex flex-col flex-grow">
        <span className="text-2xl sm:text-3xl lg:text-5xl mb-2">Discover</span>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <IframeLoader src="https://zora.co/collect/base:0xf9a6470c704e391a64d1565ba4d50ad9c456b1dc/10/embed?referrer=0x41CB654D1F47913ACAB158a8199191D160DAbe4A" />
          <div className="col-span-1 rounded-xl border border-zinc-200 max-w-full">
            <Hero />
          </div>
        </div>
        <span className="text-xl lg:text-3xl mt-4 mb-2">Props</span>
        <ProposalCards />
        <span className="text-xl lg:text-3xl mt-4 mb-2">Propdates and News</span>
        <NewsCard />
      </div>
    </SWRConfig>
  );
}

const IframeLoader = ({ src }: { src: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true)
  };

  return (
    <div className={`col-span-1 rounded-xl h-[240px] lg:h-full 2xl:h-auto relative ${isLoaded ? "" : "border border-zinc-200"}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex justify-center items-center">
          <Loading />
        </div>
      )}
      <iframe
        src={src}
        onLoad={handleLoad}
        width="100%"
        height="100%"
        title="Zora iFrame"
        className="allow-pointer-lock allow-same-origin allow-scripts allow-popups"
        style={isLoaded ? {} : { display: "none" }}
      />
    </div>
  );
};