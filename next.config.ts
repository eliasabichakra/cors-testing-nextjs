import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',  // Ensures static export
  basePath: '/cors-testing-nextjs', // Subpath for routing
  assetPrefix: '/cors-testing-nextjs', // Correctly prefix static assets
};

export default nextConfig;
