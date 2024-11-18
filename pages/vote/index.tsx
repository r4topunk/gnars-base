import { useState } from "react";
import { TOKEN_CONTRACT } from "constants/addresses";
import Link from "next/link";
import { useDAOAddresses, useGetAllProposals, useTreasuryBalance } from "hooks";
import { getProposalName } from "@/utils/getProposalName";
import { promises as fs } from "fs";
import path from "path";
import { GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Fragment } from "react";
import { useUserVotes } from "@/hooks/fetch/useUserVotes";
import { useCurrentThreshold } from "@/hooks/fetch/useCurrentThreshold";
import Loading from "@/components/Loading";
import ProposalPlacard from "@/components/Proposals/ProposalPlacard";
import TreasureDisplay from "@/components/DAO/TreasureDisplay";

export const getStaticProps = async (): Promise<GetStaticPropsResult<{
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

  const { data: userVotes } = useUserVotes();
  const { data: currentThreshold } = useCurrentThreshold({
    governorContract: addresses?.governor,
  });

  const [selectedTab, setSelectedTab] = useState<"all" | "onboarding">("all");


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
            DONT! Submit proposal
          </Link>
        ) : (
          <Fragment />
        )}
      </div>
      <TreasureDisplay />
      <div className="mt-12">
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
    </div>
  );
}





