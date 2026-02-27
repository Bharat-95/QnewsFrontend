"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter hook
import Image from "next/image";

const PapersPage = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize router

  // Fetch papers data from API
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch("/api/paper"); // Replace with your actual API endpoint
        const data = await response.json();

        console.log(data)
        
        // Assuming papers have date, month, and year fields that are strings
        const sortedPapers = data.data
  .filter(p => p.date && p.month && p.year)
  .sort((a, b) => {
    const dateA = new Date(+a.year, +a.month - 1, +a.date); // Month is 0-indexed
    const dateB = new Date(+b.year, +b.month - 1, +b.date);
    return dateB.getTime() - dateA.getTime(); // Descending
  });

        setPapers(sortedPapers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching papers:", error);
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  // Handle paper click to navigate to a different page
  const handlePaperClick = (paperId) => {
    // Navigate to a different page with the selected paperId as a query parameter
    router.push(`/papers/${paperId}`);
  };

  // Loading spinner
  if (loading) {
    return <div className="text-center text-xl">Loading papers...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">All Papers</h1>

      {/* Display the list of papers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {papers.map((paper) => (
          <div
            key={paper.paperId}
            className="border rounded-lg shadow-md p-4 bg-orange-100"
            onClick={() => handlePaperClick(paper.paperId)} // Navigate on paper click
          >
            {/* Show the thumbnail image */}
            <Image
              src={paper.thumbnailUrl}
              alt={`Thumbnail for ${paper.date} ${paper.month} ${paper.year}`}
              width={500}
              height={500}
              className="w-full h-48 object-cover rounded-md cursor-pointer"
              unoptimized={true}
            />

            <h3 className="text-xl font-semibold mb-2 mt-4 cursor-pointer">
              {paper.date} {paper.month} {paper.year}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PapersPage;
