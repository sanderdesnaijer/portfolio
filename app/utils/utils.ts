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
