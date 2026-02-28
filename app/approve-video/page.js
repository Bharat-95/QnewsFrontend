"use client";
import React, { useEffect, useState } from "react";
import CustomModal from "../../components/CustomModal.js"; 
import Image from "next/image.js";// Assuming you have a CustomModal component
import { uploadFileToSupabaseStorage } from "@/lib/client/storageUpload";

// Inside your main component

const VideoApproval = () => {
    const [videosList, setVideosList] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState(null);
  
    // Fetch videos from the backend
    useEffect(() => {
      const fetchVideos = async () => {
        try {
          const response = await fetch("/api/video");
          const data = await response.json();
          setVideosList(data.data);
        } catch (error) {
          console.log("Error fetching videos:", error);
        }
      };
      fetchVideos();
    }, []);
  
    // Open modal with selected video details
    const openModal = (video) => {
      setSelectedVideo(video);
      setThumbnailPreview(video.thumbnail || "");
      setModalIsOpen(true);
    };
  
    // Close the modal
    const closeModal = () => {
      setModalIsOpen(false);
      setSelectedVideo(null);
      setThumbnailPreview("");
      setThumbnailFile(null);
    };
  
    const updateStatus = async (status) => {
      try {
        const updatedVideo = { ...selectedVideo, status };
        const response = await fetch(
          `/api/video/${selectedVideo.videoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedVideo),
          }
        );
  
        if (response.ok) {
          setVideosList((prev) =>
            prev.map((video) =>
              video.videoId === selectedVideo.videoId ? updatedVideo : video
            )
          );
          closeModal();
        } else {
          console.log("Failed to update video status");
        }
      } catch (error) {
        console.log("Error updating video status:", error);
      }
    };
  
    const handleEdit = async (e) => {
      e.preventDefault();
      try {
        let thumbnailUrl = selectedVideo.thumbnail;
        if (thumbnailFile) {
          thumbnailUrl = await uploadFileToSupabaseStorage(thumbnailFile, {
            bucket: process.env.NEXT_PUBLIC_SUPABASE_BUCKET_VIDEO_THUMBNAILS || "video-thumbnails",
            folder: "video-thumbnails",
          });
        }

        const updatedVideo = { ...selectedVideo, thumbnail: thumbnailUrl };
        const response = await fetch(
          `/api/video/${selectedVideo.videoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedVideo),
          }
        );
  
        if (response.ok) {
          setVideosList((prev) =>
            prev.map((video) =>
              video.videoId === selectedVideo.videoId ? updatedVideo : video
            )
          );
          closeModal();
        } else {
          console.log("Failed to update video details");
        }
      } catch (error) {
        console.log("Error updating video details:", error);
      }
    };
  
    const handleThumbnailChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
      }
    };
  
    return (
      <div>
        <div className="flex min-h-screen mt-10 flex-wrap gap-6">
          {videosList.filter((video) => video.status === "Pending").length ===
          0 ? (
            <p>No pending videos to approve</p>
          ) : (
            videosList
              .filter((video) => video.status === "Pending")
              .map((video) => (
                <div
                  key={video.videoId}
                  className="border border-orange-300 p-4 rounded-lg w-[30%] h-96 text-center cursor-pointer hover:bg-orange-200"
                >
                  <Image
                    src={video.thumbnail}
                    alt="Thumbnail"
                    className="mb-4 rounded w-[100%]"
                    width={500}
                    height={500}
                  />
                  <div className="flex justify-center gap-4 mb-4">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => window.open(video.URL, "_blank")}
                    >
                      View Video
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      onClick={() => openModal(video)} // Open modal with video details
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      onClick={() => openModal(video)} // Open modal for approval
                    >
                      Approve
                    </button>
                  </div>
                  <h3 className="text-xl font-semibold line-clamp-2">{video.titleEn}</h3>
                </div>
              ))
          )}
        </div>
  
        {selectedVideo && (
          <CustomModal isOpen={modalIsOpen} closeModal={closeModal}>
            <h2 className="text-2xl font-semibold mb-4">Edit Video</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Title (English):
                </label>
                <input
                  type="text"
                  value={selectedVideo.titleEn}
                  onChange={(e) =>
                    setSelectedVideo({
                      ...selectedVideo,
                      titleEn: e.target.value,
                    })
                  }
                  required
                  className="w-full p-2 border border-orange-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Title (Telugu):
                </label>
                <input
                  type="text"
                  value={selectedVideo.titleTe}
                  onChange={(e) =>
                    setSelectedVideo({
                      ...selectedVideo,
                      titleTe: e.target.value,
                    })
                  }
                  required
                  className="w-full p-2 border border-orange-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Thumbnail:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="w-full p-2 "
                />
                {thumbnailPreview && (
                  <div className="mt-2">
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      width={500}
                      height={500}
                      className="w-24 h-24 object-fit rounded-md"
                    />
                  </div>
                )}
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
                  onClick={() => updateStatus("Approved")} // Approve inside modal
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus("Unapproved")}
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
  
  export default VideoApproval;
  
