"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useLanguage } from "../context/languagecontext";
import advertisement from "../public/BC.png";
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
        "https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn"
      );
      const responseData = response.data.data;
      responseData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
      setData(responseData);
    } catch (error) {
      console.log("Unable to Fetch News", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const timeAgo = (dateString) => {
    const postDate = new Date(dateString);
    const nowDate = new Date();
    const difference = nowDate - postDate;

    const secondsDifference = Math.floor(difference / 1000);
    const minutesDifference = Math.floor(difference / (1000 * 60));
    const hoursDifference = Math.floor(difference / (1000 * 60 * 60));
    const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (secondsDifference < 60) {
      return `${secondsDifference} s ago`;
    } else if (minutesDifference < 60) {
      return `${minutesDifference} m ago`;
    } else if (hoursDifference < 24) {
      return `${hoursDifference} h ago`;
    } else if (daysDifference < 30) {
      return `${daysDifference} d ago`;
    } else {
      return postDate.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getMainPost = () => {
    return data.find(post => post.status === "Approved");
  };

  const mainPost = getMainPost();
  const latestPosts = data
    .slice(1, 40)
    .filter(post => post.status === "Approved" && post.newsId !== mainPost?.newsId); // Remove the main post

  return (
    <div>
   <div className="relative lg:h-64 h-32 md:h-56 w-[100%] border border-orange-300 rounded-md shadow-md mb-10 overflow-hidden">
      {/* Image */}
      <Image
        src={advertisement}
        height={500}
        width={500}
        alt="No Image Found"
        className="w-[100%] h-[100%]"
        unoptimized={true}
      />
      
      {/* Buttons Positioned Over Image */}
      <div className="absolute lg:top-[70%] md:top-[70%] top-[60%] md: inset-0 flex items-center justify-center gap-4 ">
        <button className="lg:px-4 lg:py-2 md:px-4 md:py-2 p-1 bg-green-500 text-white border border-black rounded-md hover:bg-green-600">అవును</button>
        <button className="lg:px-4 lg:py-2 md:px-4 md:py-2 p-1 bg-red-500 text-white border border-black rounded-md hover:bg-red-600">కాదు</button>
        <button className="lg:px-4 lg:py-2 md:px-4 md:py-2 p-1 bg-gray-500 text-white border border-black rounded-md hover:bg-gray-600">చెప్పలేను</button>
      </div>
    </div>
      <div className="lg:flex lg:gap-10 md:gap-5 lg:space-y-0 md:space-y-10 space-y-10">
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
                {language === "en"
                  ? mainPost.headlineEn
                  : mainPost.headlineTe}
              </div>
            </div>
            <div className="flex items-center gap-10 font-light text-gray-500">
              <div>{formatDate(mainPost.createdAt)}</div>
              <div>{timeAgo(mainPost.createdAt)}</div>
              
            </div>
          </Link>
        )}

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


