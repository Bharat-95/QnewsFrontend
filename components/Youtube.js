"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../context/languagecontext";
import { Ramaraja } from "next/font/google";

const ramaraja = Ramaraja({
  subsets: ["latin", "telugu"],
  weight: "400",
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-GB", options);
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
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }
};

const API_KEYS_AND_CHANNELS = [
  { apiKey: "AIzaSyCb482yfL6MqQdAqWg25r1thXqVeYOS17k", channelId: "UCI-7hequY2IuQjpuj6g9BlA" },
  { apiKey: "AIzaSyBXIz6s04PIgdSL_HwdlDKp8k9V4rtKQSw	", channelId: "UCbivggwUD5UjHhYmkha8DdQ" },
  { apiKey: "AIzaSyC389SnCnBqCujbj2BTv-f3H_6saYx1KcQ	", channelId: "UCUVJf9GvRRxUDauQi-qCcfQ" },
  { apiKey: "AIzaSyBeWswPuSMfmtwjgP6O-B658DtvMo3ntTI", channelId: "UCvOTCRd0GKMSGeKww86Qw5Q" },
];

const MAX_RESULTS_PER_CHANNEL = 20;

const Latest = () => {
  const { translations, language } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const loaderRef = useRef(null);

  const fetchVideos = useCallback(async () => {
    try {
      const allVideos = [];
  
      // Fetch videos for each channel using its respective API key
      for (const { apiKey, channelId } of API_KEYS_AND_CHANNELS) {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&type=video&maxResults=${MAX_RESULTS_PER_CHANNEL}&order=date`
        );
        const data = await response.json();
  
        if (response.ok && !data.error) {
          const cleanedVideos = data.items.filter(
            (video) =>
              !video.snippet.title.toLowerCase().includes("shorts") &&
              !video.snippet.description?.toLowerCase().includes("shorts") &&
              !video.snippet.title.includes("#") &&
              video.snippet.liveBroadcastContent !== "live" // Exclude live videos
          );
          allVideos.push(...cleanedVideos);
        }
      }
  
      // Sort videos by publish date (descending order)
      const sortedVideos = allVideos.sort(
        (a, b) =>
          new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt)
      );
  
      // Set the top 20 videos
      setVideos(sortedVideos.slice(0, 20));
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  }, [])

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]); // Safe to use fetchVideos as it’s stable

  const loadMoreVideos = useCallback(() => {
    setVisibleCount((prevCount) => Math.min(prevCount + 10, videos.length));
  }, [videos.length]);

  useEffect(() => {
    const loaderElement = loaderRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreVideos();
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
  }, [loadMoreVideos]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="lg:text-[24px] md:text-[20px] text-orange-600 text-[16px]">
          Q News {translations.videos}
        </div>
        <div className="lg:w-[300px] md:w-[200px] w-[100px] h-[1px] bg-gray-400"></div>
      </div>

      <div className="overflow-x-auto  scrollbar-hide sm:w-screen lg:w-auto md:w-auto py-4">
        <div className="flex gap-4">
          {videos.slice(0, visibleCount).map((video) => (
            <div
              key={video.id.videoId}
              className="flex-shrink-0 w-[80%] md:w-[40%] lg:w-[30%] border border-orange-600 lg:p-3 p-2 rounded-md shadow-lg space-y-2 hover:transform duration-500 hover:translate-x-2 hover:-translate-y-2"
            >
              <iframe
                src={`https://www.youtube.com/embed/${video.id.videoId}?autoplay=0&mute=0`}
                title={video.snippet.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                width="100%"
                height="200"
                allowFullScreen
                className="w-full h-[200px] object-fit shadow-md rounded-md"
              />
              <div
                className={`line-clamp-2 text-ellipsis overflow-hidden hover:underline ${
                  language === "te"
                    ? `${ramaraja.className} text-[16px]`
                    : `text-[13px] font-semibold`
                }`}
              >
                {language === "te" ? video.snippet.title : video.snippet.title}
              </div>

              <div className="text-[12px] flex justify-between font-light text-gray-500">
                <p>{formatDate(video.snippet.publishedAt)}</p>
                <p>{timeAgo(video.snippet.publishedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div ref={loaderRef} className="w-[300px] h-[50px]"></div>
    </div>
  );
};

export default Latest;
