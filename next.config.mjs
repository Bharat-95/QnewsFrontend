/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qnewsimages.s3.ap-south-1.amazonaws.com',
        pathname: '/news-images/**',
      },
      {
        protocol: 'https',
        hostname: 'qnewsimages.s3.ap-south-1.amazonaws.com',
        pathname: '/video-images/**',
      },
      {
        protocol: 'https',
        hostname: 'qnewsimages.s3.ap-south-1.amazonaws.com',
        pathname: '/papers/**',
      },
    ],
  },
};

export default nextConfig;
