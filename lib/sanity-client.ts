import { createClient } from "@sanity/client";

// Make Sanity client optional - only initialize if the required environment variables are available
let sanityClient: any = null;

if (process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET) {
  sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    apiVersion: "2024-03-13",
    useCdn: true,
  });
}

export { sanityClient };
