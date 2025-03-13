import "server-only";

import type { QueryParams } from "@sanity/client";
import { draftMode } from "next/headers";
import { client } from "@/sanity/lib/client";
import { REVALIDATE_INTERVAL } from "@/app/utils/constants";

const DEFAULT_PARAMS = {} as QueryParams;
const DEFAULT_TAGS = [] as string[];

export const token = process.env.SANITY_API_READ_TOKEN;

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<QueryResponse> {
  const currentDraftMode = await draftMode();
  const isDraftMode = currentDraftMode.isEnabled;
  const queryParams = await params;

  if (isDraftMode && !token) {
    throw new Error(
      "The `SANITY_API_READ_TOKEN` environment variable is required."
    );
  }
  const isDevelopment = process.env.NODE_ENV === "development";

  return client
    .withConfig({
      useCdn: isDevelopment,
    })
    .fetch<QueryResponse>(query, queryParams, {
      cache: isDevelopment || isDraftMode ? undefined : "force-cache",
      // cache: isDevelopment || isDraftMode ? undefined : "no-store",
      ...(isDraftMode && {
        token,
        perspective: "previewDrafts",
      }),
      next: {
        revalidate:
          isDevelopment || isDraftMode ? undefined : REVALIDATE_INTERVAL,
        tags,
      },
    });
}
