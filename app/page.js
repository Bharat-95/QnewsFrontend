import React from 'react';
import HeroHome from '@/components/HeroHome';
import Latest from '@/components/Latest';
import Youtube from '@/components/Youtube';
import Trending from '@/components/Trending';
import Politics from '@/components/Political';
import Hyderabad from '@/components/Hyderabad';
import Telangana from '@/components/Telangana';
import India from '@/components/India';
import World from '@/components/World';
import Business from '@/components/Business';
import Health from '@/components/Health';
import Sports from '@/components/Sports';
import Film from '@/components/Film';
import Others from '@/components/Others';

const Page = () => {
  return (
    <div className="lg:p-[32px] md:p-[20px] p-[10px] space-y-[32px]">
      {/* AdSense Ad */}
      <div className="w-screen mb-[10px]">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-5147970592590624"
          data-ad-slot="7547677944"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>
          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </script>
      </div>

      {/* Hero Section */}
      <HeroHome />

      {/* Main Content */}
      <div className="flex justify-between gap-4">
        <div className="lg:w-[70%] md:w-[100%] w-[100%]">
          <Youtube />
          <Politics />
          <Hyderabad />
          <Telangana />
          <India />
          <World />
          <Business />
          <Sports />
          <Film />
          <Others />
        </div>
        <div className="w-[30%] lg:flex md:hidden hidden">
          <Trending />
        </div>
      </div>
    </div>
  );
};

export default Page;
