/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 13+
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  // Ensure CSS is included in build
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
