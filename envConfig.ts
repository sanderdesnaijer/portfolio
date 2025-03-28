interface Env {
  sanityProjectId: string;
  sanityDataset: string;
  baseUrl: string;
  mediumUrl: string;
  rssApiUrl: string;
  isMockApi?: boolean;
}

const envConfig: Env = {
  sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  mediumUrl: process.env.NEXT_PUBLIC_MEDIUM_URL!,
  rssApiUrl: process.env.NEXT_PUBLIC_RSS_API_URL!,
  // optional
  isMockApi: process.env.NEXT_PUBLIC_MOCK_API === "true" || false,
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
