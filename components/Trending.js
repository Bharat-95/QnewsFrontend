"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useLanguage } from "@/context/languagecontext";

const Trending = () => {
  const [data, setData] = useState([]);
  const { language, translations } = useLanguage();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const timeAgo = (dateString) => {
    const postDate = new Date(dateString);
    const now = new Date();
    const diffInMs = now - postDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn");
      const responseData = await response.data;
  
      // Sort posts by likes in descending order (highest likes first)
      const trendingData = responseData.data
        .sort((a, b) => b.likes - a.likes); // Sort by likes in descending order
  
      setData(trendingData);
    } catch (error) {
      console.log("Unable to fetch Trending News", error);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-4 px-[32px] py-[20px]">
  <div className="flex items-center justify-evenly">
    <div className="h-[1px] w-[20%] bg-gray-400"></div>
    <div className="text-[20px]">{translations.trendingHeadlines}</div>
    <div className="h-[1px] w-[20%] bg-gray-400"></div>
  </div>

  <div className="space-y-10 overflow-y-auto">
    {data.length > 0 ? (
      data
        .slice(0, 4) // Show only the top 4 posts
        .map((trending) => (
          <div key={trending.newsId}>
            <Link
              href={`/news/${trending.newsId}`}
              passHref
              className="flex-shrink-0 space-y-2 gap-10"
            >
              <div className="flex justify-center rounded-md w-full h-[200px] relative">
                <Image
                  alt="No Image Found"
                  src={trending.image}
                  layout="fill"  // Makes the image fill the container
                  objectFit="cover"  // Ensures the image covers the full container without stretching
                  className="rounded-md"
                />
              </div>
              <div className="line-clamp-3 text-ellipsis overflow-hidden text-[13px] font-semibold">
                {language === 'te' ? trending.headlineTe : trending.headlineEn}
              </div>
              <div className="text-[12px] flex justify-between font-light text-gray-500">
                <p>{formatDate(trending.createdAt)}</p>
                <p>{timeAgo(trending.createdAt)}</p>
              </div>
            </Link>
          </div>
        ))
    ) : (
      <p className="text-center text-gray-500">Loading trending news...</p>
    )}
  </div>
</div>

  );
};

export default Trending;
