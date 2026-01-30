interface Env {
  sanityProjectId: string;
  sanityDataset: string;
  sanityToken?: string;
  baseUrl: string;
  mediumUrl: string;
  rssApiUrl: string;
  isMockApi?: boolean;
  googleAnalytics?: string;
  googleSiteVerification?: string;
}

const envConfig: Env = {
  sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  sanityToken: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  mediumUrl: process.env.NEXT_PUBLIC_MEDIUM_URL!,
  rssApiUrl: process.env.NEXT_PUBLIC_RSS_API_URL!,
  // optional
  isMockApi: process.env.NEXT_PUBLIC_MOCK_API === "true" || false,
  googleAnalytics: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
};

const requiredTokens: (keyof Env)[] = [
  "sanityProjectId",
  "sanityDataset",
  "baseUrl",
  "mediumUrl",
  "rssApiUrl",
];

for (const key of requiredTokens) {
  if (!envConfig[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export default envConfig;
