/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL('https://images-us.bookshop.org/ingram/**')],
  },
}

export default nextConfig
