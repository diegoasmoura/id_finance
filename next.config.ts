import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
