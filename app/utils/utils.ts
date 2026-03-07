import { AUTHOR_NAME } from "./constants";
import { toPlainText } from "next-sanity";
import { Block } from "@/sanity/types/types";
import envConfig from "@/envConfig";

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
 * Generates a title string for the page, including author name and project title if available.
 *
 * If `pageTitle` is not provided, it will return only the author's name.
 *
 * @param {string} pageTitle - The title of the page (optional)
 * @param {string} subPageTitle - The sub page title (optional)
 * @returns {string} - The generated title, including the author name and project title if provided.
 */

export function generateTitle(
  pageTitle?: string,
  subPageTitle?: string
): string {
  if (!pageTitle) {
    return AUTHOR_NAME;
  }

  const baseTitle = `${AUTHOR_NAME} | ${pageTitle}`;
  return subPageTitle ? `${baseTitle} | ${subPageTitle}` : baseTitle;
}

/**
 * Extracts a plain text description from a Sanity block array and truncates it to 160 characters.
 *
 * @param {Block[]} sanityBlock - The Sanity block array containing rich text content.
 * @returns {string} - The truncated plain text description.
 */
export const getDescriptionFromSanity = (sanityBlock: Block[]): string => {
  return truncateText(toPlainText(sanityBlock), 160);
};

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
  return `${envConfig.baseUrl}/${pageSlug}${detailPageSlug ? `/${detailPageSlug}` : ""}`;
};

/**
 * Converts a tag label to an URL-safe slug.
 *
 * @param {string} label - The tag label to convert.
 * @returns {string} - The normalized slug.
 */
export const toTagSlug = (label: string): string => {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
