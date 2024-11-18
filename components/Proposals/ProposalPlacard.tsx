import Link from "next/link";
import { Proposal } from "@/services/nouns-builder/governor";
import { extractImageUrl } from "@/utils/getProposalImage";
import ProposalStatus from "../ProposalStatus";
import { getProposalName } from "@/utils/getProposalName";
// ProposalPlacard component
export const ProposalPlacard = ({
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
                    <div className="text-xl text-skin-base flex items-center mb-3">
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

export default ProposalPlacard;