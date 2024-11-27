import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    basePath: 'https://github.com/wdevarshi/portfolio',
    assetPrefix: '/portfolio/',
};
module.exports = nextConfig
export default nextConfig;
