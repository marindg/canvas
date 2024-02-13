/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      }, // {protocol: "https", host: "images.unsplash.com", path: "/.*"
    ],
  },
};

export default nextConfig;
