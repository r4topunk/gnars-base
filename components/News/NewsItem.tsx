// components/NewsItem.tsx
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "../Loading"; // Adjust the path to your Loading component if necessary.
import { title } from "process";
import { width, height } from "tailwindcss/defaultTheme";

interface NewsItemProps {
    news: {
        title: string;
        description: string;
        type: string;
        thumbnail: string;
        updates: number;
        proposerAvatar: string;
        proposer: string;
        proposalId?: string;
        updateIndex?: string;
    };
}

const NewsItem = ({ news }: NewsItemProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <Link href={news.type === "Blog Post" ? `/blog/${news.proposalId}` : `/propdates/${news.proposalId}/${news.updateIndex}`}>
            <div className="relative rounded-lg overflow-hidden h-full group ">
                {/* Enhanced Ribbon for Proposal Updates */}
                {/* {news.type === "Proposal Update" && (
                    <div className="absolute top-10 left-0 bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-1 transform -rotate-45 origin-top-left z-20 shadow-md rounded-tr-lg">
                        <span className="font-bold text-md">propdate</span>
                    </div>
                )} */}

                {/* Image Container */}
                <div className={`${imageLoaded ? "hidden" : "absolute"} inset-0 flex justify-center items-center`}>
                    <Loading />
                </div>

                <Image
                    onLoad={() => setImageLoaded(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={news.thumbnail}
                    alt="news thumbnail"
                    width={400}
                    height={200}
                />

                {/* Overlay Container */}
                <div className="absolute inset-0 flex flex-col justify-between p-1 lg:p-2  group-hover:bg-opacity-0 group-hover:backdrop-blur-none transition duration-300  bg-black bg-opacity-50 ">
                    <div className="flex justify-center items-center mt-5">
                        {/* <Image
                            src={news.proposerAvatar}
                            alt={`${news.proposer} avatar`}
                            className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover"
                            width={64}
                            height={64}
                        /> */}
                    </div>
                    {/* Title and Content Type */}
                    <div className="bg-opacity-0 group-hover:bg-yellow-400 group-hover:bg-opacity-100 rounded-lg p-1 lg:p-2 flex items-center space-x-2 lg:space-x-4 h-12 lg:h-12 transition duration-300">
                        <Image
                            src={news.proposerAvatar}
                            alt={`${news.proposer} avatar`}
                            className="w-8 h-8 rounded-full object-cover"
                            width={8}
                            height={8}
                        />
                        <p className="text-sm lg:text-md text-white group-hover:text-black font-normal max-w-full transition duration-300">
                            {news.title}
                        </p>
                    </div>
                    {/* <div className="group-hover:hidden text-sm lg:text-md text-black font-normal max-w-full">
                        {news.title}
                    </div> */}

                </div>
            </div>
        </Link>
    );
};

export default NewsItem;
