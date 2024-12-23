"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/languagecontext";
import Image from "next/image";
import Link from "next/link";
import { Ramaraja } from "next/font/google";


const ramaraja = Ramaraja({
  subsets: ["latin", "telugu"],
  weight: "400", 
});

const Page = () => {
  const [data, setData] = useState([]);
  const { language, translations } = useLanguage();

  const fetchData = async () => {
    try {
      const response = await axios.get("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn");
      const responseData = response.data;
      setData(responseData.data || []);
    } catch (error) {
      console.log("Unable to retrieve the news");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data
  .filter(
    (news) => news.category === "Health" && news.status === "Approved"
  )
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const trendingNews = [...data]
    .filter((news) => news.status === "Approved")
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 4);

    const mostRecentPost = filteredData[0];
    const otherPosts = filteredData.slice(1, 11);

  return (
    <div className="flex min-h-screen  flex-col lg:flex-row gap-8 mx-4 md:mx-6 lg:mx-10 my-6 md:my-8 lg:my-10">
      <div className="flex-[7]">
        {mostRecentPost && (
          <div className="w-full mb-8 md:mb-10">
            <Link href={`/news/${mostRecentPost.newsId}`}>
              <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] flex justify-center mb-4">
                <Image
                  src={mostRecentPost.image}
                  alt="No Image Found"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <div className={` font-bold ${language === "te"? `${ramaraja.className} text-[34px]`:`text-[30px]  md:text-2xl lg:text-3xl`}`}>
                {language === "te"
                  ? mostRecentPost.headlineTe
                  : mostRecentPost.headlineEn}
              </div>
              <div className={`line-clamp-2  mt-2 ${language === "te" ? `text-[20px]`:`text-sm  md:text-lg`}`}>
                {language === "te"
                  ? mostRecentPost.newsTe
                  : mostRecentPost.newsEn}
              </div>
            </Link>
          </div>
        )}

        <div className="w-full flex flex-col gap-6">
          {otherPosts.length > 0 ? (
            otherPosts.map((news) => (
              <div
                key={news.newsId}
                className="flex gap-4 items-center border border-orange-300 rounded-md"
              >
                <div className="flex-[7] p-4">
                  <Link href={`/news/${news.newsId}`}>
                    <div className={`font-bold line-clamp-1 hover:underline  ${language === "te" ?`text-[20px] ${ramaraja.className}`:`text-[20px] md:text-base`}`}>
                      {language === "te" ? news.headlineTe : news.headlineEn}
                    </div>
                    <div className={`line-clamp-3  mt-2 ${language === "te" ?`text-[15px]`:`text-xs md:text-sm`}`}>
                      {language === "te" ? news.newsTe : news.newsEn}
                    </div>
                  </Link>
                </div>
                <div className="flex-[3]">
                  <Link href={`/news/${news.newsId}`}>
                    <Image
                      src={news.image}
                      alt="No Image Found"
                      width={200}
                      height={150}
                      className="object-cover w-full lg:h-48 h-28 md:h-40 rounded-md"
                    />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
      </div>

      <div className="hidden lg:block flex-[3] p-4 rounded-lg">
        <h2 className={`  font-bold mb-4 flex justify-center ${language === "te" ?`text-[24px] ${ramaraja.className}`:`text-lg md:text-xl`}`}>{translations.trendingHeadlines}</h2>
        {trendingNews.length > 0 ? (
          trendingNews.map((news) => (
            <div
              key={news.newsId}
              className="flex flex-col gap-2 p-4 rounded-md mb-4"
            >
              {/* Image Section */}
              <div className="w-full h-[160px] md:h-[200px] lg:h-[250px]">
                <Link href={`/news/${news.newsId}`}>
                  <Image
                    src={news.image}
                    alt="No Image Found"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full rounded-md"
                  />
                </Link>
              </div>
              {/* Text Section */}
              <div className="flex-grow">
                <Link href={`/news/${news.newsId}`}>
                  <div className={`font-bold hover:underline ${language === "te" ? `${ramaraja.className} text-[20px]`:`text-xs md:text-sm` }`}>
                    {language === "te" ? news.headlineTe : news.headlineEn}
                  </div>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No trending news available</p>
        )}
      </div>
    </div>
  );
};

export default Page;
