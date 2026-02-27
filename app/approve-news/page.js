"use client"
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import CustomModal from '../../components/CustomModal.js';
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newImage, setNewImage] = useState(null); 
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/newsEn');
        const data = await response.json();
        console.log(data);
        setNewsList(data.data);
      } catch (error) {
        console.log('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

  const openModal = (news) => {
    setSelectedNews(news);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedNews(null);
    setNewImage(null); 
  };

  useEffect(() => {
    const role = localStorage.getItem("role"); 
    const token = localStorage.getItem("token");

    if (token && ["Admin", "SuperAdmin"].includes(role)) {
      setIsAuthorized(true);
    } else {
      router.push("/unauthorized");
    }
  }, [router]);

  if (!isAuthorized) {
    return null; 
  }

  const updateStatus = async (status) => {
    try {
      const { newsId, ...newsDataWithoutId } = selectedNews;
      const updatedNews = { ...newsDataWithoutId, status, image: newImage || selectedNews.image };
      const response = await fetch(`/api/newsEn/${selectedNews.newsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNews),
      });

      if (response.ok) {
        setNewsList((prev) =>
          prev.map((news) =>
            news.newsId === selectedNews.newsId ? updatedNews : news
          )
        );
        closeModal();
      } else {
        console.log('Failed to update news status');
      }
    } catch (error) {
      console.log('Error updating news status:', error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/newsEn/${selectedNews.newsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...selectedNews, image: newImage || selectedNews.image }),
      });

      if (response.ok) {
        setNewsList((prev) =>
          prev.map((news) =>
            news.newsId === selectedNews.newsId ? selectedNews : news
          )
        );
        closeModal();
      } else {
        console.log('Failed to update news');
      }
    } catch (error) {
      console.log('Error updating news:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(URL.createObjectURL(file)); // Preview the image
    }
  };

  const handleBooleanChange = (field, value) => {
    setSelectedNews({
      ...selectedNews,
      [field]: value === 'Yes' ? 'Yes' : 'No'  // Store 'Yes' or 'No' as strings
    });
  };
  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">News List</h1>
      {/* Check if there are no pending news */}
      {newsList.filter(news => news.status === 'Pending').length === 0 ? (
        <p className="text-xl text-orange-500">No pending news to approve.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {newsList
            .filter((news) => news.status === 'Pending')
            .map((news) => (
              <div
                key={news.newsId}
                className="border border-orange-300 p-4 rounded-lg w-72 text-center cursor-pointer hover:bg-orange-200"
                onClick={() => openModal(news)}
              >
                <Image
                  src={news.image}
                  alt="No Image Found"
                  width={500}
                  height={500}
                  className="w-full h-48 object-fit mb-4 rounded"
                  unoptimized={true}
                  
                />
                <h3 className="text-xl font-semibold">{news.headline}</h3>
              </div>
            ))}
        </div>
      )}

      {selectedNews && (
        <CustomModal isOpen={modalIsOpen} closeModal={closeModal}>
          <h2 className="text-2xl font-semibold mb-4">Edit News</h2>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Headline (English) :</label>
              <input
                type="text"
                value={selectedNews.headlineEn}
                onChange={(e) =>
                  setSelectedNews({ ...selectedNews, headlineEn: e.target.value })
                }
                required
                className="w-full bg-orange-50 text-black p-2 border border-orange-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Headline (Telugu):</label>
              <input
                type="text"
                value={selectedNews.headlineTe}
                onChange={(e) =>
                  setSelectedNews({ ...selectedNews, headlineTe: e.target.value })
                }
                required
                className="w-full bg-orange-50 text-black p-2 border border-orange-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">News (English):</label>
              <textarea
                value={selectedNews.newsEn}
                onChange={(e) =>
                  setSelectedNews({ ...selectedNews, newsEn: e.target.value })
                }
                required
                className="w-full bg-orange-50 p-2 border border-orange-300 rounded-md h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">News (Telugu):</label>
              <textarea
                value={selectedNews.newsTe}
                onChange={(e) =>
                  setSelectedNews({ ...selectedNews, newsTe: e.target.value })
                }
                required
                className="w-full bg-orange-50 p-2 border border-orange-300 rounded-md h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category:</label>
              <input
                type="text"
                value={selectedNews.category}
                onChange={(e) =>
                  setSelectedNews({ ...selectedNews, category: e.target.value })
                }
                required
                className="w-full bg-orange-50 p-2 border border-orange-300 rounded-md"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium">Image:</label>
              <div className="mb-4">
                <Image
                  src={newImage || selectedNews.image}
                  alt="News Image"
                  width={500}
                  height={500}
                  className="w-full h-48 object-cover rounded"
                  onClick={() => document.getElementById('imageInput').click()} // Trigger file input on image click
                  unoptimized={true}
                />
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="mt-6 space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => updateStatus('Approved')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => updateStatus('Unapproved')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Unapprove
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </CustomModal>
      )}
    </div>
  );
};

export default Page;
