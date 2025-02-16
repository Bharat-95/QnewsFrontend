"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useLanguage } from "../context/languagecontext";
import { Ramaraja } from "next/font/google";

const ramaraja = Ramaraja({
  subsets: ["latin", "telugu"],
  weight: "400",
});

const Page = () => {
  const { language } = useLanguage();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/latest50"
      );
  
      if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
        console.error("Invalid API response format");
        return;
      }
  
      let responseData = response.data.data;
  
      // ✅ Sort all news (without filtering by 'Approved' status)
      const sortedNews = responseData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  
      // ✅ Set sorted data to state
      setData(sortedNews);
  
      console.log("Latest Post After Sorting:", sortedNews[0]); // Debugging Latest News
    } catch (error) {
      console.error("Unable to fetch news:", error);
    }
  };
  
useEffect(() => {
  fetchData();
  const interval = setInterval(fetchData, 30000);
  return () => clearInterval(interval);
}, []);


  const mainPost = data.length > 0 ? data[0] : null;
  const latestPosts = data.slice(1, 40); // Take next 40 latest posts

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
  };

  const timeAgo = (dateString) => {
    const postDate = new Date(dateString);
    const nowDate = new Date();
    const difference = nowDate - postDate;

    const minutesDifference = Math.floor(difference / (1000 * 60));
    const hoursDifference = Math.floor(difference / (1000 * 60 * 60));
    const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutesDifference < 60) return `${minutesDifference} m ago`;
    if (hoursDifference < 24) return `${hoursDifference} h ago`;
    return `${daysDifference} d ago`;
  };

  return (
    <div>
      <div className="lg:flex lg:gap-10 md:gap-5 lg:space-y-0 md:space-y-10 space-y-10">
        {/* Main Post */}
        {mainPost && (
          <Link
            href={{
              pathname: `/news/${mainPost.newsId}`,
              query: { language },
            }}
            passHref
            key={mainPost.newsId}
            className="lg:w-[60%] md:w-[60%] space-y-2"
          >
            <div className="w-[100%] lg:h-[420px] md:h-[393px] h-[250px] overflow-hidden">
              <Image
                alt="No Image Found"
                src={mainPost.image}
                width={500}
                height={500}
                className="w-[100%] lg:h-[420px] md:h-[393px] h-[250px] object-cover rounded-md shadow-md"
                unoptimized={true}
                priority={false}
                loading="lazy"
              />
            </div>
            <div>
              <div
                className={`font-semibold hover:underline line-clamp-2 overflow-hidden text-ellipsis ${
                  language === "en"
                    ? `lg:text-[24px] md:text-[20px] text-[20px]`
                    : `lg:text-[28px] md:text-[24px] text-[24px] ${ramaraja.className}`
                }`}
              >
                {language === "en" ? mainPost.headlineEn : mainPost.headlineTe}
              </div>
            </div>
            <div className="flex items-center gap-10 font-light text-gray-500">
              <div>{formatDate(mainPost.createdAt)}</div>
              <div>{timeAgo(mainPost.createdAt)}</div>
            </div>
          </Link>
        )}

        {/* Other Latest Posts */}
        <div className="lg:w-[40%] overflow-y-scroll my-10 h-[500px]">
          {latestPosts.map((post) => (
            <Link
              href={{
                pathname: `/news/${post.newsId}`,
                query: { language },
              }}
              passHref
              key={post.newsId}
              className=""
            >
              <div className="flex w-full gap-4 pb-4">
                <div className="w-[30%] h-24 overflow-hidden rounded-md flex items-center justify-center bg-gray-200">
                  <Image
                    alt="No Image Found"
                    src={post.image}
                    width={160}
                    height={96}
                    className="object-cover w-full h-full"
                    loading="lazy"
                    unoptimized={true}
                    priority={false}
                  />
                </div>
                <div className="w-[70%]">
                  <div
                    className={`font-semibold hover:underline line-clamp-2 overflow-hidden text-ellipsis ${
                      language === "en"
                        ? `text-[16px]`
                        : `text-[18px] ${ramaraja.className}`
                    }`}
                  >
                    {language === "en" ? post.headlineEn : post.headlineTe}
                  </div>
                  <div className="text-gray-500 font-light text-sm">
                    {timeAgo(post.createdAt)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
