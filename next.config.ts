import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "node:https": { browser: "./src/shared/api/browser-https.ts" },
    },
  },
  webpack(config, { isServer, webpack }) {
    if (!isServer) {
      config.plugins.push(new webpack.NormalModuleReplacementPlugin(
        /^node:https$/,
        resolve(process.cwd(), "src/shared/api/browser-https.ts"),
      ));
    }
    return config;
  },
  images: {
    deviceSizes: [640, 750, 828, 896, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 576],
    qualities: [60, 75],
  },
};

export default nextConfig;
