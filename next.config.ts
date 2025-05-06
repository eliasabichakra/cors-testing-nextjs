import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Ensures static export
  basePath: '/cors-testing-nextjs', // Set this to the repository name or subpath
  assetPrefix: '/cors-testing-nextjs', // Ensure static assets are prefixed correctly
};

export default nextConfig;
