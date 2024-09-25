import Hero from "@/components/Hero/Hero";
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
import { Fragment } from "react";
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
        <a className="text-2xl sm:text-3xl lg:text-5xl mb-2">Discover</a>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 2xl:h-[460px]">
          <div className="col-span-1 rounded-xl h-[240px] lg:h-[440px] 2xl:h-auto">
            <iframe
              src="https://zora.co/collect/base:0xf9a6470c704e391a64d1565ba4d50ad9c456b1dc/6/embed?referrer=0x39a7B6fa1597BB6657Fe84e64E3B836c37d6F75d"
              sandbox="allow-pointer-lock allow-same-origin allow-scripts allow-popups"
              width="100%"
              height="100%"
            ></iframe>
          </div>
          <div className="col-span-1 rounded-xl border border-zinc-200 max-w-full">
            <Hero />
          </div>
        </div>
        <a className="text-xl lg:text-3xl mt-4 mb-2">News</a>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] md:h-[220px]">
          <div className="bg-lime-300 rounded-xl"></div>
          <div className="bg-red-300 rounded-xl"></div>
          <div className="bg-blue-300 rounded-xl"></div>
        </div>
        <a className="text-xl lg:text-3xl mt-4 mb-2">Updates</a>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:h-[220px] h-[840px]">
          <div className="bg-lime-300 rounded-xl"></div>
          <div className="bg-red-300 rounded-xl"></div>
          <div className="bg-blue-300 rounded-xl"></div>
          <div className="bg-lime-300 rounded-xl"></div>
          <div className="bg-red-300 rounded-xl"></div>
          <div className="bg-blue-300 rounded-xl"></div>
        </div>
      </div>
    </SWRConfig>
  );
}
