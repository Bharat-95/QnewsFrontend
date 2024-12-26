"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "@/context/languagecontext";
import { Ramaraja } from "next/font/google";

const ramaraja = Ramaraja({
  subsets: ["latin", "telugu"],
  weight: "400",
});

const Live = () => {
  const [data, setData] = useState(null); // Initialize as null
  const { language } = useLanguage();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/live"
      );
      const responseData = response.data;
      console.log("Fetched Data:", responseData); // Log for debugging

      // If the data is empty, set null
      if (!responseData.data || responseData.data.length === 0) {
        setData(null);
      } else {
        setData(responseData.data);
      }
    } catch (error) {
      console.log("Unable to fetch data:", error.message);
      setData(null); // Handle errors by setting data to null
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Only render the section if live data is available
  if (!data) {
    return null; // Do not render anything if data is null
  }

  return (
    <div className="w-[100%] lg:h-72 md:h-72 md:my-20 my-10 h-[300px]">
      <div className="lg:flex md:flex w-[100%] h-[100%]">
        <div className="md:w-[50%] lg:w-[100%] w-[100%] border border-red-600 rounded-md shadow-md">
          <div className="w-full h-[80%] mb-4">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${data.videoId}`}
              title={data.title || "Live Video"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div
            className={`px-2 font-bold ${
              language === "te" ? `text-[18px] ${ramaraja.className}` : ``
            }`}
          >
            {data.title}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Live;
