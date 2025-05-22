/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images-us.bookshop.org',
        pathname: '/ingram/**',
      },
    ],
  },
}

export default nextConfig
