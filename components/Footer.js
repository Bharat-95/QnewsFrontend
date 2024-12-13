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
    <div className=' bg-orange-200 text-black px-20 py-4 space-y-6'>
       <div className='h-[100%] lg:flex md:flex justify-between gap-10 lg:space-y-0 md:space-y-0 space-y-4'>
        <div className='flex justify-center items-center gap-10 '>
            <Image
            src={Logo}
            alt='No Logo Found'
            width={100}
            height={100}
            className='w-[50px] md:w-[80px] lg:w-[70px]' />
             <div className='flex flex-col items-center space-y-4'>
            <div className='lg:text-[20px] md:text-[20px] text-[14px] text-gray-600  font-extralight underline-offset-2'>{translations.followus} </div>
            <div className='flex gap-2'>
                <Link href='https://www.instagram.com/qgroupmedia7200/' target='_blank' className='lg:hover:translate-x-[1px] lg:hover:-translate-y-[1px]  '><FaInstagram size={30} /></Link>
                <Link href='https://x.com/QGroupMedia'  className='lg:hover:translate-x-[1px] lg:hover:-translate-y-[1px]' target='_blank'><FaXTwitter size={30} /></Link>
                <Link href='https://www.youtube.com/@TeenmaarMallannaOfficial' target='_blank'  className='lg:hover:translate-x-[1px] lg:hover:-translate-y-[1px]  '><CiYoutube  size={30}/></Link>
                <Link href='https://www.facebook.com/QNewsMallanna' target='_blank'  className='lg:hover:translate-x-[1px] lg:hover:-translate-y-[1px]  '><FaFacebookF size={30}/></Link>

            </div>
        </div>
        </div>
        <div className='flex flex-wrap justify-center items-center lg:gap-20 gap-4'>
        <div className='font-light hover:text-orange-400 lg:text-[14px] md:text-[12px] text-[14px]'><Link href='/advertise'>{translations.advertise}</Link></div>
            <div className='font-light hover:text-orange-400 lg:text-[14px] md:text-[12px] text-[14px]'><Link href='/terms'>{translations.termsNconditions}</Link></div>
            <div className='font-light hover:text-orange-400 lg:text-[14px] md:text-[12px] text-[14px]'><Link href='/privacy'>{translations.privacy}</Link></div>
            <div className='font-light hover:text-orange-400 lg:text-[14px] md:text-[12px] text-[14px]'><Link href='/help'>{translations.helpNsupport}</Link></div>
        </div>
       <div>
       </div>

       </div>
       <div className='font-extralight flex flex-wrap justify-center lg:gap-10 gap-2'>

       <div className='lg:flex lg:items-center lg:justify-center text-[10px] md:text-[16px]'>© copyright <Link href='/'>Q Group Media. </Link> All Rights Reserved</div>
       <div className='lg:flex lg:items-center lg:justify-center text-[10px] md:text-[16px]'>Built by: <Link href='https://www.nandak.co'>Nandak Innovations Private Limited</Link></div>
       </div>

    </div>
  )
}

export default Footer