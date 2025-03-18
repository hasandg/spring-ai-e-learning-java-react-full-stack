/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable static exports if needed
  // output: 'export',
  
  // Optimize images
  images: {
    domains: ['localhost', 'yourdomain.com', 'cdn.yourdomain.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },

  // Optimize fonts
  optimizeFonts: true,

  // Enable compression
  compress: true,

  // Configure headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Configure webpack
  webpack: (config, { dev, isServer }) => {
    // Add build-time environment variables
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
      })
    );

    return config;
  },

  // Enable experimental features
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    scrollRestoration: true, // Enable scroll restoration
  },

  // Configure build output
  poweredByHeader: false,
  generateEtags: true,

  // Configure redirects
  async redirects() {
    return [
      // Add your redirects here
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },

  // Configure rewrites
  async rewrites() {
    return [
      // Add your rewrites here
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },

  env: {
    API_URL: process.env.API_URL || 'http://localhost:8080',
    AUTH_API_URL: process.env.AUTH_API_URL || 'http://localhost:8081',
    USER_API_URL: process.env.USER_API_URL || 'http://localhost:8082',
    COURSE_API_URL: process.env.COURSE_API_URL || 'http://localhost:8083',
    VIDEO_API_URL: process.env.VIDEO_API_URL || 'http://localhost:8084',
  },
}

module.exports = nextConfig 