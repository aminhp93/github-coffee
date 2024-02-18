/** @type {import('next').NextConfig} */

// const withMDX = require("@next/mdx")();
import withMDX from "@next/mdx";

const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

export default withMDX(nextConfig);
