/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "bookingcare-clound.s3.amazonaws.com"],
  },
};

module.exports = nextConfig;
