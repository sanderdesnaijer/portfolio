import { convertDate, truncateText } from "./utils";

describe("app/utils/utils/convertDate", () => {
  it("should format the date with day, month, and year when shouldShowDay is true", () => {
    const date = "2025-01-27";
    const result = convertDate(date);
    expect(result).toBe("Jan 2025");
  });

  it("should handle invalid date strings gracefully", () => {
    const invalidDate = "invalid-date";
    expect(convertDate(invalidDate)).toEqual("Invalid Date");
  });

  it("should handle different locales correctly (using en-GB)", () => {
    const date = "2025-12-25";
    const result = convertDate(date);
    expect(result).toBe("Dec 2025");
  });
});

describe("truncateText", () => {
  it("should return the original text if it is shorter than or equal to the specified length", () => {
    expect(truncateText("Hello", 10)).toBe("Hello");
    expect(truncateText("Hello", 5)).toBe("Hello");
  });

  it('should truncate the text and append "..." if it exceeds the specified length', () => {
    expect(truncateText("Hello World", 5)).toBe("Hello...");
    expect(truncateText("Hello World", 8)).toBe("Hello Wo...");
  });

  it("should truncate text longer than the specified length", () => {
    const longText = "This is a very long text that needs to be truncated.";
    const truncatedText = truncateText(longText, 20);
    expect(truncatedText).toBe("This is a very long ...");
  });

  it("should handle an empty string", () => {
    expect(truncateText("", 5)).toBe("");
  });

  it("should handle length of 0", () => {
    expect(truncateText("Hello", 0)).toBe("...");
  });

  it("should work with text shorter than 3 characters and very small lengths", () => {
    expect(truncateText("Hi", 1)).toBe("H...");
    expect(truncateText("A", 0)).toBe("...");
  });
});
