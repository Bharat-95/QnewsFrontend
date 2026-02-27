"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useLanguage } from "../context/languagecontext";
import { Ramaraja } from "next/font/google";

const ramaraja = Ramaraja({
  subsets: ["latin", "telugu"],
  weight: "400",
});

// Format date properly
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
};

// Convert time difference into human-readable format
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

const Latest = () => {
  const [data, setData] = useState([]);
  const { language, translations } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(8);
  const loaderRef = useRef(null);

  // Fetch news data
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "/api/newsEn"
      );
      const responseData = response.data.data;

      // Sort by latest date first (descending order)
      const sortedData = responseData
        .filter(news => news.status === "Approved" && news.category === "Sports")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setData(sortedData);
    } catch (error) {
      console.log("Unable to fetch the Latest News", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch every 30 seconds for latest updates
    return () => clearInterval(interval);
  }, []);

  const loadMoreImages = useCallback(() => {
    if (visibleCount < data.length) {
      setVisibleCount((prevCount) => prevCount + 4); // Load 4 more posts each time
    }
  }, [visibleCount, data.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreImages();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.5,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMoreImages]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-full">
          <div className="lg:text-[24px] md:text-[20px] text-orange-600 text-[16px]">
            {translations.sportsnews}
          </div>
          <div className="flex-1 h-[1px] bg-gray-400"></div>
          <Link
            href="/sports"
            className="text-orange-600 border border-gray-400 p-2 m-1 font-semibold rounded-3xl"
          >
            more {">>"}
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide sm:w-screen lg:w-auto md:w-auto py-4">
        <div className="flex gap-4">
          {data.slice(0, visibleCount).map((latest) => (
            <Link
              href={{
                pathname: `/news/${latest.newsId}`,
                query: { language },
              }}
              passHref
              key={latest.newsId}
              className="flex-shrink-0 w-[80%] md:w-[40%] lg:w-[20%] border border-orange-600 lg:p-3 p-2 rounded-md shadow-lg space-y-2 hover:transform duration-500 hover:translate-x-2 hover:-translate-y-2"
            >
              <Image
                alt="No Image Found"
                src={latest.image}
                width={300}
                height={200}
                className="w-full h-[150px] object-cover shadow-md rounded-md"
                unoptimized={true}
              />
              <div
                className={` line-clamp-2 text-ellipsis overflow-hidden hover:underline ${
                  language === "te"
                    ? `${ramaraja.className} text-[16px]`
                    : `text-[13px] font-semibold`
                } `}
              >
                {language === "te" ? latest.headlineTe : latest.headlineEn}
              </div>

              <div className="text-[12px] flex justify-between font-light text-gray-500">
                <p>{formatDate(latest.createdAt)}</p>
                <p>{timeAgo(latest.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Load More on Scroll */}
      <div ref={loaderRef} className="w-[300px] h-[50px]"></div>
    </div>
  );
};

export default Latest;
