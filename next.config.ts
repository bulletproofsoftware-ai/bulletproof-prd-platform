import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-right",
  },
  allowedDevOrigins: ["127.0.0.1", "localhost", "prd.bulletproofsoftware.tech"],
};

export default nextConfig;
