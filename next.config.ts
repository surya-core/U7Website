import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This tells Next.js to keep the heavy database and encryption binaries outside the page bundle
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
};

export default nextConfig;
