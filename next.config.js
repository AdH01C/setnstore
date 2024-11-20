/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Lint CI should catch the issues.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  output: "standalone",
  transpilePackages: ["@inquisico/ruleset-editor-api"],
};

module.exports = nextConfig;
