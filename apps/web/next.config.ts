import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    globalNotFound: true,
  },
  async redirects() {
    return [
      {
        source: "/skills/:path*",
        destination: "/en/skills/:path*",
        permanent: true,
      },
      {
        source: "/packs/:path*",
        destination: "/en/packs/:path*",
        permanent: true,
      },
      ...[
        "getting-started",
        "built-with-skills",
        "roadmap",
        "about",
        "contribute",
        "changelog",
      ].map((path) => ({
        source: `/${path}`,
        destination: `/en/${path}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
