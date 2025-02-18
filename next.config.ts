import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    domains: ['lh3.googleusercontent.com'], 
  },
};

export default nextConfig;
