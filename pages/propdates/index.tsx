
import React from "react";
import Link from "next/link";

interface cast {
    title: string;
    description: string;
    type: string;
    thumbnail: string;
    updates: number;
    proposerAvatar: string;
    proposer: string;
    proposalId: string;
    updateIndex: string;
}

const Propdates = () => {
    const DummyPropdatescasts: cast[] = [
        {
            title: "Rodrigo Panajotti Onboarding Proposal",
            description: "Final updates from Rodrigo's onboarding proposal.",
            type: "Proposal Update",
            thumbnail: "https://hackmd.io/_uploads/B10FNss3R.jpg",
            updates: 1,
            proposerAvatar: "https://i.ibb.co/ChbsDSr/Screenshot-1.png",
            proposer: "skateboard.⌐◨-◨",
            proposalId: "1",
            updateIndex: "1",
        },
        {
            title: "SKATE AND JAZZ - 1st Noggles Rail in Argentina",
            description: "First Noggles project in Argentina featuring skate and jazz.",
            type: "Proposal Update",
            thumbnail: "https://ipfs.skatehive.app/ipfs/QmWDuVTKkk58NCfpyLVLu4DT9tYKf87zNZixUygTt35PbC",
            updates: 4,
            proposerAvatar: "https://i.ibb.co/ChbsDSr/Screenshot-1.png",
            proposer: "skateboard.⌐◨-◨",
            proposalId: "2",
            updateIndex: "2",
        },
        {
            title: "Top 10 Skate Spots in NYC",
            description: "Explore the best places to skate in New York City.",
            type: "Blog Post",
            thumbnail: "https://ipfs.skatehive.app/ipfs/QmZ7r5qLoEMG8VSge8bs6HrDKrPUSgevLjchSjnxJZLTpN",
            updates: 0,
            proposerAvatar: "https://i.ibb.co/F76Q1J8/image.png",
            proposer: "skaterank.eth",
            proposalId: "3",
            updateIndex: "3",
        },
        {
            title: "Gnars Wakeboarding Culture",
            description: "A new trend in wakeboarding driven by Gnars DAO.",
            type: "Proposal Update",
            thumbnail: "https://hackmd.io/_uploads/S1cQRssqA.jpg",
            updates: 2,
            proposerAvatar: "https://i.ibb.co/F76Q1J8/image.png",
            proposer: "overhau1.eth",
            proposalId: "4",
            updateIndex: "4",
        },
    ];

    const CastItem = ({ cast }: { cast: cast }) => {
        return (
            <div className="flex flex-col border-b border-gray-200 p-4">
                <div className="flex items-start">
                    <img
                        src={cast.proposerAvatar}
                        alt="proposer"
                        className="w-12 h-12 rounded-full"
                    />
                    <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                            <span className="font-bold text-gray-900">{cast.proposer}</span>
                            <span className="text-gray-500 text-sm">3h ago about Proposal {cast.proposalId}1</span>
                        </div>
                        <p className="text-gray-600">{cast.title}</p>
                        <div className="mt-2">
                            <Link href={`/propdates/${cast.proposalId}/${cast.updateIndex}`}>
                                <img
                                    src={cast.thumbnail}
                                    alt="thumbnail"
                                    className="w-full h-56 object-cover rounded-lg"
                                />
                            </Link>
                        </div>
                        <p className="text-gray-700 mt-2">{cast.description}</p>
                        <div className="text-sm text-gray-500 mt-1">
                            {cast.updates} updates
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Propdates</h1>
            <div className="border border-gray-300 rounded-lg p-3 mb-4">
                <textarea
                    placeholder="What's happening?"
                    className="w-full p-2 rounded-md border focus:outline-none"
                />
                <button className="bg-purple-500 text-white px-4 py-2 rounded-md mt-2">
                    Cast
                </button>
            </div>
            <div className="flex flex-col">
                {DummyPropdatescasts.map((cast, index) => (
                    <CastItem key={index} cast={cast} />
                ))}
            </div>
        </div>
    );
};

export default Propdates;
