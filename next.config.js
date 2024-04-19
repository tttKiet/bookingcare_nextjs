/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: false, // Disable source maps in development
  optimizeFonts: false, // Disable font optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "bookingcare-clound.s3.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "cdn.bookingcare.vn",
      },
    ],
  },
  experimental: {
    // …
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
};

module.exports = nextConfig;
