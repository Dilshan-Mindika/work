import { sanityClient } from "@/lib/sanity-client";
import { createLogger } from "@/lib/utils/logger";
import { BlogArticle } from "@/types/blog";

const logger = createLogger({ component: "queries" });

/**
 * Sanitize input for GROQ queries to prevent injection attacks
 */
function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input: must be a non-empty string');
  }
  
  // Remove potentially dangerous characters
  const sanitized = input
    .replace(/[<>'"&]/g, '') // Remove HTML/XML characters
    .replace(/[;|&$`\\]/g, '') // Remove shell injection characters
    .replace(/[\r\n\t]/g, '') // Remove line breaks and tabs
    .trim();
  
  // Validate length
  if (sanitized.length === 0) {
    throw new Error('Invalid input: sanitized string is empty');
  }
  
  if (sanitized.length > 100) {
    throw new Error('Invalid input: string too long');
  }
  
  // Validate format (basic slug validation)
  if (!/^[a-zA-Z0-9-_]+$/.test(sanitized)) {
    throw new Error('Invalid input: contains invalid characters');
  }
  
  return sanitized;
}

/**
 * Validate and sanitize slug input
 */
function validateSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    throw new Error('Slug must be a non-empty string');
  }
  
  const sanitized = sanitizeInput(slug);
  
  // Additional slug-specific validation
  if (sanitized.length < 1 || sanitized.length > 50) {
    throw new Error('Slug must be between 1 and 50 characters');
  }
  
  return sanitized;
}

/**
 * Safe query execution with error handling
 */
async function executeQuery<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  try {
    if (!sanityClient) {
      logger.warn("Sanity client not configured");
      return null;
    }
    
    logger.debug("Executing GROQ query", { 
      query: query.substring(0, 100) + '...', 
      hasParams: !!params 
    });
    
    const result = await sanityClient.fetch(query, params || {});
    return result;
  } catch (error) {
    logger.error("GROQ query execution failed", error as Error, { query: query.substring(0, 100) });
    throw new Error(`Query execution failed: ${(error as Error).message}`);
  }
}

export async function getAllPosts(): Promise<BlogArticle[]> {
  try {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      "mainImage": mainImage.asset->url,
      "author": {
        "name": author->name,
        "image": author->image.asset->url
      },
      "categories": categories[]->title,
      summary,
      readingTime,
      isFeatured
    }`;

    return await executeQuery(query) || [];
  } catch (error) {
    logger.error("Failed to get all posts", error as Error);
    throw new Error(`Failed to retrieve posts: ${(error as Error).message}`);
  }
}

export async function getAllCategory(): Promise<Array<{ label: string; value: string }>> {
  try {
    const query = `*[_type == "category"]{
      "label": title,
      "value": slug.current 
    }`;

    return await executeQuery(query) || [];
  } catch (error) {
    logger.error("Failed to get all categories", error as Error);
    throw new Error(`Failed to retrieve categories: ${(error as Error).message}`);
  }
}

export async function getPostBySlug(slug: string): Promise<BlogArticle | null> {
  try {
    // Validate and sanitize the slug input
    const sanitizedSlug = validateSlug(slug);
    
    // Use parameterized query to prevent injection attacks
    const query = `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      "mainImage": mainImage.asset->url,
      "author": {
        "name": author->name,
        "image": author->image.asset->url
      },
      "categories": categories[]->title,
      summary,
      readingTime,
      isFeatured,
      content[],
      tags,
      seoTitle,
      seoDescription,
      "relatedPosts": relatedPosts[]. _ref
    }`;

    return await executeQuery(query, { slug: sanitizedSlug });
  } catch (error) {
    logger.error("Failed to get post by slug", error as Error, { slug });
    throw new Error(`Failed to retrieve post: ${(error as Error).message}`);
  }
}

/**
 * Get posts by category with parameterized query
 */
export async function getPostsByCategory(category: string) {
  try {
    const sanitizedCategory = validateSlug(category);
    
    const query = `*[_type == "post" && $category in categories[]->slug.current] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      "mainImage": mainImage.asset->url,
      "author": {
        "name": author->name,
        "image": author->image.asset->url
      },
      "categories": categories[]->title,
      summary,
      readingTime,
      isFeatured
    }`;

    return await executeQuery(query, { category: sanitizedCategory }) || [];
  } catch (error) {
    logger.error("Failed to get posts by category", error as Error, { category });
    throw new Error(`Failed to retrieve posts by category: ${(error as Error).message}`);
  }
}

/**
 * Get featured posts with safe query
 */
export async function getFeaturedPosts() {
  try {
    const query = `*[_type == "post" && isFeatured == true] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      "mainImage": mainImage.asset->url,
      "author": {
        "name": author->name,
        "image": author->image.asset->url
      },
      "categories": categories[]->title,
      summary,
      readingTime,
      isFeatured
    }`;

    return await executeQuery(query) || [];
  } catch (error) {
    logger.error("Failed to get featured posts", error as Error);
    throw new Error(`Failed to retrieve featured posts: ${(error as Error).message}`);
  }
}

/**
 * Search posts with parameterized query
 */
export async function searchPosts(searchTerm: string) {
  try {
    const sanitizedSearchTerm = sanitizeInput(searchTerm);
    
    const query = `*[_type == "post" && (title match $searchTerm || summary match $searchTerm || content[].children[].text match $searchTerm)] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      "mainImage": mainImage.asset->url,
      "author": {
        "name": author->name,
        "image": author->image.asset->url
      },
      "categories": categories[]->title,
      summary,
      readingTime,
      isFeatured
    }`;

    return await executeQuery(query, { searchTerm: `*${sanitizedSearchTerm}*` }) || [];
  } catch (error) {
    logger.error("Failed to search posts", error as Error, { searchTerm });
    throw new Error(`Failed to search posts: ${(error as Error).message}`);
  }
}

/**
 * Get related posts with parameterized query
 */
export async function getRelatedPosts(postId: string, limit: number = 3) {
  try {
    const sanitizedPostId = sanitizeInput(postId);
    
    if (limit < 1 || limit > 10) {
      throw new Error('Limit must be between 1 and 10');
    }
    
    const query = `*[_type == "post" && _id != $postId] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      "mainImage": mainImage.asset->url,
      "author": {
        "name": author->name,
        "image": author->image.asset->url
      },
      "categories": categories[]->title,
      summary,
      readingTime,
      isFeatured
    }`;

    return await executeQuery(query, { postId: sanitizedPostId, limit }) || [];
  } catch (error) {
    logger.error("Failed to get related posts", error as Error, { postId, limit });
    throw new Error(`Failed to retrieve related posts: ${(error as Error).message}`);
  }
}

/**
 * Validate and sanitize search input
 */
export function validateSearchInput(input: string): string {
  if (!input || typeof input !== 'string') {
    throw new Error('Search term must be a non-empty string');
  }
  
  const sanitized = sanitizeInput(input);
  
  // Additional search-specific validation
  if (sanitized.length < 2) {
    throw new Error('Search term must be at least 2 characters');
  }
  
  if (sanitized.length > 100) {
    throw new Error('Search term must be less than 100 characters');
  }
  
  return sanitized;
}
