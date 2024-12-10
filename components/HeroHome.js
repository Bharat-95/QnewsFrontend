"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useLanguage } from "../context/languagecontext";

const Page = () => {
  const { language } = useLanguage();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn");
      const responseData = response.data.data;
      setData(responseData);
    } catch (error) {
      console.log("Unable to Fetch News", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data initially
    const interval = setInterval(() => {
      fetchData(); // Poll new data every 30 seconds
    }, 30000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  // Function to get the latest post based on createdAt timestamp
  const getLatestPost = (posts) => {
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  };

  // Filter the posts based on categories
  const mainPost = getLatestPost(
    data.filter((news) => news.isMain === "Yes" && news.status === "Approved")
  );
  const sub1Post = getLatestPost(
    data.filter((news) => news.isSub1 === "Yes" && news.isMain === "No" && news.isSub2 === "No" && news.status === "Approved")
  );
  const sub2Post = getLatestPost(
    data.filter((news) => news.isSub2 === "Yes" && news.isMain === "No" && news.isSub1 === "No" && news.status === "Approved")
  );

  return (
    <div className="lg:flex md:flex lg:gap-10 md:gap-5 lg:space-y-0 md:space-y-0 space-y-10">
      {/* Main Post */}
      {mainPost && (
        <Link
          href={`/news/${mainPost.newsId}`}
          passHref
          key={mainPost.newsId}
          className="lg:w-[60%] md:w-[60%]  space-y-2"
        >
          <div className="w-[100%] lg:h-[393px] md:h-[393px] h-[300px] overflow-hidden">
            <Image
              alt="No Image Found"
              src={mainPost.image}
              width={100}
              height={100}
              className="w-[100%] lg:h-[393px] md:h-[393px] h-[300px] rounded-md shadow-md"
            />
          </div>
          <div>
            <div className="font-semibold text-[24px] hover:underline line-clamp-2 overflow-hidden text-ellipsis">
              {language === "en" ? mainPost.headlineEn : mainPost.headlineTe}
            </div>
          </div>
        </Link>
      )}

      <div className="h-[500px] w-[1px] lg:flex md:flex hidden bg-gray-400"></div>

      <div className="space-y-10 lg:w-[40%] md:w-[40%] lg:h-[500px] md:h-[500px] h-[300px]">
        {sub1Post && (
          <Link
            href={`/news/${sub1Post.newsId}`}
            passHref
            key={sub1Post.newsId}
            className="w-[100%] h-[40%] flex lg:gap-10 md:gap-5 gap-2"
          >
            <div className="w-[50%] lg:h-[100%] md:h-[100%] h-[100%]">
              <Image
                src={sub1Post.image}
                alt="No Image Found"
                width={100}
                height={100}
                className="w-[100%] h-[100%] shadow-md rounded-md"
              />
            </div>
            <div className="w-[50%] space-y-4">
              <div className="text-[13px] font-semibold hover:underline line-clamp-3 overflow-hidden text-ellipsis">
                {language === "en" ? sub1Post.headlineEn : sub1Post.headlineTe}
              </div>
              <div className="text-[13px] line-clamp-5 overflow-hidden text-ellipsis">
                {language === "en" ? sub1Post.newsEn : sub1Post.newsTe}
              </div>
            </div>
          </Link>
        )}

        {sub2Post && (
          <Link
            href={`/news/${sub2Post.newsId}`}
            passHref
            key={sub2Post.newsId}
            className="w-[100%] h-[40%] flex lg:gap-10 md:gap-5 gap-2"
          >
            <div className="w-[50%] h-[100%]">
              <Image
                src={sub2Post.image}
                alt="No Image Found"
                width={100}
                height={100}
                className="w-[100%] h-[100%] shadow-md rounded-md"
              />
            </div>
            <div className="w-[50%] space-y-4">
              <div className="text-[13px] font-semibold hover:underline line-clamp-3 overflow-hidden text-ellipsis">
                {language === "en" ? sub2Post.headlineEn : sub2Post.headlineTe}
              </div>
              <div className="text-[13px] line-clamp-5 overflow-hidden text-ellipsis">
                {language === "en" ? sub2Post.newsEn : sub2Post.newsTe}
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Page;
