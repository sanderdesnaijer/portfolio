import { BlogSanity } from "@/sanity/types/blogType";
import { getDescriptionFromSanity } from "./utils";

/**
 * Extracts text from HTML, stripping tags and figcaptions.
 * Used as fallback for legacy Medium blog posts that haven't been migrated yet.
 */
export const extractTextFromHTML = (html: string): string => {
  const withoutFigcaptions = html.replace(
    /<figcaption>[^]*?<\/figcaption>/g,
    ""
  );
  const text = withoutFigcaptions.replace(/<[^>]*>/g, " ");
  const cleanText = text.replace(/\s+/g, " ").trim();
  const maxLength = 200;

  return (
    cleanText.substring(0, maxLength) +
    (cleanText.length > maxLength ? "..." : "")
  );
};

/**
 * Gets the excerpt for a blog post, handling both new (Portable Text)
 * and legacy (HTML description) formats.
 */
export const getExcerpt = (article: BlogSanity): string => {
  if (article.excerpt) return article.excerpt;
  if (article.body && article.body.length > 0) {
    return getDescriptionFromSanity(article.body);
  }
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  if (article.description) return extractTextFromHTML(article.description);
  return "";
};
