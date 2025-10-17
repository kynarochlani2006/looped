import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Ensure Turbopack picks this project as the workspace root
    root: __dirname,
  },
  env: {
    NEXT_PUBLIC_SERVER_URL: "http://localhost:4000",
  },
};

export default nextConfig;
