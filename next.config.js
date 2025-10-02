/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 13+
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
}

module.exports = nextConfig
