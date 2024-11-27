/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    basePath: '',
    assetPrefix: '',
    trailingSlash: true,
    distDir: 'out'
}

module.exports = nextConfig