
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
      // Removed API Ninjas specific domains as image feature is removed
      // {
      //   protocol: 'https',
      //   hostname: 't*.ftcdn.net', 
      //   port: '',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'c8.alamy.com',
      //   port: '',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'www.shutterstock.com',
      //   port: '',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'thumbs.dreamstime.com',
      //   port: '',
      //   pathname: '/**',
      // },
      //  {
      //   protocol: 'https',
      //   hostname: 'api.api-ninjas.com', 
      //   port: '',
      //   pathname: '/**',
      // }
    ],
  },
};

export default nextConfig;
