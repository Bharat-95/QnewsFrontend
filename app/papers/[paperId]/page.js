"use client";

import React, { useEffect, useState } from "react";

const PaperDetailsPage = ({ params }) => {
  const [paperId, setPaperId] = useState(null); // Store the unwrapped paperId
  const [paper, setPaper] = useState(null); // Store the fetched paper data

  // Unwrap params.paperId using React.use() or a similar approach
  useEffect(() => {
    (async () => {
      const unwrappedParams = await params; // Unwrap params
      setPaperId(unwrappedParams.paperId);
    })();
  }, [params]);

  useEffect(() => {
    if (paperId) {
      // Fetch paper details from your API
      const fetchPaperDetails = async () => {
        try {
          const response = await fetch(
            `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/paper/${paperId}`
          );
          const data = await response.json();
          setPaper(data);
        } catch (error) {
          console.log("Error fetching paper details:", error);
        }
      };
      fetchPaperDetails();
    }
  }, [paperId]);

  if (!paper) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {paper.title || "Paper Details"}
      </h1>
      <iframe
        src={paper.fileUrl}
        width="100%"
        height="600"
        title="Paper Viewer"
        className="border rounded-md"
      />
      <div className="mt-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          onClick={() => history.back()} // Navigate back to the previous page
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default PaperDetailsPage;
