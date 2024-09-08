/** @type {import('next').NextConfig} */
import NextFederationPlugin from "@module-federation/nextjs-mf";
// const { createSharedDependencies } = require("./@core/configs/nextConfigUtil");

const nextConfig = {
  // reactStrictMode: true,
  webpack: (config) => {
    if (config?.plugins) {
      config.plugins.push(
        new NextFederationPlugin({
          name: "home",
          filename: "static/chunks/remoteEntry.js",
          remotes: {},
          exposes: {
            "./index": "./pages/index.tsx",
          },
          // shared: createSharedDependencies(),
        })
      );
    }

    return config;
  },
  eslint: {
    dirs: ["."], //or ['pages', 'hooks']
  },
};

export default nextConfig;
