"use client"
import Image from 'next/image'
import React from 'react'
import Logo from '../public/Logo.png'
import Link from 'next/link'
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { CiYoutube } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";
import { useLanguage } from "../context/languagecontext";





const Footer = () => {
    const { language, translations } = useLanguage();

  return (
    <div className='lg:h-64 md:h-64 bg-orange-200 text-black p-4'>
       <div className='h-[100%] lg:grid-cols-4 md:grid md:grid-cols-4 lg:grid grid grid-cols-1 gap-10'>
        <div className='flex justify-center items-center lg:border-r-[1px] md:border-r-[1px] border-orange-400 '>
            <Image
            src={Logo}
            alt='No Logo Found'
            width={100}
            height={100} />
        </div>
        <div className='flex flex-col items-center lg:border-r-[1px] md:border-r-[1px] border-orange-400 space-y-4'>
            <div className='text-[24px]  font-semibold underline underline-offset-2'>{translations.address} :</div>
            <div>
            1-89/4, Raghavendra Nagar Colony,  Bhagya Nagar Colony, Boduppal, Hyderabad, Telangana 500092
            </div>
        </div>
        <div className='flex flex-col items-center lg:border-r-[1px] md:border-r-[1px] border-orange-400 space-y-4'>
            <div className='text-[24px]  font-semibold underline underline-offset-2'>{translations.helpNsupport} :</div>
            <div className='font-light hover:text-orange-400'><Link href='/terms'>{translations.termsNconditions}</Link></div>
            <div className='font-light hover:text-orange-400'><Link href='/privacy'>{translations.privacy}</Link></div>
            <div className='font-light hover:text-orange-400'><Link href='/help'>{translations.helpNsupport}</Link></div>
        </div>
        <div className='flex flex-col items-center space-y-4'>
            <div className='text-[24px]  font-semibold underline underline-offset-2'>{translations.social} :</div>
            <div className='flex gap-2'>
                <Link href='https://www.instagram.com/teenmarmallanna/?hl=en' target='_blank' className='lg:hover:translate-x-[1px] lg:hover:-translate-y-[1px]  '><FaInstagram size={30} /></Link>
                <Link href='/'  className='lg:hover:translate-x-[1px] lg:hover:-translate-y-[1px]' target='_blank'><FaXTwitter size={30} /></Link>
                <Link href='https://www.youtube.com/@TeenmaarMallannaOfficial' target='_blank'  className='lg:hover:translate-x-[1px] lg:hover:-translate-y-[1px]  '><CiYoutube  size={30}/></Link>
                <Link href='https://www.facebook.com/QNewsMallanna?modal=admin_todo_tou' target='_blank'  className='lg:hover:translate-x-[1px] lg:hover:-translate-y-[1px]  '><FaFacebookF size={30}/></Link>

            </div>
        </div>

       </div>

    </div>
  )
}

export default Footer