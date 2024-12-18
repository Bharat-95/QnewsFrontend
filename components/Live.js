"use client";
import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const Live = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/video"
      );

      const responseData = response.data;

      setData(responseData.data);
    } catch (error) {
      console.log("Unable to fetch Data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div  className="w-[100%] lg:h-56 md:h-56  h-[480px]">
      {data
      .filter((video) => video.category === "Live")
      .map((video) => (
        <div key={video.videoId} className="lg:flex md:flex w-[100%] justify-between gap-10 h-56 lg:space-y-0 md:space-y-0 space-y-4">
          <div className="md:w-[50%] lg:w-[30%] w-[100%] border border-orange-300 rounded-md shadow-md">
            <Link href={video.URL}>
            <div className="w-[100%] h-[100%]">
            <Image
             src={video.thumbnail}
             alt="No thumbnail found"
             width={300}
                height={200}
                className="w-full h-[100%] object-fit shadow-md rounded-md" />
                </div>
            </Link>
            
          </div>
          <div className="md:w-[50%] lg:w-[70%] w-[100%] border border-orange-300 h-56 rounded-md shadow-md flex justify-center p-4 text-[12px]">
        Advertisemt
      </div>
        </div>
      ))}

     
    </div>
  );
};

export default Live;
