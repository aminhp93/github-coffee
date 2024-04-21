/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: {
    context: {
      isServer: false,
    },
  },
};

export default nextConfig;
