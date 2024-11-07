import { shortenAddress } from "@/utils/shortenAddress";
import useEnsName from "@/hooks/fetch/useEnsName";
import useEnsAvatar from "@/hooks/fetch/useEnsAvatar";

interface VoteListProps {
    proposal: Pick<SubGraphProposal, "proposalId" | "votes" | "forVotes" | "againstVotes" | "abstainVotes">;
}

export type SubGraphProposal = {
    proposalId: string;
    title: string;
    proposer: string;
    status: string;
    description: string;
    forVotes: number;
    againstVotes: number;
    proposalNumber: number;
    abstainVotes: number;
    quorumVotes: number;
    expiresAt: number;
    snapshotBlockNumber: number;
    transactionHash: string;
    voteStart: number;
    voteEnd: number;
    votes: {
        voter: string;
        support: "FOR" | "AGAINST" | "ABSTAIN";
        weight: number;
        reason: string;
    }[];
};

const VoteItem = ({
    voter,
    support,
    weight,
    reason,
    totalWeight,
}: {
    voter: string;
    support: "FOR" | "AGAINST" | "ABSTAIN";
    weight: number;
    reason: string;
    totalWeight: number;
}) => {
    const { data: ensNameData } = useEnsName(voter as `0x${string}`);
    const ensName = ensNameData?.ensName;
    const displayName = ensName || shortenAddress(voter);

    const { data: ensAvatarData } = useEnsAvatar(voter as `0x${string}`);
    const ensAvatar = ensAvatarData?.ensAvatar;

    const votePercentage = totalWeight > 0 ? ((weight / totalWeight) * 100).toFixed(2) : "0.00";

    return (
        <div className="flex mb-4 p-4 border border-skin-stroke rounded-md items-center">
            <img
                src={ensAvatar || "/sktloading.gif"}
                alt="ENS Avatar"
                className="w-8 h-8 rounded-full mr-4"
            />
            <div>
                <div className="flex items-center">
                    <span className="font-bold">{displayName}</span>
                    <span className="ml-2 text-skin-muted">voted</span>
                    <span
                        className={`ml-2 ${support === "FOR"
                            ? "text-green-500"
                            : "text-red-500"
                            }`}
                    >
                        {support}
                    </span>
                    <span className="ml-2">with {weight} votes</span>
                    <span className="ml-2 text-blue-500">{votePercentage}%</span>
                </div>
                <div>
                    <span className="font-semibold">Reason:</span>{" "}
                    {reason || "No reason provided"}
                </div>
            </div>
        </div>
    );
};

const VoteList = ({ proposal }: VoteListProps) => {
    const totalWeight = proposal.votes.reduce((sum, vote) => sum + vote.weight, 0);

    console.log({ proposal });

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Votes</h2>
            {proposal.votes.length > 0 ? (
                proposal.votes
                    .sort((a, b) => b.weight - a.weight)
                    .map((vote, index) => (
                        <VoteItem
                            key={index}
                            voter={vote.voter}
                            support={vote.support}
                            weight={vote.weight}
                            reason={vote.reason}
                            totalWeight={totalWeight}
                        />
                    ))
            ) : (
                <p>No votes available.</p>
            )}
        </div>
    );
};

export default VoteList;
