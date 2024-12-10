"use client";

import React, { useState, useEffect } from "react";
import CustomModal from "../../components/CustomModal"; // Import CustomModal

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
        setPapers(data.data);
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
            onClick={() => setSelectedPaper(paper)} 
            className="border rounded-lg shadow-md p-4 bg-white"
          >
           

            {/* Show a preview of the PDF (Thumbnail image or first page) */}
            <div
              className="mb-4 cursor-pointer" // Added cursor pointer here
              onClick={() => setSelectedPaper(paper)} // Open modal when clicked anywhere on the preview
            >
              <iframe
                src={paper.fileUrl}
                width="100%"
                height="200"
                title={`Preview of paper ${paper.date} ${paper.month} ${paper.year}`}
                className="border rounded-md mt-4 cursor-pointer"
                onClick={() => setSelectedPaper(paper)} // This will trigger the modal opening when the iframe is clicked
              />
            </div>

            <h3 className="text-xl font-semibold mb-2 cursor-pointer"  onClick={() => setSelectedPaper(paper)}>
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
          <div className="mt-8 p-4 border rounded-lg shadow-md bg-white">
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
