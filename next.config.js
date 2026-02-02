const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs'],
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = withNextIntl(nextConfig);