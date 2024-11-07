import React, { useState } from "react";
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
        <div className="flex mb-4 p-4 pt-3 border !border-opacity-10 rounded-md items-center group">
            <img
                src={ensAvatar || "/default_user.png"}
                alt="ENS Avatar"
                className="w-8 h-8 rounded-full mr-2 place-self-start"
            />
            <div className="w-full">
                <div className="flex items-center">
                    <span className="font-bold">{displayName}</span>
                    <span className="ml-1 text-skin-muted">voted</span>
                    <span
                        className={`ml-1 ${support === "FOR"
                            ? "text-green-500"
                            : support === "AGAINST"
                            ? "text-red-500"
                            : "text-gray-500"
                            }`}
                    >
                        {support}
                    </span>
                    <span className="ml-1">with<span className="text-blue-400 mx-1">{weight}</span>votes</span>
                    <span className="ml-1 text-blue-500 hidden group-hover:block">({votePercentage}%)</span>
                </div>
                {reason && (
                    <div className="bg-black dark:bg-white bg-opacity-5 dark:bg-opacity-10 rounded-xl p-4 mt-2 w-full">
                        {reason}
                    </div>
                )}
            </div>
        </div>
    );
};

const VoteList = ({ proposal }: VoteListProps) => {
    const [filter, setFilter] = useState<string>("All");
    const totalWeight = proposal.votes.reduce((sum, vote) => sum + vote.weight, 0);

    const supportOptions = ["All", ...Array.from(new Set(proposal.votes.map(vote => vote.support)))];

    const filteredVotes = filter === "All" ? proposal.votes : proposal.votes.filter(vote => vote.support === filter);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Votes</h2>
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)} 
                    className="border rounded px-2 py-1 text-center focus:outline-none"
                >
                    {supportOptions.map(option => (
                        <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>
            </div>
            {filteredVotes.length > 0 ? (
                filteredVotes
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
