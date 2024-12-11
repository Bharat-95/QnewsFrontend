"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/languagecontext";

const Page = () => {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const {translations, language} = useLanguage();

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("date", date);
    formData.append("month", month);
    formData.append("year", year);
    formData.append("thumbnail", thumbnail);
  
    try {
      const response = await fetch("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/paper", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        alert("Paper uploaded successfully ");
        setFile('');
        setDate('');
        setMonth('');
        setYear('');
      } else {
        alert("Failed to upload paper");
      }
    } catch (error) {
      console.error("Error uploading paper:", error);
      alert("Error uploading paper");
    }
  };
  

  return (
    <div className="max-w-4xl min-h-screen mx-10 p-6 mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6">{translations.uploadEPaper}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="file" className="text-lg font-medium text-gray-700 mb-2">{translations.uploadPaper}</label>
          <input
            type="file"
            id="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
            className="px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col">
        <label htmlFor="URL" className="text-lg font-medium text-gray-700 mb-2">{translations.uploadThumbnail}</label>
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])} 
            required
            className="px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex flex-col w-1/3">
            <label htmlFor="date" className="text-lg font-medium text-gray-700 mb-2">{translations.date}</label>
            <input
              type="text"
              id="date"
              placeholder="DD"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col w-1/3">
            <label htmlFor="month" className="text-lg font-medium text-gray-700 mb-2">{translations.month}</label>
            <input
              type="text"
              id="month"
              placeholder="MM"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col w-1/3">
            <label htmlFor="year" className="text-lg font-medium text-gray-700 mb-2">{translations.year}</label>
            <input
              type="text"
              id="year"
              placeholder="YYYY"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              className="px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {translations.submitPaper}
        </button>
      </form>
    </div>
  );
};

export default Page;
