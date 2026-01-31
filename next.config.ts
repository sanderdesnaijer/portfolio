import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./app/utils/i18n.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
      },
    ],
    // Disable optimization to avoid 429 rate limit errors from Medium CDN
    // Medium CDN blocks/rate-limits server-side requests
    // Images from Sanity will still work fine without optimization
    unoptimized: process.env.NODE_ENV !== "production",
    // Set minimum cache duration for optimized images (in seconds)
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
