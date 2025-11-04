/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@fidus/shared', '@fidus/ui'],
}

module.exports = nextConfig
