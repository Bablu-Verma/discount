import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["i.imgur.com", 'res.cloudinary.com','cdn-icons-png.flaticon.com'], 
  },
};

export default nextConfig;
