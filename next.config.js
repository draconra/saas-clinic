/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs'],
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
}

module.exports = nextConfig