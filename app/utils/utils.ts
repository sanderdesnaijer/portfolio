import { AUTHOR_NAME } from "./constants";
import { toPlainText } from "next-sanity";
import { Block } from "@/sanity/types/types";
import { getBaseUrl } from "./routes";

/**
 * Converts a date string into a formatted date string.
 *
 * @param date - The date string to be converted.
 * @param showDay - Optional. If true, includes the day in the formatted date string. Defaults to false.
 * @returns The formatted date string in "en-GB" locale.
 */
export const convertDate = (date: string, showDay: boolean = false) => {
  const format: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    ...(showDay && { day: "numeric" }),
  };

  return new Date(date).toLocaleDateString("en-GB", format);
};

/**
 * Extracts text content from an HTML string, removing all HTML tags and figcaption elements.
 * The resulting text is trimmed, condensed to a single space between words, and truncated to 200 characters.
 *
 * @param html - The HTML string to extract text from.
 * @returns The extracted and cleaned text, truncated to 200 characters followed by an ellipsis.
 */
export const extractTextFromHTML = (html: string) => {
  const withoutFigcaptions = html.replace(
    /<figcaption>[^]*?<\/figcaption>/g,
    ""
  );
  const text = withoutFigcaptions.replace(/<[^>]*>/g, " ");
  const cleanText = text.replace(/\s+/g, " ").trim();
  return cleanText.substring(0, 200) + "...";
};

/**
 * Truncates a given text to a specified length and appends an ellipsis ("...") if the text exceeds that length.
 *
 * @param text - The text to be truncated.
 * @param length - The maximum length of the truncated text.
 * @returns The truncated text with an ellipsis if it exceeds the specified length, otherwise the original text.
 */
export const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
};

/**
 * Extracts the URL of the first image found in the given article description.
 *
 * @param articleDescription - The HTML content of the article description.
 * @returns The URL of the first image if found, otherwise undefined.
 */
export const getImageURL = (articleDescription: string): string | undefined => {
  return articleDescription.match(/<img[^>]+src="([^">]+)"/)?.[1];
};

/**
 * Extracts the slug from a given URL.
 *
 * This function looks for a pattern where the slug is followed by a hyphen
 * and a 12-character alphanumeric ID, before a query parameter (`?`).
 * If no match is found, it returns `"not-found"`.
 *
 * @param {string} url - The URL to extract the slug from.
 * @returns {string} The extracted slug or `"not-found"` if no match is found.
 */
export const getSlug = (url: string): string => {
  const match = url.match(/\/([^\/]+)-[a-f0-9]{12}\?/);
  return match ? match[1] : "not-found";
};

/**
 * Generates a title string for the page, including author name and project title if available.
 *
 * @param {string} pageTitle - The title of the page.
 * @param {string} subPageTitle - The sub page title (optional)
 * @returns {string} - The generated title, including the author name and project title if provided.
 *
 * @example
 * generateTitle("My Portfolio", "Project One");
 * // Returns: "AUTHOR_NAME | My Portfolio | Project One"
 *
 * generateTitle("My Portfolio");
 * // Returns: "AUTHOR_NAME | My Portfolio"
 */
export function generateTitle(
  pageTitle: string,
  subPageTitle?: string
): string {
  const baseTitle = `${AUTHOR_NAME} | ${pageTitle}`;
  return subPageTitle ? `${baseTitle} | ${subPageTitle}` : baseTitle;
}

/**
 * Extracts a plain text description from a Sanity block array and truncates it to 160 characters.
 *
 * @param {Block[]} sanityBlock - The Sanity block array containing rich text content.
 * @returns {string} - The truncated plain text description.
 */
export const getDescriptionFromSanity = (sanityBlock: Block[]): string =>
  truncateText(toPlainText(sanityBlock), 160);

/**
 * Constructs a full URL using the base URL and provided slugs.
 *
 * @param {string} pageSlug - The main page slug (e.g., "products", "about").
 * @param {string} [detailPageSlug] - Optional detail page slug (e.g., a product ID or category name).
 * @returns {string} - The fully constructed URL.
 */
export const buildPageUrl = (
  pageSlug: string,
  detailPageSlug?: string
): string => {
  return `${getBaseUrl()}/${pageSlug}${detailPageSlug ? `/${detailPageSlug}` : ""}`;
};
