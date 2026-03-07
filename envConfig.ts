interface Env {
  sanityProjectId: string;
  sanityDataset: string;
  sanityToken?: string;
  baseUrl: string;
  isMockApi?: boolean;
  googleAnalytics?: string;
  googleSiteVerification?: string;
}

const envConfig: Env = {
  sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  sanityToken: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  isMockApi: process.env.NEXT_PUBLIC_MOCK_API === "true" || false,
  googleAnalytics: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
};

const requiredTokens: (keyof Env)[] = [
  "sanityProjectId",
  "sanityDataset",
  "baseUrl",
];

for (const key of requiredTokens) {
  if (!envConfig[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export default envConfig;
