"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useLanguage } from "../context/languagecontext";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
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
    return postDate.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

const Latest = () => {
  const [data, setData] = useState([]);
  const { language, translations } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(20);  // Set the initial visible count to 8
  const loaderRef = useRef(null); 

  const fetchData = async () => {
    try {
      const response = await axios.get("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn");
      const responseData = await response.data;
      const filteredData = responseData.data;
      
      filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setData(filteredData);
    } catch (error) {
      console.log("Unable to fetch the Latest News", error);
    }
  };

  const loadMoreImages = useCallback(() => {
    if (visibleCount < data.length && visibleCount < 8) {
      setVisibleCount((prevCount) => prevCount + 1); 
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
        <div className="lg:text-[24px] md:text-[20px] text-[16px]">{translations.politicalnews}</div>
        <div className="lg:w-[300px] md:w-[200px] w-[100px] h-[1px] bg-gray-400"></div>
      </div>

      <div className="overflow-x-auto scrollbar-hide sm:w-screen lg:w-auto md:w-auto py-4">
        <div className="flex gap-4 ">
          {data
          .filter((latest) => latest.category === "Political")
          .slice(0, visibleCount).map((latest) => (
            <Link href={`/news/${latest.newsId}`} key={latest.newsId} className="flex-shrink-0  w-[80%] md:w-[40%] lg:w-[30%]  md: border border-black lg:p-3 p-2 rounded-md shadow-lg space-y-2 hover:transform duration-500 hover:translate-x-2 hover:-translate-y-2">
              <Image
                alt="No Image Found"
                src={latest.image}
                width={300}
                height={200}
                className="w-full h-[200px] object-cover shadow-md rounded-md"
              />
              <div className="text-[13px] font-semibold line-clamp-2 text-ellipsis overflow-hidden hover:underline">{language === "te" ? latest.headlineTe : latest.headlineEn}</div>
              
              <div className="text-[12px] flex justify-between font-light text-gray-500">
                <p>{formatDate(latest.createdAt)}</p>
                <p>{timeAgo(latest.createdAt)}</p>
                <p></p>
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
