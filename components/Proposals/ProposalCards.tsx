import { useDAOAddresses, useGetAllProposals } from "@/hooks/fetch";
import useEnsName from "@/hooks/fetch/useEnsName";
import { Proposal } from "@/services/nouns-builder/governor";
import { getProposalName } from "@/utils/getProposalName";
import { shortenAddress } from "@/utils/shortenAddress";
import { TOKEN_CONTRACT } from "constants/addresses";
import Image from "next/image";
import { useState } from "react";
import Loading from "../Loading";
import ProposalStatus from "../ProposalStatus";
import UserAvatar from "../UserAvatar";
import Link from "next/link";

const ProposalCards = () => {
    const { data: addresses } = useDAOAddresses({
        tokenContract: TOKEN_CONTRACT,
    });
    const { data: proposals } = useGetAllProposals({
        governorContract: addresses?.governor,
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
            {
                proposals ? proposals.slice(0, 3).map((proposal, index) => (
                    <ProposalCard key={index} proposal={proposal} />
                )) : [...Array(3)].map((_, index) => <ProposalCardLoading key={index} />)
            }
        </div>
    );
};

function extractFirstImageFromMarkdown(markdown: string) {
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const match = markdown.match(imageRegex);
    return match ? match[1] : null;
}

interface ProposalCardProps {
    proposal: Proposal
}

function ProposalCardLoading() {
    return <div className="relative rounded-lg overflow-hidden h-full aspect-video border border-zinc-200">
        <div className={`absolute inset-0 flex justify-center items-center`}>
            <Loading />
        </div>
    </div>
}

function ProposalCard({ proposal }: ProposalCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const thumbnail = extractFirstImageFromMarkdown(proposal.description) || ""
    const proposer = proposal.proposal.proposer
    const { data: ensName } = useEnsName(proposer);

    return (
        <Link
            className="relative rounded-lg overflow-hidden shadow-lg h-full aspect-video"
            href={`/vote/${proposal.proposalId}`}
        >
            {/* Image Container */}
            <div className={`${imageLoaded ? "hidden" : "absolute"} inset-0 flex justify-center items-center`}>
                <Loading />
            </div>
            <Image
                onLoad={() => setImageLoaded(true)}
                className="w-full h-full object-cover"
                src={thumbnail || "/sktloading.gif"}
                alt="proposal thumbnail"
                width={16}
                height={9}
            />

            {/* Overlay Container */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-4">
                <div className="flex justify-between items-start gap-2 bg-opacity-20 tracking-wide">
                    {/* Title and Status */}
                    <p className="text-lg font-semibold text-white">{getProposalName(proposal.description)}</p>
                </div>
                <div className="flex justify-between items-center">
                    {/* Proposer Information */}
                    <div className="flex items-center">
                        <UserAvatar address={proposal.proposal.proposer} className="rounded-full" diameter={32} />
                        <p className="ml-2 text-sm text-white">{ensName?.ensName || shortenAddress(proposer)}</p>
                    </div>
                    <ProposalStatus proposal={proposal} />
                </div>
            </div>
        </Link>)
}

export default ProposalCards;
