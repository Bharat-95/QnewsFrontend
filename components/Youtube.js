"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../context/languagecontext";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
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
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
};

const Latest = () => {
  const { translations, language } = useLanguage();
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8); // Set initial visible count to 8
  const loaderRef = useRef(null); 

  const fetchData = async () => {
    try {
      const response = await fetch("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/video", { timeout: 20000 });
      const responseData = await response.json();
      const filteredData = responseData.data;
      
      filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setData(filteredData);
    } catch (error) {
      console.log("Unable to fetch the Latest News", error);
    }
  };

  const loadMoreImages = useCallback(() => {
    if (visibleCount < data.length) {
      setVisibleCount((prevCount) => Math.min(prevCount + 1, data.length)); 
    }
  }, [visibleCount, data.length]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const loaderElement = loaderRef.current;

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

    if (loaderElement) {
      observer.observe(loaderElement);
    }

    return () => {
      if (loaderElement) {
        observer.unobserve(loaderElement);
      }
    };
  }, [loadMoreImages]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="lg:text-[24px] md:text-[20px] text-[16px]">{translations.videos}</div>
        <div className="lg:w-[300px] md:w-[200px] w-[100px] h-[1px] bg-gray-400"></div>
      </div>

      <div className="overflow-x-auto sm:w-screen lg:w-auto md:w-auto py-4">
        <div className="flex gap-4">
          {data.slice(0, visibleCount).map((video) => (
            <Link
              href={video.URL}
              key={video.videoId}
              target="_blank"
              className="flex-shrink-0  w-[80%] md:w-[40%] lg:w-[30%]  md: border border-black lg:p-4 p-2 rounded-md shadow-lg space-y-2 hover:transform duration-500 hover:translate-x-2 hover:-translate-y-2"
            >
              <Image
                alt="No Image Found"
                src={video.thumbnail}
                width={300}
                height={200}
                className="w-full h-[200px] object-fit shadow-md rounded-md"
              />
              <div className="text-[13px] font-semibold line-clamp-2 text-ellipsis overflow-hidden hover:underline">
              {language === "te" ? video.titleTe : video.titleEn}
              </div>

              <div className="text-[12px] flex justify-between font-light text-gray-500">
                <p>{formatDate(video.createdAt)}</p>
                <p>{timeAgo(video.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div ref={loaderRef} className="w-[300px] h-[50px]"></div>
    </div>
  );
};

export default Latest;
