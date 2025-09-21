import type { NextConfig } from "next";
// Corrected: Import from the new, maintained package
import withPWA from "@ducanh2912/next-pwa";

const pwa = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // You might want to add this to suppress a warning during the build process
  // as the old 'register' option is deprecated in the new version.
  register: true, 
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  experimental: {
    // Note: optimizeCss is deprecated in newer Next.js versions.
    // This might not be needed, but we'll leave it for now.
    optimizeCss: false, 
  },
};

export default pwa(nextConfig);