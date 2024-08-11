/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        unoptimized: true,
        domains: ['localhost', 'sparkwave.onrender.com']
    },
};

export default nextConfig;
