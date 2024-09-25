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
import {
  HomeIcon,
  LightBulbIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  QueueListIcon,
  TableCellsIcon,
} from "@heroicons/react/20/solid";
import CustomConnectButton from "@/components/CustomConnectButton";
import Hero from "@/components/Hero/Hero";

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
      <div className="bg-skin-backdrop text-skin-base h-screen flex">
        <div className="w-[220px] flex flex-col px-8 py-4">
          <a className="text-3xl mb-8">Gnars</a>
          <div className="w-[220px] flex flex-col">
            <a>MENU</a>
            <div className="font-xl flex flex-col pt-4 gap-4">
              <button className="flex gap-2 items-center">
                <div className="p-2 rounded-lg bg-[#CA6CFF]">
                  <HomeIcon width={"18px"} color="white" />
                </div>
                <a className="">Discover</a>
              </button>
              <button className="flex gap-2 items-center group">
                <div className="p-2 bg-zinc-200 rounded-lg group-hover:bg-[#CA6CFF] group-hover:shadow-sm">
                  <LinkIcon width={"18px"} color="black" className="color-white" />
                </div>
                <a className="">Gnars</a>
              </button>
              <button className="flex gap-2 items-center group">
                <div className="p-2 bg-zinc-200 rounded-lg group-hover:bg-[#CA6CFF] group-hover:shadow-sm">
                  <LightBulbIcon width={"18px"} color="black" />
                </div>
                <a className="">About</a>
              </button>
              <button className="flex gap-2 items-center group">
                <div className="p-2 bg-zinc-200 rounded-lg group-hover:bg-[#CA6CFF] group-hover:shadow-sm">
                  <QueueListIcon width={"18px"} color="black" />
                </div>
                <a className="">Proposals</a>
              </button>
              <button className="flex gap-2 items-center group">
                <div className="p-2 bg-zinc-200 rounded-lg group-hover:bg-[#CA6CFF] group-hover:shadow-sm">
                  <TableCellsIcon width={"18px"} color="black" />
                </div>
                <a className="">Propdates</a>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-grow h-full overflow-y-auto overflow-x-hidden">
          <div className="w-full p-4 flex justify-between ml-2">
            <div></div>
            <div className="flex w-full max-w-[450px] bg-gray-200 rounded-lg pr-2 items-center">
              <input
                type="text"
                className="w-full h-[34px] border-none bg-transparent text-sm font-medium pl-4 pr-2 shadow-sm placeholder-gray-400 focus:outline-none"
                placeholder="Search..."
              />
              <MagnifyingGlassIcon width={"18px"} />
            </div>
            <CustomConnectButton className="px-6 h-10 rounded-xl border transition ease-in-out hover:scale-110 text-xl" />
          </div>
          <div className="flex flex-col flex-grow p-4">
            <a className="text-5xl ml-2 mb-2">Discover</a>
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
            <a className="text-3xl mt-4 mb-2 ml-2">News</a>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] md:h-[220px]">
              <div className="bg-lime-300 rounded-xl"></div>
              <div className="bg-red-300 rounded-xl"></div>
              <div className="bg-blue-300 rounded-xl"></div>
            </div>
            <a className="text-3xl mt-4 mb-2 ml-2">Updates</a>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:h-[220px] h-[840px]">
              <div className="bg-lime-300 rounded-xl"></div>
              <div className="bg-red-300 rounded-xl"></div>
              <div className="bg-blue-300 rounded-xl"></div>
              <div className="bg-lime-300 rounded-xl"></div>
              <div className="bg-red-300 rounded-xl"></div>
              <div className="bg-blue-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </SWRConfig>
  );
}
