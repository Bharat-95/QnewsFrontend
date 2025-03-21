"use client";
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useLanguage } from "@/context/languagecontext";

const Survey = () => {
  const { language, translations } = useLanguage();

  // WhatsApp share function
  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      "Check out this survey! Visit www.qgroupmedia.com"
    );
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  // General share function (Web Share API)
  const handleShare = async () => {
    const shareData = {
      title: 'Survey',
      text: 'Check out this survey!',
      url: 'https://www.qgroupmedia.com',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        alert('Content shared successfully!');
      } catch (err) {
        alert('Error sharing content: ' + err.message);
      }
    } else {
      alert('Sharing is not supported on your device');
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        {/* Image */}
        <div>
          <Image 
            src="/BC1.jpg" 
            alt="No Image Found" 
            width={1000} 
            height={1000} 
            className="w-full object-cover"
          />
        </div>

        {/* Blinking Telugu Text */}
        <Link 
          href='https://docs.google.com/forms/d/e/1FAIpQLSe7SEyuWDb83CzHAoyzWfr3F6wJIluuR6t2YRIEt4g8rexxZQ/viewform' 
          target='_blank' 
          className="absolute lg:bottom-5 bottom-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm md:text-2xl lg:text-3xl animate-blink bg-green-900 bg-opacity-60 px-4 py-2 rounded-md text-center"
        >
          పలుగొనడానికి ఇక్కడ క్లిక్ చేయండి
        </Link>
      </div>
    </div>
  );
}

export default Survey;
