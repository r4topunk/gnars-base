import { useState } from "react";
import { useDAOAddresses, useGetAllProposals } from "hooks/fetch";
import { TOKEN_CONTRACT } from "constants/addresses";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { getProposalName } from "@/utils/getProposalName";
import ProposalStatus from "@/components/ProposalStatus";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useEnsName } from "wagmi";
import { shortenAddress } from "@/utils/shortenAddress";
import { getProposalDescription } from "@/utils/getProposalDescription";
import { ETHERSCAN_BASEURL } from "constants/urls";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { ProposedTransactions, TransferTransaction } from "@/components/DAO/Transaction";
import { BASE_SENDIT_TOKEN_ADDRESS, BASE_USDC_TOKEN_ADDRESS } from "constants/gnarsDao";
import { VoteButton } from "@/components/DAO/VoteButton";
import ProgressBar from "@/components/DAO/ProgressBar";
import { getTime } from "@/utils/getTime";
import VoteList, { SubGraphProposal } from "@/components/DAO/voteList";
import { useFetchProposalVotes } from "@/hooks/fetch/useFetchProposalVotes";

export default function ProposalComponent() {
  const { data: addresses } = useDAOAddresses({
    tokenContract: TOKEN_CONTRACT,
  });
  const { data: proposals } = useGetAllProposals({
    governorContract: addresses?.governor,
  });
  const { query: { proposalid } } = useRouter();

  const proposal = proposals?.find((x) => x.proposalId === proposalid);
  const proposalNumber = proposals
    ? proposals.length - proposals.findIndex((x) => x.proposalId === proposalid)
    : 0;

  const { data: ensName } = useEnsName({
    address: proposal?.proposal.proposer,
  });

  const { votes, loading } = useFetchProposalVotes(proposal?.proposalId || "");
  const completeProposal = { ...proposal, votes };

  const [selectedTab, setSelectedTab] = useState("Description");

  if (!proposal)
    return (
      <Layout>
        <div className="flex items-center justify-around mt-8">
          <Image src={"/spinner.svg"} alt="spinner" width={30} height={30} />
        </div>
      </Layout>
    );

  const { forVotes, againstVotes, abstainVotes, voteEnd, voteStart } = proposal?.proposal || {};

  const getVotePercentage = (votes: number) => {
    if (!proposal || !votes) return 0;
    const total = forVotes + againstVotes + abstainVotes;

    const value = Math.round((votes / total) * 100);
    if (value > 100) return 100;
    return value;
  };

  const getDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);

    const month = date.toLocaleString("default", { month: "long" });
    return `${month} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="max-w-[800px] mx-auto mt-4 text-skin-base">
      <div className="flex flex-col sm:flex-row items-baseline justify-between">
        <div className="flex items-baseline">
          <Link
            href="/vote"
            className="flex items-center border border-skin-stroke hover:bg-skin-muted dark:hover:bg-skin-muted-dark rounded-full p-2 mr-4"
          >
            <ArrowLeftIcon className="h-4 text-skin-muted dark:text-skin-muted-dark" />
          </Link>
          <div>
            <div className="flex items-center">
              <div className="font-heading text-2xl text-skin-muted dark:text-skin-muted-dark mr-4 break-words">
                Proposal {proposalNumber}
              </div>
              <ProposalStatus proposal={proposal} />
            </div>
            <div className="mt-2 text-5xl font-heading text-skin-base font-semibold">
              {getProposalName(proposal.description)}
            </div>
            <div className="mt-4 text-2xl font-heading text-skin-muted dark:text-skin-muted-dark">
              Proposed by{" "}
              <Link
                href={`${ETHERSCAN_BASEURL}/address/${proposal.proposal.proposer}`}
                rel="noopener noreferrer"
                target="_blank"
                className="text-skin-highlighted dark:text-skin-highlighted-dark underline"
              >
                {ensName || shortenAddress(proposal.proposal.proposer)}
              </Link>
            </div>
          </div>
        </div>
        <VoteButton proposal={proposal} proposalNumber={proposalNumber} />
      </div>

      <div className="items-center w-full grid grid-cols-3 gap-4 mt-12">
        <div className="w-full bg-skin-muted dark:bg-skin-muted-dark border border-skin-stroke dark:border-skin-stroke-dark rounded-xl p-6">
          <ProgressBar
            label="For"
            type="success"
            value={forVotes}
            percentage={getVotePercentage(forVotes)}
          />
        </div>
        <div className="w-full bg-skin-muted dark:bg-skin-muted-dark border border-skin-stroke dark:border-skin-stroke-dark rounded-xl p-6">
          <ProgressBar
            label="Against"
            type="danger"
            value={againstVotes}
            percentage={getVotePercentage(againstVotes)}
          />
        </div>
        <div className="w-full bg-skin-muted dark:bg-skin-muted-dark border border-skin-stroke dark:border-skin-stroke-dark rounded-xl p-6">
          <ProgressBar
            label="Abstain"
            type="muted"
            value={abstainVotes}
            percentage={getVotePercentage(abstainVotes)}
          />
        </div>
      </div>

      <div className="items-center w-full grid sm:grid-cols-3 gap-4 mt-4">
        <div className="w-full border border-skin-stroke dark:border-skin-stroke-dark rounded-xl p-6 flex justify-between items-center sm:items-baseline">
          <div className="font-heading text-xl text-skin-muted dark:text-skin-muted-dark">Threshold</div>
          <div className="text-right">
            <div className="text-skin-muted dark:text-skin-muted-dark">Current Threshold</div>
            <div className="font-semibold">{proposal.proposal.quorumVotes || 1} Quorum</div>
          </div>
        </div>

        <div className="w-full border border-skin-stroke dark:border-skin-stroke-dark rounded-xl p-6 flex justify-between items-center sm:items-baseline">
          <div className="font-heading text-xl text-skin-muted dark:text-skin-muted-dark">Ends</div>
          <div className="text-right">
            <div className="text-skin-muted dark:text-skin-muted-dark">{getTime(voteEnd)}</div>
            <div className="font-semibold">{getDate(voteEnd)}</div>
          </div>
        </div>

        <div className="w-full border border-skin-stroke dark:border-skin-stroke-dark rounded-xl p-6 flex justify-between items-center sm:items-baseline">
          <div className="font-heading text-xl text-skin-muted dark:text-skin-muted-dark">Snapshot</div>
          <div className="text-right">
            <div className="text-skin-muted dark:text-skin-muted-dark">{getTime(voteStart)}</div>
            <div className="font-semibold">{getDate(voteStart)}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <div
          onClick={() => setSelectedTab("Description")}
          className={`text-2xl font-heading font-bold cursor-pointer ${selectedTab === "Description" ? "text-skin-base underline dark:text-skin-base-dark" : "text-skin-muted dark:text-skin-muted-dark"}`}
        >
          Description
        </div>
        <div
          onClick={() => setSelectedTab("Voting History")}
          className={`text-2xl font-heading font-bold cursor-pointer ${selectedTab === "Voting History" ? "text-skin-base underline dark:text-skin-base-dark" : "text-skin-muted dark:text-skin-muted-dark"}`}
        >
          Voting History
        </div>
      </div>

      {selectedTab === "Description" && (
        <div className="mt-12">
          <ReactMarkdown
            className="prose prose-skin mt-4 prose-img:w-auto break-words max-w-full dark:prose-invert"
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            remarkPlugins={[remarkGfm]}
          >
            {getProposalDescription(proposal.description)}
          </ReactMarkdown>
          <div className="text-2xl font-heading text-skin-base dark:text-skin-base-dark mt-8 font-bold">Proposed Transactions</div>
          <div className="mt-4 max-w-[75vw] flex flex-col gap-4">
            {proposal.targets.map((_, index) =>
              [BASE_USDC_TOKEN_ADDRESS, BASE_SENDIT_TOKEN_ADDRESS].includes(proposal.targets[index]) ? (
                <TransferTransaction
                  key={index}
                  target={proposal.targets[index]}
                  value={proposal.values[index]}
                  calldata={proposal.calldatas[index]}
                />
              ) : (
                <ProposedTransactions
                  key={index}
                  target={proposal.targets[index]}
                  value={proposal.values[index]}
                  calldata={proposal.calldatas[index]}
                />
              )
            )}
          </div>
        </div>
      )}

      {selectedTab === "Voting History" && (
        <div className="mt-12">
          <VoteList proposal={{ ...proposal, votes } as unknown as SubGraphProposal} />
        </div>
      )}
    </div>
  );
}
