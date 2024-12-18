"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import advertisement from '../public/shanarti.png'
import { LanguageProvider, useLanguage } from "@/context/languagecontext";

const Live = () => {
  const [data, setData] = useState([]);
  const { language, translations } = useLanguage();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/video"
      );

      const responseData = response.data;

      // Sort data by the date or timestamp field in descending order (latest first)
      const sortedData = responseData.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setData(sortedData);
    } catch (error) {
      console.log("Unable to fetch Data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-[100%] lg:h-72 md:h-56 h-[400px]">
      {data
        .filter((video) => video.category === "Live")
        .slice(0, 1) // This will select only the latest video after sorting
        .map((video) => (
          <div key={video.videoId} className="lg:flex md:flex w-[100%] justify-between gap-10 h-[100%] lg:space-y-0 md:space-y-0 space-y-4">
            <div className="md:w-[50%] lg:w-[30%] w-[100%] border border-orange-300 rounded-md shadow-md">
              <Link href={video.URL} className="space-y-2">
                <div className="w-[100%] h-[80%] md:h-[70%]">
                  <Image
                    src={video.thumbnail}
                    alt="No thumbnail found"
                    width={500}
                    height={500}
                    className="w-full h-[100%] object-fit shadow-md rounded-md" />
                </div>
                <div className="px-2 font-bold">{language === "te" ? video.titleTe : video.titleEn}</div>
              </Link>
            </div>
            <div className="md:w-[50%] lg:w-[70%] w-[100%] border border-orange-300 lg:h-[100%] md:h-40 h-32 rounded-md shadow-md flex justify-center text-[12px]">
              <Image 
                alt="No Image Found"
                src={advertisement}
                width={500}
                height={500}
                className="w-[100%] h-[100%]" />
            </div>
          </div>
        ))}
    </div>
  );
};

export default Live;
