// path: components/News/NewsCard.tsx

import React from "react";

export const NewsCard = () => {
    return (

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:h-[220px] h-[840px]">
            <div className="bg-lime-300 rounded-xl"></div>
            <div className="bg-red-300 rounded-xl"></div>
            <div className="bg-blue-300 rounded-xl"></div>
            <div className="bg-lime-300 rounded-xl"></div>
            <div className="bg-red-300 rounded-xl"></div>
            <div className="bg-blue-300 rounded-xl"></div>
        </div>
    );
};

