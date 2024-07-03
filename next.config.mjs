/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
      styledComponents: true,
    },
    images: {
        domains: ['ipfs.io'],
      },
    experimental: {
      // This will allow Next.js to ignore the Grammarly attributes during hydration
      runtime: 'nodejs',
    },
  };
  
  export default nextConfig;

