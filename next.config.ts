import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '**/*.glsl': {
          loaders: ['raw-loader'],
          as: '*.js',
        },
      },
    },
  },
  transpilePackages: ['three'],
  webpack: (config) => {
    config.experiments = { asyncWebAssembly: true }
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader'],
    })
    return config
  },
}

export default nextConfig
