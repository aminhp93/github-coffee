/** @type {import('next').NextConfig} */
const NextFederationPlugin = require("@module-federation/nextjs-mf");
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
  modularizeImports: {
    "@mui/icons-material/?(((\\w*)?/?)*)": {
      transform: "@mui/icons-material/{{ matches.[1] }}/{{member}}",
    },
  },
  experimental: {
    esmExternals: "loose",
  },
};

module.exports = nextConfig;
