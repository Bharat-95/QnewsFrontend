import React from 'react';
import HeroHome from '@/components/HeroHome';
import Latest from '@/components/Latest';
import Youtube from '@/components/Youtube';
import Trending from '@/components/Trending';
import Politics from '@/components/Political'
import Live from '@/components/Live';

const Page = () => {
  return (
    <div className="lg:p-[32px] md:p-[20px] p-[10px] space-y-[32px]">
      <HeroHome />
      <Live />
      <div className="flex justify-between gap-4">
        <div className="lg:w-[70%] md:w-[100%] w-[100%]">
          <Latest />
          <Youtube />
          <Politics />
        </div>
        <div className="w-[30%] lg:flex md:hidden hidden ">
          <Trending />
        </div>
      </div>
    </div>
  );
};

export default Page;
