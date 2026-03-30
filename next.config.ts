import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias.canvas = false;
    }
    return config;
  },
  // @ts-ignore - Turbopack config for Next.js 16
  turbopack: {
    resolveAlias: {
      canvas: './mock-canvas.js',
    },
  },
};

export default nextConfig;
