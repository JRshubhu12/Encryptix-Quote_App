
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // Domains for API Ninjas Image Search results (examples, may need more)
      {
        protocol: 'https',
        hostname: 't*.ftcdn.net', // Matches t0.ftcdn.net, t1.ftcdn.net, etc.
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'c8.alamy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'thumbs.dreamstime.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'api.api-ninjas.com', // If they ever proxy images
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
