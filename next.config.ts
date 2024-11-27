/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    // Remove basePath and assetPrefix for custom domain
    basePath: '',
    assetPrefix: '',
    distDir: 'out'
}

module.exports = nextConfig