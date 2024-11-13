import Hero from "@/components/Hero/Hero";
import Loading from "@/components/Loading";
import NewsCard from "@/components/News/NewsCard";
import ProposalCards from "@/components/Proposals/ProposalCards";
import { DAO_ADDRESS } from "constants/addresses";
import { ZORA_FEATURED_URL } from "constants/urls";
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
import { createElement, Fragment, SyntheticEvent, useState } from "react";
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
  const addresses = DAO_ADDRESS;

  console.log(addresses.nft)

  const [contract, auction] = await Promise.all([
    getContractInfo({ address: addresses.nft }),
    getCurrentAuction({ address: addresses.auction }),
  ]);

  const tokenId = auction.tokenId;
  const token = await getTokenInfo({
    address: addresses.nft,
    tokenid: tokenId,
  });

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
    // No FAQ directory
  }

  if (!contract.image) contract.image = "";

  return {
    props: {
      tokenContract: addresses.nft,
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
      <div className="flex flex-col flex-grow text-skin-base">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <IframeLoader src={ZORA_FEATURED_URL} />
          <div className="col-span-1 rounded-xl border border-skin-stroke bg-skin-fill max-w-full">
            <Hero />
          </div>
        </div>
        <span className="text-xl lg:text-3xl mt-8 mb-2 font-heading text-skin-highlighted">Proposals</span>
        <ProposalCards />
        <span className="text-xl lg:text-3xl mt-8 mb-2 font-heading text-skin-highlighted">Propdates and News</span>
        <NewsCard />
      </div>
    </SWRConfig>
  );
}


const IframeLoader = ({ src }: { src: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isDarkMode = document.documentElement.classList.contains("dark");

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const iframeSrc = isDarkMode ? `${src}&theme=dark` : src;

  return (
    <div className={`col-span-1 rounded-xl h-[400px] 2xl:h-auto relative ${isLoaded ? "bg-skin-fill dark:bg-black" : "border border-skin-stroke dark:border-gray-800 rounded-xl"}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex justify-center items-center bg-skin-fill dark:bg-black opacity-75">
          <Loading />
        </div>
      )}
      <iframe
        src={iframeSrc}
        onLoad={handleLoad}
        width="100%"
        height="100%"
        title="Zora iFrame"
        className="allow-pointer-lock allow-same-origin allow-scripts allow-popups rounded-xl"
        style={isLoaded ? {} : { display: "none" }}
      />
    </div>
  );
};


