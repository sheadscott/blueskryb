/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images-us.bookshop.org',
        pathname: '/ingram/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.bsky.app',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
