"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const QnewsHd = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVideos, setFilteredVideos] = useState([]);

  const API_KEY = "AIzaSyBVDXvDJ7-h7Nix2892N72LPJ1QniARzis";
  const CHANNEL_ID = "UCbivggwUD5UjHhYmkha8DdQ";
  const MAX_RESULTS = 50;

  const decodeHtmlEntities = (text) => {
    const element = document.createElement("textarea");
    element.innerHTML = text;
    return element.value;
  };

  const fetchVideos = useCallback(async (pageToken = "") => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&type=video&maxResults=1&order=date`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`API Error: ${data.error.message}`);
      }

      const cleanedVideos = data.items
        .map((video) => ({
          ...video,
          snippet: {
            ...video.snippet,
            title: decodeHtmlEntities(video.snippet.title),
          },
        }))
        .filter(
          (video) =>
            !video.snippet.title.toLowerCase().includes("shorts") && // Exclude videos with "Shorts" in the title
            !video.snippet.description?.toLowerCase().includes("shorts")&&
            !video.snippet.title.toLowerCase().includes("#") // Exclude videos with "Shorts" in the description
        );

      setVideos(cleanedVideos);
      setFilteredVideos(cleanedVideos);
      setNextPageToken(data.nextPageToken || null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []); // Empty dependency array ensures fetchVideos is stable

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchVideos(nextPageToken);
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
              <Link
                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                passHref
              >
                <div>
                  <div style={{ fontWeight: "bold" }}>{video.snippet.title}</div>
                  {video.snippet.thumbnails?.high?.url && (
                    <div>
                      <Image
                        src={video.snippet.thumbnails.high.url}
                        alt="No Thumbnail Found"
                        width={200}
                        height={200}
                      />
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          style={{ marginRight: "10px", padding: "10px", fontSize: "16px" }}
        >
          Previous
        </button>
        <span style={{ padding: "10px", fontSize: "16px" }}>Page {page}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!nextPageToken}
          style={{ marginLeft: "10px", padding: "10px", fontSize: "16px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QnewsHd;
