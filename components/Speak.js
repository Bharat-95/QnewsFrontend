"use client"
import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { PiSpeakerSimpleSlash } from "react-icons/pi";
import { PiSpeakerSimpleHighLight } from "react-icons/pi";

const Speak = ({ newsText, language }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null); // Ref to store the audio object

  const cleanText = (text) => {
    // Replace periods (.) with SSML break tag to insert a pause.
    const cleanedText = text
      .replace(/[^\w\s\u0C00-\u0C7F.]/g, "") // Only allow valid characters and period
      .replace(/\./g, '<break time="100ms"/>') // Add a pause for each period
      .replace(/\s+/g, " ") // Remove extra spaces
      .trim();
    return cleanedText;
  };

  const stopText = () => {
    console.log("stopText function called");

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false); // Update state immediately to stop
      console.log("clicked on Stop");
    }
  };

  const speakText = useCallback(async () => {
    console.log("speakText function called");

    if (isSpeaking) {
      console.log("click on speak");
      stopText(); // If already speaking, stop it
      return;
    }

    setIsSpeaking(true); // Set state to indicate speaking has started
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // Ensure this is correct in .env
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const ssmlText = `<speak>${cleanText(newsText)}</speak>`;

    const data = {
      input: { ssml: ssmlText },
      voice: {
        languageCode: language, // Dynamically set the language (te-IN or en-IN)
        ssmlGender: "MALE",  // Change to "MALE" or "FEMALE" if needed
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    };

    try {
      const response = await axios.post(url, data);
      const audioContent = response.data.audioContent;

      // Convert the base64 audio to a playable format
      const newAudio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audioRef.current = newAudio; // Store the audio reference in the ref

      // Play the audio
      newAudio.play();

      newAudio.onended = () => {
        setIsSpeaking(false); // Update state when audio ends
      };
    } catch (error) {
      console.log("Error synthesizing speech:", error);
      setIsSpeaking(false); // Ensure state is updated on error
    }
  }, [isSpeaking, newsText, language]); // Added isSpeaking, newsText, and language as dependencies

  // Stop audio when the component is unmounted
  useEffect(() => {
    return () => {
      stopText(); // Clean up by stopping the audio if component unmounts
    };
  }, []); // Empty dependency array to only run on unmount

  return (
    <div>
      <div disabled={isSpeaking}>
        {isSpeaking ? (
          <PiSpeakerSimpleSlash size={24} color="red" onClick={stopText} /> // Stop icon when speaking
        ) : (
          <PiSpeakerSimpleHighLight size={24} color="green" onClick={speakText} /> // Play icon when not speaking
        )}
      </div>
    </div>
  );
};

export default Speak;
