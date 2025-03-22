/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable static export for production builds
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Set trailingSlash to true for better support in static exports
  trailingSlash: true,
  // Ensure output directory is clean before export
  distDir: 'out',
}

module.exports = nextConfig 