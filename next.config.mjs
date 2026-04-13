import { createRequire } from "module";

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "api.builder.io" }],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: ${process.env.API_URL || "https://blynk-backend-aaek.onrender.com/api"}/:path*,
      },
    ];
  },
};
export default nextConfig;
