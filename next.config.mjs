/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['littlefish-nft-auth-framework'],
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'perf_hooks': false
      };
    }
    return config;
  }
};

export default nextConfig;
