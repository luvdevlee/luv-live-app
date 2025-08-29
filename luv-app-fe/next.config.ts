import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vi.wowkorea.live',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
