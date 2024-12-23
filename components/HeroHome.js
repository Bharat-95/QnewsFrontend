"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useLanguage } from "../context/languagecontext";
import advertisement from '../public/shanarti.png'
import { Ramaraja } from "next/font/google";

const ramaraja = Ramaraja({
    subsets: ["latin", "telugu"], // Specify subsets
    weight: "400", // Specify font weight
  });

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
      return `${secondsDifference} sec ago`;
    } else if (minutesDifference < 60) {
      return `${minutesDifference} min ago`;
    } else if (hoursDifference < 24) {
      return `${hoursDifference} hrs ago`;
    } else if (daysDifference < 30) {
      return `${daysDifference} days ago`;
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
    const interval = setInterval(() => {
      fetchData(); 
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getLatestPost = (posts) => {
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  };

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
    <div>
      <div className="lg:h-64 h-32 md:h-56 w-[100%] border border-orange-300 rounded-md shadow-md mb-10">
        <Image
        src={advertisement}
        height={500}
        width={500}
        alt="No Image Found"
        className="w-[100%]  h-[100%] " />
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
          className="lg:w-[60%] md:w-[60%]  space-y-2"
        >
          <div className="w-[100%] lg:h-[420px] md:h-[393px] h-[250px] overflow-hidden">
            <Image
              alt="No Image Found"
              src={mainPost.image}
              width={500}
              height={500}
              className="w-[100%] lg:h-[420px] md:h-[393px] h-[250px] object-cover rounded-md shadow-md"
            />
          </div>
          <div>
            <div className={`font-semibold hover:underline line-clamp-2 overflow-hidden text-ellipsis ${language === 'en' ? `text-[24px]`:`text-[28px] ${ramaraja.className}` }`}>
              {language === "en" ? mainPost.headlineEn : mainPost.headlineTe}
            </div>
          </div>
          <div className="flex items-center gap-10 font-light text-gray-500">
                <div>{formatDate(mainPost.createdAt)}</div>
                <div> {timeAgo(mainPost.createdAt)}</div>
              </div>
        </Link>
      )}

      <div className="h-[500px] w-[1px] lg:flex md:hidden hidden bg-orange-600"></div>

      <div className="space-y-14 lg:w-[40%] lg:h-[500px] md:h-[500px] h-[300px]">
        {sub1Post && (
          <Link
            href={{
              pathname: `/news/${sub1Post.newsId}`,
              query: { language },
            }}
            passHref
            key={sub1Post.newsId}
            className="w-[100%] h-[40%] flex lg:gap-10 md:gap-5 gap-2"
          >
            <div className="w-[50%] lg:h-[100%] md:h-[100%] h-[100%]">
              <Image
                src={sub1Post.image}
                alt="No Image Found"
                width={500}
                height={500}
                className="w-[100%] object-cover h-[100%] shadow-md rounded-md"
              />
            </div>
            <div className="w-[50%] lg:space-y-4 md:space-y-4 space-y-1">
              <div className={`font-semibold hover:underline line-clamp-3 overflow-hidden text-ellipsis ${language === "en" ? `text-[13px]`:`text-[16px] ${ramaraja.className}`}`}>
                {language === "en" ? sub1Post.headlineEn : sub1Post.headlineTe}
              </div>
              <div className={`lg:line-clamp-5 md:line-clamp-5 line-clamp-2 overflow-hidden text-ellipsis ${language === "en" ? `text-[13px]`:`text-[15px]`}`}>
                {language === "en" ? sub1Post.newsEn : sub1Post.newsTe}
              </div>
            </div>
            
          </Link>
        )}

        {sub2Post && (
          <Link
            href={{
              pathname: `/news/${sub2Post.newsId}`,
              query: { language },
            }}
            passHref
            key={sub2Post.newsId}
            className="w-[100%] h-[40%] flex lg:gap-10 md:gap-5 gap-2"
          >
            <div className="w-[50%] lg:h-[100%] md:h-[100%] h-[100%]">
              <Image
                src={sub2Post.image}
                alt="No Image Found"
                width={500}
                height={500}
                className="w-[100%] h-[100%] object-cover shadow-md rounded-md"
              />
            </div>
            <div className="w-[50%] lg:space-y-4 md:space-y-4 space-y-1">
              <div className={`font-semibold hover:underline line-clamp-3 overflow-hidden text-ellipsis ${language === "en" ? `text-[13px]`:`text-[16px] ${ramaraja.className}`}`}>
                {language === "en" ? sub2Post.headlineEn : sub2Post.headlineTe}
              </div>
              <div className={`lg:line-clamp-5 md:line-clamp-5 line-clamp-2 overflow-hidden text-ellipsis  ${language === "en" ? `text-[13px]`:`text-[15px]`}`}>
                {language === "en" ? sub2Post.newsEn : sub2Post.newsTe}
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
    </div>

  );
};

export default Page;
