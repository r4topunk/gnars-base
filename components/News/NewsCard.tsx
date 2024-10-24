import React from "react";
import NewsItem from "./NewsItem"; // Ajuste o caminho conforme necessário

const NewsCard = ({ posts }: { posts: any[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 h-fit">
      {posts.map((post, index) => (
        <div
          key={index}
          className={`aspect-video rounded-xl overflow-hidden shadow-lg ${index % 3 === 0 ? "bg-lime-300" : index % 3 === 1 ? "bg-red-300" : "bg-blue-300"
            }`}
        >
          <NewsItem news={post} />
        </div>
      ))}
    </div>
  );
};

export default NewsCard;