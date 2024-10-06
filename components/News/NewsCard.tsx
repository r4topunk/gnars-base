import React, { useState } from "react";
import Image from "next/image";
import Loading from "../Loading";

// Enhanced Dummy News Data with varied content types
const DummyNews = [
    {
        title: "Rodrigo Panajotti Onboarding Proposal",
        description: "Final updates from Rodrigo's onboarding proposal.",
        type: "Proposal Update", // Differentiate the content type
        thumbnail: "https://hackmd.io/_uploads/B10FNss3R.jpg",
        updates: 1,
        proposerAvatar: "https://i.ibb.co/ChbsDSr/Screenshot-1.png",
        proposer: "skateboard.⌐◨-◨",
    },
    {
        title: "SKATE AND JAZZ - 1st Noggles Rail in Argentina",
        description: "First Noggles project in Argentina featuring skate and jazz.",
        type: "Proposal Update",
        thumbnail:
            "https://ipfs.skatehive.app/ipfs/QmWDuVTKkk58NCfpyLVLu4DT9tYKf87zNZixUygTt35PbC",
        updates: 4,
        proposerAvatar: "https://i.ibb.co/ChbsDSr/Screenshot-1.png",
        proposer: "skateboard.⌐◨-◨",
    },
    {
        title: "Top 10 Skate Spots in NYC",
        description: "Explore the best places to skate in New York City.",
        type: "Blog Post",
        thumbnail: "https://nycgo.com/images/articles/31843/dsp-nyc-skateparks_brooklynbridge_52031.jpg",
        updates: 0,
        proposerAvatar: "https://i.ibb.co/F76Q1J8/image.png",
        proposer: "skaterank.eth",
    },
    {
        title: "Gnars Wakeboarding Culture",
        description: "A new trend in wakeboarding driven by Gnars DAO.",
        type: "Proposal Update",
        thumbnail: "https://hackmd.io/_uploads/S1cQRssqA.jpg",
        updates: 2,
        proposerAvatar: "https://i.ibb.co/F76Q1J8/image.png",
        proposer: "overhau1.eth",
    },
    {
        title: "How to Land a Kickflip",
        description: "Step-by-step guide to mastering a perfect kickflip.",
        type: "Blog Post",
        thumbnail: "https://skateboarding.transworld.net/wp-content/uploads/2017/09/Kickflip.jpg",
        updates: 0,
        proposerAvatar: "https://i.ibb.co/F76Q1J8/image.png",
        proposer: "skateblogger.eth",
    },
    {
        title: "Interview with Tony Hawk",
        description: "Tony Hawk shares his thoughts on the future of skateboarding.",
        type: "Blog Post",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/5/52/Tony_Hawk.jpg",
        updates: 0,
        proposerAvatar: "https://i.ibb.co/ChbsDSr/Screenshot-1.png",
        proposer: "skateboard.⌐◨-◨",
    },
];

const NewsCard = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {DummyNews.map((news, index) => (
                <div
                    key={index}
                    className={`
                        h-40 md:h-auto md:aspect-square
                        rounded-xl overflow-hidden shadow-lg ${index % 3 === 0
                        ? "bg-lime-300"
                        : index % 3 === 1
                            ? "bg-red-300"
                            : "bg-blue-300"
                        }`}
                >
                    <NewsItem news={news} />
                </div>
            ))}
        </div>
    );
};

interface NewsItemProps {
    news: {
        title: string;
        description: string;
        type: string;
        thumbnail: string;
        updates: number;
        proposerAvatar: string;
        proposer: string;
    };
}

const NewsItem = ({ news }: NewsItemProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="relative rounded-lg overflow-hidden h-full">
            {/* Image Container */}
            <div
                className={`${imageLoaded ? "hidden" : "absolute"
                    } inset-0 flex justify-center items-center`}
            >
                <Loading />
            </div>
            <Image
                onLoad={() => setImageLoaded(true)}
                className="w-full h-32 lg:h-full object-cover"
                src={news.thumbnail}
                alt="news thumbnail"
                width={400}
                height={200}
            />

            {/* Overlay Container */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-2 lg:p-4">
                {/* Title and Content Type */}
                <div>
                    <p className="text-sm lg:text-lg font-semibold text-white">
                        {news.title}
                    </p>
                    <span className="text-xs lg:text-sm text-gray-300 italic">
                        {news.type}
                    </span>
                </div>

                {/* Proposer Information and Badge */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center mb-2">
                        <Image
                            src={news.proposerAvatar}
                            alt={`${news.proposer} avatar`}
                            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover"
                            width={32}
                            height={32}
                        />
                        <p className="ml-2 text-xs lg:text-sm text-white">{news.proposer}</p>
                    </div>

                    {/* Button based on Type */}
                    {/* <button className={`px-2 py-1 rounded-lg ${news.type === "Proposal Update"
                        ? "bg-yellow-500 text-black"
                        : "bg-purple-500 text-white"
                        }`}>
                        {news.type === "Proposal Update" ? "Check Update" : "Read Post"}
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export { NewsCard };
