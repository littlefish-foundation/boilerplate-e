/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['littlefish-nft-auth-framework'],
  experimental: {
    esmExternals: 'loose'
  }
};

export default nextConfig;
