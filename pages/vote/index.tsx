import { useState } from "react";
import Layout from "@/components/Layout";
import { Proposal } from "@/services/nouns-builder/governor";
import { TOKEN_CONTRACT, BASE_USDC_TOKEN_ADDRESS, BASE_SENDIT_TOKEN_ADDRESS, BASE_WETH_TOKEN_ADDRESS } from "constants/addresses";
import Link from "next/link";
import { useDAOAddresses, useGetAllProposals, useTreasuryBalance } from "hooks";
import { getProposalName } from "@/utils/getProposalName";
import ProposalStatus from "@/components/ProposalStatus";
import { promises as fs } from "fs";
import path from "path";
import { GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { formatTreasuryBalance } from "@/utils/formatTreasuryBalance";
import { Fragment } from "react";
import { useUserVotes } from "@/hooks/fetch/useUserVotes";
import { useCurrentThreshold } from "@/hooks/fetch/useCurrentThreshold";
import Loading from "@/components/Loading";
import { extractImageUrl } from "@/utils/getProposalImage";
import { TokenDataRender } from "@/components/DAO/Transaction";

export const getStaticProps = async (): Promise<
  GetStaticPropsResult<{
    descriptionSource: MDXRemoteSerializeResult<Record<string, unknown>>;
  }>
> => {
  // Get description markdown
  const templateDirectory = path.join(process.cwd(), "templates");
  const descFile = await fs.readFile(
    templateDirectory + "/vote/description.md",
    "utf8"
  );
  const descMD = await serialize(descFile);

  return {
    props: {
      descriptionSource: descMD,
    },
    revalidate: 60,
  };
};

export default function Vote({
  descriptionSource,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: addresses } = useDAOAddresses({
    tokenContract: TOKEN_CONTRACT,
  });
  const { data: proposals } = useGetAllProposals({
    governorContract: addresses?.governor,
  });
  const { data: treasuryBalance } = useTreasuryBalance({
    treasuryContract: addresses?.treasury,
  });
  const { data: userVotes } = useUserVotes();
  const { data: currentThreshold } = useCurrentThreshold({
    governorContract: addresses?.governor,
  });

  const [selectedTab, setSelectedTab] = useState<"all" | "onboarding">("all");

  const tokenAddresses = [
    { address: BASE_USDC_TOKEN_ADDRESS, name: "USDC" },
    { address: BASE_SENDIT_TOKEN_ADDRESS, name: "SENDIT" },
    { address: BASE_WETH_TOKEN_ADDRESS, name: "WETH" },
  ];

  const getProposalNumber = (i: number) => {
    if (!proposals) return 0;
    return proposals.length - i;
  };

  const filteredProposals = selectedTab === "onboarding"
    ? proposals?.filter(proposal =>
      getProposalName(proposal.description).toLowerCase().includes("onboarding")
    )
    : proposals;

  return (
    // <Layout>
    <div className="max-w-[800px] mx-auto">
      <div className="flex justify-between">
        <div className="text-4xl relative font-heading text-skin-muted">
          Governance
        </div>
        {userVotes && userVotes >= (currentThreshold || 0) ? (
          <Link
            href={"/create-proposal"}
            className="text-sm hover:bg-skin-button-accent-hover hover:text-skin-inverted text-skin-muted w-36 h-8 rounded-lg flex items-center justify-around border border-amber-500 mt-2"
          >
            Submit proposal
          </Link>
        ) : (
          <Fragment />
        )}
      </div>
      <div className="border border-skin-stroke rounded-2xl py-6 sm:py-0 px-6 mt-6 flex flex-col sm:flex-row sm:items-center justify-between sm:h-32">
        <div className="sm:py-6 h-full flex gap-4">
          <div className="font-heading text-2xl text-skin-muted">Treasury</div>
          {/* <div className="text-4xl font-bold font-heading mt-2 text-skin-base"> */}
            {/* Ξ {treasuryBalance ? formatTreasuryBalance(treasuryBalance) : "0"} + 117k USD */}
            {/* Total USD value: {treasuryBalance?.totalBalance.toFixed(2)} USD */}
            <div className="mt-1">
              {treasuryBalance?.tokens.map((tokenData) => {
                const token = tokenData.token
                return (
                  <div key={token.address}>
                    <div className="text-base">
                      {token.name} {token.balance}
                    </div>
                  </div>
                )
              })}
            {/* </div> */}
          </div>
        </div>
        <div className="sm:w-1/3 mt-4 sm:mt-0 sm:border-l border-skin-stroke sm:pl-6 h-full flex items-center text-skin-muted">
          This treasury exists for DAO participants to allocate resources for
          the long-term growth and prosperity of the project.
        </div>
      </div>
      <div className="mt-12">
        {/* Tab navigation */}
        <div className="flex items-center justify-between">
          <button
            className={`text-2xl font-heading text-skin-base ${selectedTab === "all" ? "border-b-2 border-amber-400" : ""}`}
            onClick={() => setSelectedTab("all")}
          >
            All Proposals
          </button>
          <button
            className={`text-2xl font-heading text-skin-base ${selectedTab === "onboarding" ? "border-b-2 border-amber-400" : ""}`}
            onClick={() => setSelectedTab("onboarding")}
          >
            Onboarding Proposals
          </button>

        </div>
        {/* Proposal listing */}
        <div className={`${proposals ? "hidden" : "absolute"} inset-0 flex justify-center items-center`}>
          <Loading />
        </div>
        <div>
          {filteredProposals?.map((x, i) => (
            <ProposalPlacard
              key={i}
              proposal={x}
              proposalNumber={getProposalNumber(i)}
              showThumbnail={selectedTab === "onboarding"}
            />
          ))}
        </div>
      </div>
      {/* </Layout> */}
    </div>
  );
}

// ProposalPlacard component
const ProposalPlacard = ({
  proposal,
  proposalNumber,
  showThumbnail,
}: {
  proposal: Proposal;
  proposalNumber: number;
  showThumbnail: boolean;
}) => {
  // Check for image in proposal description
  const imageUrl = extractImageUrl(proposal.description);

  // Access votes from proposal.proposal (nested ProposalDetails)
  const { forVotes, againstVotes, abstainVotes } = proposal.proposal;

  // Calculate total votes
  const totalVotes = forVotes + againstVotes + abstainVotes;

  // Calculate percentages for For, Against, and Abstain
  const forPercentage = totalVotes > 0 ? (forVotes / totalVotes) * 100 : 0;
  const againstPercentage =
    totalVotes > 0 ? (againstVotes / totalVotes) * 100 : 0;
  const abstainPercentage =
    totalVotes > 0 ? (abstainVotes / totalVotes) * 100 : 0;

  return (
    <Link
      href={`/vote/${proposal.proposalId}`}
      className="flex items-center justify-between w-full bg-skin-muted hover:bg-skin-backdrop border border-skin-stroke p-4 my-6 rounded-2xl gap-4 hover:scale-[1.01]"
    >
      <div className="flex flex-col items-start pr-4 w-full">
        <div className="flex items-center pr-4">
          <div className="text-xl font-semibold text-skin-base flex items-center mb-3">
            {showThumbnail && imageUrl ? (
              <img
                src={imageUrl}
                alt="Proposal Thumbnail"
                className="w-32 h-32 rounded-lg mr-4 object-cover aspect-square"
              />
            ) : (
              <span className="text-skin-muted mr-3 sm:mr-4 sm:ml-2">
                {proposalNumber}
              </span>
            )}
            {getProposalName(proposal.description)}
          </div>
        </div>

        {/* Voting Bar */}
        {!showThumbnail && (
          <div className="flex-1 mx-2 w-full">
            <div className="h-3 w-full bg-gray-200 rounded-full flex overflow-hidden">
              <div
                className="bg-green-500"
                style={{ width: `${forPercentage}%` }}
              ></div>
              <div
                className="bg-yellow-500"
                style={{ width: `${abstainPercentage}%` }}
              ></div>
              <div
                className="bg-red-500"
                style={{ width: `${againstPercentage}%` }}
              ></div>

            </div>
            {/* <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-300">For: {forVotes}</span>
            <span className="text-skin-muted">Abstain: {abstainVotes}</span>
            <span className="text-skin-muted">Against: {againstVotes}</span>
          </div> */}
          </div>
        )}
      </div>
      <ProposalStatus proposal={proposal} />
    </Link>
  );
};


