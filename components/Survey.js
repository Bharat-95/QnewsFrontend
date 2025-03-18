"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useLanguage } from "@/context/languagecontext";

const Survey = () => {
     const { language, translations } = useLanguage();
  return (
    <div className="">
      <div className="w-full relative"> 
        {/* Image */}
        <Image 
          src="/BC.png" 
          alt="No Image Found" 
          width={1000} 
          height={1000} 
          className="w-full"
        />
        
        {/* Button Positioned on Image */}
        <Link href='https://docs.google.com/forms/d/e/1FAIpQLSe7SEyuWDb83CzHAoyzWfr3F6wJIluuR6t2YRIEt4g8rexxZQ/viewform' target='_blank' className="absolute top-[70%] lg:left-[50%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white lg:px-4 p-1 lg:py-2 rounded-lg text-[10px] lg:text-[16px] shadow-lg font-bold">
          {translations.participate}
        </Link>
      </div>
    </div>
  )
}

export default Survey
