"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Correct import for dynamic params
import axios from "axios";

const PaperDetailPage = () => {
  const { paperId } = useParams(); // Get paperId from URL parameters
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paperId) {
      // Fetch paper details using the paperId
      const fetchPaper = async () => {
        try {
          const response = await axios.get(`https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/paper/${paperId}`);
          const responseData = response.data;
          
          setPaper(responseData.data); // Assuming data is the paper object
          setLoading(false);
        } catch (error) {
          console.error("Error fetching paper details:", error);
          setLoading(false);
        }
      };
      fetchPaper();
    }
  }, [paperId]);

  if (loading) {
    return <div className="text-center text-xl">Loading paper...</div>;
  }

  if (!paper) {
    return <div className="text-center text-xl">Paper not found</div>;
  }

  return (
    <div className="container mx-auto mb-10  p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {paper.date} {paper.month} {paper.year}
      </h1>
      
      <div className="text-center">
        <iframe
          src={paper.fileUrl}
          width="100%"
          height="600"
          title="PDF Viewer"
          className="border rounded-md w-[100%] h-screen"
        />
      </div>
    </div>
  );
};

export default PaperDetailPage;
