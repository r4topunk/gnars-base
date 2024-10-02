import React, { useState } from "react";
import Loading from "../Loading";

const DummyProposals = [
    {
        title: "Rodrigo Panajotti Onboarding Proposal",
        description: "This is the first proposal",
        status: "Executed",
        thumbnail: "https://hackmd.io/_uploads/B10FNss3R.jpg",
        updates: 1,
        proposerAvatar: "https://i.ibb.co/ChbsDSr/Screenshot-1.png",
        proposer: "skateboard.⌐◨-◨",
    },
    {
        title: "SKATE AND JAZZ - 1st Noggles Rail in Argentina",
        description: "This is the second proposal",
        status: "Executed",
        thumbnail: "https://ipfs.skatehive.app/ipfs/QmWDuVTKkk58NCfpyLVLu4DT9tYKf87zNZixUygTt35PbC",
        updates: 4,
        proposerAvatar: "https://i.ibb.co/ChbsDSr/Screenshot-1.png",
        proposer: "skateboard.⌐◨-◨",
    },
    {
        title: "Gnars Wakeboarding Culture",
        description: "This is the third proposal",
        status: "Executed",
        thumbnail: "https://hackmd.io/_uploads/S1cQRssqA.jpg",
        updates: 2,
        proposerAvatar: "https://i.ibb.co/F76Q1J8/image.png",
        proposer: "overhau1.eth",
    },
];

const ProposalCards = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
            {DummyProposals.map((proposal, index) => (
                <ProposalCard index={index} proposal={proposal} />
            ))}
        </div>
    );
};

interface ProposalCardProps {
    index: number
    proposal: {
        title: string;
        description: string;
        status: string;
        thumbnail: string;
        updates: number;
        proposerAvatar: string;
        proposer: string;
    }
}

function ProposalCard({ index, proposal }: ProposalCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div
            key={index}
            className="relative rounded-lg overflow-hidden shadow-lg h-full aspect-video"
        >
            {/* Image Container */}
            <div className={`${imageLoaded ? "hidden" : "absolute"} inset-0 flex justify-center items-center`}>
                <Loading />
            </div>
            <img
                onLoad={() => setImageLoaded(true)}
                className="w-full h-full object-cover"
                src={proposal.thumbnail}
                alt="proposal thumbnail"
            />

            {/* Overlay Container */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-4">

                <div className="flex justify-between items-center">
                    {/* Title and Status */}
                    <div>
                        <p className="text-lg font-semibold text-white">{proposal.title}</p>
                    </div>

                    {/* Button */}
                    <div>
                        <p className="text-sm font-semibold text-gray-300">{proposal.status}</p>


                    </div>
                </div>
                <div className="flex justify-between items-center">
                    {/* Proposer Information */}
                    <div className="flex items-center mb-2">
                        <img
                            src={proposal.proposerAvatar}
                            alt={`${proposal.proposer} avatar`}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <p className="ml-2 text-sm text-white">{proposal.proposer}</p>
                    </div>
                    <button className="bg-yellow-500 text-black px-2 py-1 rounded-lg">
                        {proposal.status === "Active" ? "Vote" : "Updates"}
                    </button>
                </div>
            </div>
        </div>)
}

export default ProposalCards;
