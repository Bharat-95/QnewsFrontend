"use client";
import React, { useState } from 'react';

const GreetingUploader = () => {
  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (mediaType === 'video') {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.duration > 30) {
          alert('Video must be 30 seconds or less.');
          e.target.value = '';
          return;
        }
        setFile(selectedFile);
      };
      video.src = URL.createObjectURL(selectedFile);
    } else {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !mediaType || !title) {
      alert('Please fill all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('mediaType', mediaType);
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await fetch('/api/newsEn/greetings/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('Greeting uploaded successfully!');
        console.log(data);
        setTitle('');
        setMediaType('');
        setFile(null);
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="flex flex-col space-y-4 justify-center items-center min-h-screen p-4"
    >
      <h2 className="text-xl font-semibold">Upload Greeting</h2>

      <input
        type="text"
        placeholder="Greeting Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border px-4 py-2 rounded w-64"
      />

      <select
        value={mediaType}
        onChange={(e) => setMediaType(e.target.value)}
        required
        className="border px-4 py-2 rounded w-64"
      >
        <option value="">Select Media Type</option>
        <option value="image">Image (JPG, PNG, PDF)</option>
        <option value="video">Video (MP4, MOV ≤ 30s)</option>
      </select>

      <input
        type="file"
        accept={
          mediaType === 'image'
            ? '.jpg,.jpeg,.png,.pdf'
            : '.mp4,.mov'
        }
        onChange={handleFileChange}
        required
        className="w-64"
      />

      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {uploading ? 'Uploading...' : 'Upload Greeting'}
      </button>
    </form>
  );
};

export default GreetingUploader;
