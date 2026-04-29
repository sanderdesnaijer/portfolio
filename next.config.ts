import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import blogRedirects from "./redirects/blog-redirects.json";

const withNextIntl = createNextIntlPlugin("./app/utils/i18n.ts");

const isDev = process.env.NODE_ENV === "development";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}https://www.googletagmanager.com https://www.google-analytics.com https://www.youtube.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://cdn.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com;
  font-src 'self';
  frame-src https://www.youtube.com https://youtube.com https://demos.sanderdesnaijer.com;
  connect-src 'self' https://*.sanity.io https://cdn.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://analytics.google.com;
  media-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`;

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      'camera=(self "https://demos.sanderdesnaijer.com"), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/((?!studio).*)",
        headers: securityHeaders,
      },
      {
        source: "/studio/:path*",
        headers: securityHeaders.filter(
          (h) => h.key !== "Content-Security-Policy"
        ),
      },
    ];
  },
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
