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
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // Add this line for YouTube image domain
        pathname: '/vi/**', // This is the path pattern for YouTube thumbnails
      },
    ],
  },
};

export default nextConfig;
