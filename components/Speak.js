import React, { useState } from "react";
import axios from "axios";

const Header = ({ newsText }) => {
  const [language, setLanguage] = useState("en-US"); // Default to English
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en-US" ? "te-IN" : "en-US"));
  };

  const speakText = async () => {
    if (isSpeaking) return;

    setIsSpeaking(true);
    const apiKey = "YOUR_GOOGLE_API_KEY"; // Replace with your API key
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const data = {
      input: { text: newsText },
      voice: {
        languageCode: language,
        ssmlGender: "NEUTRAL",
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    };

    try {
      const response = await axios.post(url, data);
      const audioContent = response.data.audioContent;

      // Convert the base64 audio to a playable format
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audio.play();

      audio.onended = () => setIsSpeaking(false);
    } catch (error) {
      console.error("Error synthesizing speech:", error);
      setIsSpeaking(false);
    }
  };

  return (
    <header>
      <button onClick={toggleLanguage}>
        Switch to {language === "en-US" ? "Telugu" : "English"}
      </button>
      <button onClick={speakText} disabled={isSpeaking}>
        {isSpeaking ? "Speaking..." : "Read News"}
      </button>
    </header>
  );
};

export default Header;
