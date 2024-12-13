"use client";

import React, { useState, useEffect } from "react";
import CustomModal from "../../components/CustomModal"; // Import CustomModal
import Image from "next/image";

const PapersPage = () => {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null); // For viewing the PDF
  const [loading, setLoading] = useState(true);

  // Fetch papers data from API
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/paper"); // Replace with your actual API endpoint
        const data = await response.json();
        
        // Assuming papers have date, month, and year fields that are strings
        const sortedPapers = data.data.sort((a, b) => {
          // Convert date, month, and year to Date objects for proper sorting
          const dateA = new Date(`${a.month} ${a.date}, ${a.year}`);
          const dateB = new Date(`${b.month} ${b.date}, ${b.year}`);
          return dateB - dateA; // Sort descending to show latest first
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

  // Handle paper download
  const handleDownload = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop(); // Get the file name from URL and set it as the download filename
    link.click();
  };

  // Loading spinner
  if (loading) {
    return <div className="text-center text-xl">Loading papers...</div>;
  }

  const closeModal = () => {
    setSelectedPaper(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">All Papers</h1>

      {/* Display the list of papers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {papers.map((paper) => (
          <div
            key={paper.paperId}
            className="border rounded-lg shadow-md p-4 bg-orange-100"
          >
            {/* Show the thumbnail image */}
            <Image
              src={paper.thumbnailUrl}
              alt={`Thumbnail for ${paper.date} ${paper.month} ${paper.year}`}
              width={500}
              height={500}
              className="w-full h-48 object-cover rounded-md cursor-pointer"
              onClick={() => setSelectedPaper(paper)} // Open modal when the thumbnail is clicked
            />

            <h3
              className="text-xl font-semibold mb-2 mt-4 cursor-pointer"
              onClick={() => setSelectedPaper(paper)} // Open modal when the title is clicked
            >
              {paper.date} {paper.month} {paper.year}
            </h3>

            <div className="mt-4">
              <button
                onClick={() => handleDownload(paper.fileUrl)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to show the full paper */}
      {selectedPaper && (
        <CustomModal isOpen={true} closeModal={closeModal}>
          <div className="mt-8 p-4 border rounded-lg shadow-md bg-orange-50">
            <h2 className="text-xl font-bold mb-4">
              Viewing Paper: {selectedPaper.date} {selectedPaper.month}{" "}
              {selectedPaper.year}
            </h2>
            <iframe
              src={selectedPaper.fileUrl}
              width="100%"
              height="600"
              title="PDF Viewer"
              className="border rounded-md"
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => setSelectedPaper(null)} // Close the PDF
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Close PDF
              </button>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default PapersPage;
