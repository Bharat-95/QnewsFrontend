"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/languagecontext";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  const [data, setData] = useState([]);
  const { language } = useLanguage();

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await axios.get("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn");
      const responseData = response.data;
      setData(responseData.data || []);
    } catch (error) {
      console.log("Unable to retrieve the news");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort the data
  const filteredData = data
    .filter(
      (news) => news.category === "Others" && news.status === "Approved"
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort posts by date in descending order

  const trendingNews = [...data]
    .filter((news) => news.status === "Approved")
    .sort((a, b) => b.likes - a.likes) // Sort by most likes
    .slice(0, 4); // Top 4 trending news

  const mostRecentPost = filteredData[0]; // The most recent post
  const otherPosts = filteredData.slice(1, 7); // Limit to the next 6 posts

  return (
    <div className="flex min-h-screen flex-col lg:flex-row gap-8 mx-4 md:mx-6 lg:mx-10 my-6 md:my-8 lg:my-10">
      {/* 70% Section: Latest News */}
      <div className="flex-[7]">
        {/* Show most recent post */}
        {mostRecentPost && (
          <div className="w-full mb-8 md:mb-10">
            <Link href={`/news/${mostRecentPost.newsId}`}>
              <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] flex justify-center mb-4">
                <Image
                  src={mostRecentPost.image}
                  alt="No Image Found"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <div className="text-xl md:text-2xl lg:text-3xl font-bold">
                {language === "te"
                  ? mostRecentPost.headlineTe
                  : mostRecentPost.headlineEn}
              </div>
              <div className="line-clamp-2 text-sm md:text-lg mt-2">
                {language === "te"
                  ? mostRecentPost.newsTe
                  : mostRecentPost.newsEn}
              </div>
            </Link>
          </div>
        )}

        {/* Show other posts */}
        <div className="w-full flex flex-col gap-6">
          {otherPosts.length > 0 ? (
            otherPosts.map((news) => (
              <div
                key={news.newsId}
                className="flex gap-4 items-center border rounded-md"
              >
                {/* 70% Text Section */}
                <div className="flex-[7] p-4">
                  <Link href={`/news/${news.newsId}`}>
                    <div className="font-bold line-clamp-1 hover:underline text-sm md:text-base">
                      {language === "te" ? news.headlineTe : news.headlineEn}
                    </div>
                    <div className="line-clamp-3 text-xs md:text-sm mt-2">
                      {language === "te" ? news.newsTe : news.newsEn}
                    </div>
                  </Link>
                </div>
                {/* 30% Image Section */}
                <div className="flex-[3]">
                  <Link href={`/news/${news.newsId}`}>
                    <Image
                      src={news.image}
                      alt="No Image Found"
                      width={200}
                      height={150}
                      className="object-cover w-full lg:h-48 h-28 md:h-40 rounded-md"
                    />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
      </div>

      {/* 30% Section: Trending News */}
      <div className="hidden lg:block flex-[3] p-4 rounded-lg">
        <h2 className="text-lg md:text-xl font-bold mb-4 flex justify-center">Trending News</h2>
        {trendingNews.length > 0 ? (
          trendingNews.map((news) => (
            <div
              key={news.newsId}
              className="flex flex-col gap-2 p-4 rounded-md mb-4"
            >
              {/* Image Section */}
              <div className="w-full h-[160px] md:h-[200px] lg:h-[250px]">
                <Link href={`/news/${news.newsId}`}>
                  <Image
                    src={news.image}
                    alt="No Image Found"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full rounded-md"
                  />
                </Link>
              </div>
              {/* Text Section */}
              <div className="flex-grow">
                <Link href={`/news/${news.newsId}`}>
                  <div className="font-bold text-xs md:text-sm hover:underline">
                    {language === "te" ? news.headlineTe : news.headlineEn}
                  </div>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No trending news available</p>
        )}
      </div>
    </div>
  );
};

export default Page;
