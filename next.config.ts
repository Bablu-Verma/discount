import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["i.imgur.com", 'res.cloudinary.com'], 
  },
};

export default nextConfig;
