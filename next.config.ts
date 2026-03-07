import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import blogRedirects from "./redirects/blog-redirects.json";

const withNextIntl = createNextIntlPlugin("./app/utils/i18n.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return blogRedirects
      .filter((r) => r.new && r.new !== r.old)
      .map((r) => ({
        source: `/blog/${r.old}`,
        destination: `/blog/${r.new}`,
        permanent: true,
      }));
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    minimumCacheTTL: 60,
  },
  // Note: Cross-origin warnings from local network IPs (e.g., 192.168.1.12) in development
  // are expected when running Playwright tests. These warnings are informational
  // and don't affect functionality. Next.js may add allowedDevOrigins in a future version.
  webpack: (config, { isServer }) => {
    if (isServer) {
      // next server build => ignore msw/browser
      if (Array.isArray(config.resolve.alias)) {
        // in Next the type is always object, so this branch isn't necessary. But to keep TS happy, avoid @ts-ignore and prevent possible future breaking changes it's good to have it
        config.resolve.alias.push({ name: "msw/browser", alias: false });
      } else {
        config.resolve.alias["msw/browser"] = false;
      }
    } else {
      // browser => ignore msw/node
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias.push({ name: "msw/node", alias: false });
      } else {
        config.resolve.alias["msw/node"] = false;
      }
    }

    // Handle SVG files
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            typescript: true,
            ext: "tsx",
          },
        },
      ],
    });

    return config;
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default withNextIntl(nextConfig);
