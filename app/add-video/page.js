"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/languagecontext";

const Page = () => {
  const router = useRouter();
  const [URL, setUrl] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [titleEn, setTitleEn] = useState('');
  const [titleTe, setTitleTe] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const { translations, language } = useLanguage();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (token && role === "Employee") {
      setIsAuthorized(true);
    } else {
      router.push("/unauthorized");
    }
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titleEn", titleEn);
    formData.append("titleTe", titleTe);
    formData.append("URL", URL);
    formData.append("thumbnail", thumbnail);

    try {
      const response = await fetch("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Video added successfully");
        setTitleEn('');
        setTitleTe('');
        setUrl('');
        setThumbnail('');
      } else {
        alert("Failed to add video");
      }
    } catch (error) {
      console.error("Error adding Video:", error);
      alert("Error adding video");
    }
  };

  return (
    <div className="flex justify-center mt-10 min-h-screen px-6">
      <div className="max-w-4xl w-full space-y-6">
        <h2 className="text-2xl font-semibold text-center mb-6">{translations.addVideo}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="titleEn" className="text-lg font-medium text-gray-700 mb-2">{translations.videoTitleEn}</label>
            <input
              type="text"
              id="titleEn"
              placeholder={translations.enterTitle}
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              required
              className="mx-auto px-4 py-2 border rounded-md bg-orange-50 border-orange-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="titleTe" className="text-lg font-medium text-gray-700 mb-2">{translations.videoTitleTe}</label>
            <input
              type="text"
              id="titleTe"
              placeholder={translations.enterTitle}
              value={titleTe}
              onChange={(e) => setTitleTe(e.target.value)}
              required
              className="mx-auto px-4 py-2 border bg-orange-50 rounded-md border-orange-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="URL" className="text-lg font-medium text-gray-700 mb-2 ">{translations.enterUrl}</label>
            <input
              type="text"
              id="URL"
              placeholder={translations.urlEnter}
              value={URL}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="mx-auto px-4 bg-orange-50 py-2 border rounded-md border-orange-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="URL" className="text-lg font-medium text-gray-700 mb-2">{translations.uploadThumbnail}</label>
            <input
              type="file"
              onChange={(e) => setThumbnail(e.target.files[0])}
              required
              className="mx-auto px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {translations.submitVideo}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
