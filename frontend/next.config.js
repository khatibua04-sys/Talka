/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Optimize for Vercel deployment
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
