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
        <Link href='https://docs.google.com/forms/d/e/1FAIpQLSe7SEyuWDb83CzHAoyzWfr3F6wJIluuR6t2YRIEt4g8rexxZQ/viewform' target='_blank'> <Image 
          src="/BC2.jpg" 
          alt="No Image Found" 
          width={1000} 
          height={1000} 
          className="w-full"
        />
        </Link>
      </div>
    </div>
  )
}

export default Survey
