"use client";
import React, { useState, useEffect } from "react";

const QnewsHd = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);

  const API_KEY = "AIzaSyBVDXvDJ7-h7Nix2892N72LPJ1QniARzis";
  const CHANNEL_ID = "UCbivggwUD5UjHhYmkha8DdQ";
  const MAX_RESULTS = 10;

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&type=video&maxResults=${MAX_RESULTS}&order=date`
        );
        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.error?.message || "Failed to fetch videos.");
        }

        const cleanedVideos = data.items.filter(
          (video) =>
            !video.snippet.title.toLowerCase().includes("shorts") && // Exclude Shorts
            !video.snippet.description?.toLowerCase().includes("shorts")
        );

        setVideos(cleanedVideos);
        setFilteredVideos(cleanedVideos);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(
        videos.filter(
          (video) =>
            video.snippet.title.toLowerCase().includes(query) ||
            video.snippet.publishedAt.toLowerCase().includes(query)
        )
      );
    }
  };

  return (
    <div>
      {/* Search bar */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by title or date"
          value={searchQuery}
          onChange={handleSearch}
          style={{
            width: "300px",
            padding: "10px",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        />
      </div>

      {/* Videos */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <h2>Latest Videos</h2>
          {filteredVideos.map((video) => (
            <div key={video.id.videoId} style={{ marginBottom: "20px" }}>
              <div>
                <div style={{ fontWeight: "bold" }}>{video.snippet.title}</div>
                <div
                  style={{
                    position: "relative",
                    paddingTop: "56.25%", // Maintain 16:9 aspect ratio
                  }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.id.videoId}`}
                    title={video.snippet.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  ></iframe>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QnewsHd;
