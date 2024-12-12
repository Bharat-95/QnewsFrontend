import { useState } from 'react';

const Speak = ({ newsData, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState(null);

  const handleReadClick = async () => {
    try {
      setIsPlaying(!isPlaying);

      const text = language === 'te' ? newsData.headlineTe : newsData.headlineEn;
      const languageCode = language === 'te' ? 'te-IN' : 'en-IN';
      const voiceType = language === 'te' ? 'te-IN-Wavenet-A' : 'en-IN-Wavenet-D';

      const res = await fetch(
        `/api/text-to-speech?text=${encodeURIComponent(text)}&languageCode=${languageCode}&voiceType=${voiceType}`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch audio.');
      }

      const data = await res.json();
      setAudioUrl(data.audioUrl);

      const audio = new Audio(data.audioUrl);
      audio.play();
      audio.onended = () => setIsPlaying(false);
    } catch (err) {
      console.error('Error fetching audio:', err);
      setError('Failed to play audio. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={handleReadClick}>
        {isPlaying ? 'Pause' : 'Read News'}
      </button>
      {audioUrl && <audio src={audioUrl} controls autoPlay />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Speak;
