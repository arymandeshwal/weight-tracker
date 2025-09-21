import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const pwa = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // 'register: true' is a valid option.
  register: true, 
  // 'skipWaiting: true' is not a valid top-level option, so we remove it.
});

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: false, 
  },
};

export default pwa(nextConfig);