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
          src="/BC1.jpg" 
          alt="No Image Found" 
          width={1000} 
          height={1000} 
          className="w-full"
        />
        
        {/* Button Positioned on Image */}
        <Link href='https://docs.google.com/forms/d/e/1FAIpQLSe7SEyuWDb83CzHAoyzWfr3F6wJIluuR6t2YRIEt4g8rexxZQ/viewform' target='_blank' className="flex justify-center absolute lg:top-[80%] top-[80%] lg:left-[45%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-green-900 text-white lg:px-4 p-1 lg:py-2 lg:rounded-lg rounded-md text-[10px] lg:text-[20px] shadow-lg font-bold w-[30%] lg:w-[40%]">
          {translations.participate}
        </Link>
      </div>
    </div>
  )
}

export default Survey
