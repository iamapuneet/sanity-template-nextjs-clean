/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/**')],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
