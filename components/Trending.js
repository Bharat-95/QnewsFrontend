"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useLanguage } from "@/context/languagecontext";
import { Ramaraja } from "next/font/google";

const ramaraja = Ramaraja({
  subsets: ["latin", "telugu"],
  weight: "400",
});

const Trending = () => {
  const [data, setData] = useState([]);
  const { language, translations } = useLanguage();
  const [adsLoaded, setAdsLoaded] = useState(false); // Tracks if ads are loaded

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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn"
      );
      const responseData = await response.data;
      const trendingData = responseData.data.sort((a, b) => b.likes - a.likes);

      setData(trendingData);
    } catch (error) {
      console.error("Unable to fetch Trending News", error);
    }
  };

  useEffect(() => {
    fetchData();

    // Load AdSense script dynamically
    const script = document.createElement("script");
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        try {
          window.adsbygoogle.push({});
          setAdsLoaded(true); // Set ads as loaded
        } catch (error) {
          console.error("AdSense error:", error);
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="space-y-4 m-[10px]">


  
  <div className="flex items-center justify-evenly mb-2"> {/* Reduced margin-bottom */}
    <div className="h-[1px] w-[20%] bg-gray-400"></div>
    <div className="lg:text-[20px] md:text-[16px] text-orange-600 text-[16px]">
      {translations.trendingHeadlines}
    </div>
    <div className="h-[1px] w-[20%] bg-gray-400"></div>
  </div>



  <div className="space-y-10 overflow-y-auto scrollbar-hide">
    {data.length > 0 ? (
      data
        .slice(0, 14)
        .filter((trending) => trending.status === "Approved")
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
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <div
                className={`line-clamp-2 text-ellipsis overflow-hidden font-semibold ${
                  language === "te"
                    ? `${ramaraja.className} text-[16px]`
                    : `text-[13px]`
                }`}
              >
                {language === "te" ? trending.headlineTe : trending.headlineEn}
              </div>
            </Link>
          </div>
        ))
    ) : (
      <p className="text-center text-gray-500">Loading trending news...</p>
    )}
  </div>
  <div className="mb-2"> {/* Reduced margin-bottom to bring ad closer to title */}
    <ins
      className="adsbygoogle"
      style={{ display: "block", width:"400px", height:"200px"}}
      data-ad-format="autorelaxed"
      data-ad-client="ca-pub-5147970592590624"
      data-ad-slot="7384828746"
    ></ins>
  </div>
</div>

  );
};

export default Trending;
