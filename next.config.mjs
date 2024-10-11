/** @type {import('next').NextConfig} */
import NextFederationPlugin from "@module-federation/nextjs-mf";
// const { createSharedDependencies } = require("./@core/configs/nextConfigUtil");
import createMDX from "@next/mdx";

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
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};
const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
