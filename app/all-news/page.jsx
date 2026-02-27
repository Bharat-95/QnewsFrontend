"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const ManageNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all news
  const fetchAllNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "/api/newsEn/all"
      );
      setNewsList(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching news:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, []);

  // Handle checkbox toggle
  const handleCheckbox = (newsId) => {
    setSelectedIds((prev) =>
      prev.includes(newsId)
        ? prev.filter((id) => id !== newsId)
        : [...prev, newsId]
    );
  };

  // Handle delete selected
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} news items?`))
      return;

    try {
      await axios.delete(
        "/api/newsEn/bulk",
        { data: { ids: selectedIds } }
      );
      alert("Selected news deleted successfully!");
      setSelectedIds([]);
      fetchAllNews(); // Refresh list
    } catch (err) {
      console.error("Error deleting news:", err);
      alert("Failed to delete news.");
    }
  };

  return (
    <div className="p-4 relative">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newsList.map((news) => (
            <div
              key={news.newsId}
              className="flex items-center border p-2 rounded shadow"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(news.newsId)}
                onChange={() => handleCheckbox(news.newsId)}
                className="mr-2"
              />
              <div className="flex items-center gap-2">
                <div className="w-20 h-20 relative flex-shrink-0">
                  <Image
                    src={news.image || "/placeholder.png"}
                    alt="News Image"
                    fill
                    className="object-cover rounded"
                    unoptimized={true}
                  />
                </div>
                <div className="line-clamp-2 font-semibold">{news.headlineEn}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sticky delete banner */}
      {selectedIds.length > 0 && (
        <div
          className="fixed bottom-0 left-0 w-full bg-red-600 text-white py-3 px-4 flex justify-between items-center shadow-lg z-50"
        >
          <span>{selectedIds.length} selected</span>
          <button
            onClick={handleDeleteSelected}
            className="bg-white text-red-600 px-4 py-2 rounded font-semibold"
          >
            Delete Selected
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageNews;
