"use client"
import React from 'react'
import { useLanguage } from '@/context/languagecontext'

const Page = () => {
    const{translations} = useLanguage(); 
  return (
    <div className="min-h-screen lg:mx-[10%] mx-4 my-6 md:my-8 lg:my-10">
        <div className='flex text-[24px] py-4'>{translations.advertise}:</div>
        
        <div className="contact-details text-lg text-gray-800 space-y-4">
          <p>
           {translations.advertiseText1}
          </p>
          <p>
           {translations.advertiseText2}
          </p>

          <p className="font-semibold">{translations.email}</p>
          <p>
            <a href="mailto:advertise@yourwebsite.com" className="text-orange-600 hover:underline">
              qnewsads@gmail.com
            </a>
          </p>

          <p className="font-semibold">{translations.social}</p>
          <p>
          <a href="https://instagram.com/yourwebsite" target="_blank" className="text-orange-600 hover:underline">
              {translations.youtube}
            </a>{" | "}
            <a href="https://twitter.com/yourwebsite" target="_blank" className="text-orange-600 hover:underline">
              {translations.twitter}
            </a>{" | "}
            <a href="https://facebook.com/yourwebsite" target="_blank" className="text-orange-600 hover:underline">
              {translations.facebook}
            </a>{" | "}
            <a href="https://instagram.com/yourwebsite" target="_blank" className="text-orange-600 hover:underline">
              {translations.instagram}
            </a>
          </p>
        </div>
    </div>
  )
}

export default Page