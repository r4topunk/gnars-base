// components/NewsCard.tsx
import React from "react";
import NewsItem from "./NewsItem"; // Adjust the path as needed

const DummyNews = [
    {
        title: "Rodrigo Panajotti in the House",
        description: "Final updates from Rodrigo's onboarding proposal.",
        type: "Proposal Update",
        thumbnail: "https://ipfs.skatehive.app/ipfs/QmXeMcdcL1HuGYgJugdx8veh3nLYopEKkhEaqhBkKVLiz6",
        updates: 1,
        proposerAvatar: "https://i.ibb.co/ChbsDSr/Screenshot-1.png",
        proposer: "skateboard.⌐◨-◨",
        proposalId: "1",
        updateIndex: "1",
    },
    {
        title: "Noggles Rail Phase 1",
        description: "First Noggles project in Argentina featuring skate and jazz.",
        type: "Proposal Update",
        thumbnail: "https://ipfs.skatehive.app/ipfs/QmWDuVTKkk58NCfpyLVLu4DT9tYKf87zNZixUygTt35PbC",
        updates: 4,
        proposerAvatar: "https://images.ecency.com/webp/u/karao7a/avatar/small",
        proposer: "karao7a.eth",
        proposalId: "2",
        updateIndex: "1",
    },
    {
        title: "Top 10 Skate Spots in NYC",
        description: "Explore the best places to skate in New York City.",
        type: "Blog Post",
        thumbnail: "https://gnars.com/images/93ciofh34f.jpeg",
        updates: 0,
        proposerAvatar: "https://images.ecency.com/webp/u/willdias/avatar/small",
        proposer: "willdias.eth",
        proposalId: "3",
        updateIndex: "1",
    },
    {
        title: "Gnars  Culture",
        description: "A new trend in wakeboarding driven by Gnars DAO.",
        type: "Proposal Update",
        thumbnail: "https://ipfs.skatehive.app/ipfs/QmQ14XPfkHR86huXJ8U8bebbb5Nb9dQrufANh9WndaKbhT",
        updates: 2,
        proposerAvatar: "https://images.ecency.com/webp/u/joaoparmagnani/avatar/small",
        proposer: "zimardrp.eth",
        proposalId: "4",
        updateIndex: "1",
    },
    {
        title: "How to Land a Kickflip",
        description: "Step-by-step guide to mastering a perfect kickflip.",
        type: "Blog Post",
        thumbnail: "https://gateway.pinata.cloud/ipfs/QmWUzfArhZVvyDjCBhEiQkAF5Q6npwYhKS5eMXWq1akqco",
        updates: 0,
        proposerAvatar: "https://euc.li/gami.eth",
        proposer: "gami.eth",
        proposalId: "5",
        updateIndex: "1",
    },
    {
        title: "KnowHow is Hot",
        description: "Tony Hawk shares his thoughts on the future of skateboarding.",
        type: "Blog Post",
        thumbnail: "https://ipfs.decentralized-content.com/ipfs/bafybeifaquuf42pfb35zempkoscudmkuhqczlipuqa4jr6clex45a3wh64",
        updates: 0,
        proposerAvatar: "https://i.ibb.co/ChbsDSr/Screenshot-1.png",
        proposer: "skateboard.⌐◨-◨",
        proposalId: "6",
        updateIndex: "1",
    },
];

const NewsCard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 h-fit">
            {DummyNews.map((news, index) => (
                <div
                    key={index}
                    className={`aspect-video rounded-xl overflow-hidden shadow-lg ${index % 3 === 0 ? "bg-lime-300" : index % 3 === 1 ? "bg-red-300" : "bg-blue-300"
                        }`}
                >
                    <NewsItem news={news} />
                </div>
            ))}
        </div>
    );
};

export default NewsCard;
