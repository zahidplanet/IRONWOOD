/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Don't use static export for development
  // output: 'export',
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig 