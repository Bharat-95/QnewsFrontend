"use client";
import { useEffect, useState } from "react";

const PostViewCount = ({ postUrl }) => {
  const [viewCount, setViewCount] = useState(100);
  const [error, setError] = useState(null);

  const siteId = "101474780"; // Replace with your Clicky Site ID
  const siteKey = "d7ca9b452f12a411"; // Replace with your Clicky Site Key

  console.log("Base Post URL:", postUrl);

  useEffect(() => {
    if (!postUrl) {
      console.error("Invalid post URL");
      setError("Post URL is missing or invalid");
      return;
    }

    const fetchViewCount = async () => {
      try {
        // URLs for both languages
        const urlTe = `${postUrl}?language=te`;
        const urlEn = `${postUrl}?language=en`

        // Fetch view counts for both URLs
        const [responseTe, responseEn] = await Promise.all([
          fetch(
            `https://api.clicky.com/api/stats/4?site_id=${siteId}&sitekey=${siteKey}&type=pages&item=${encodeURIComponent(urlTe)}&date=this-month&output=json`
          ),
          fetch(
            `https://api.clicky.com/api/stats/4?site_id=${siteId}&sitekey=${siteKey}&type=pages&item=${encodeURIComponent(urlEn)}&date=this-months&output=json`
          ),


        ]);

        // Parse and validate JSON responses
        const dataTe = responseTe.ok ? await responseTe.json() : null;
        const dataEn = responseEn.ok ? await responseEn.json() : null;


        console.log("DataTe:", dataTe);
        console.log("DataEn", dataEn);
    

        // Extract and combine the view counts
         const viewCountTe = parseInt(dataTe?.[0]?.dates?.[0]?.items?.[0]?.value || 0);
         const viewCountEn =parseInt(dataEn?.[0]?.dates?.[0]?.items?.[0]?.value || 0);

         const combinedView = viewCountTe + viewCountEn;


    
        
        setViewCount(combinedView);
      } catch (error) {
        console.error("Error fetching view count:", error);
        setError("Failed to fetch view counts");
      }
    };

    fetchViewCount();
  }, [postUrl]);

  return (
    <div>
      {error ? (
        <h4>Error: {error}</h4>
      ) : viewCount !== null ? (
        <h4>Views: {viewCount}</h4>
      ) : (
        <h4>Loading views...</h4>
      )}
    </div>
  );
};

export default PostViewCount;
