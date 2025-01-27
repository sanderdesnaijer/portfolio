import { convertDate } from "./utils";

describe("app/utils/utils/convertDate", () => {
  it("should format the date with day, month, and year when shouldShowDay is true", () => {
    const date = "2025-01-27"; // ISO format
    const result = convertDate(date, true);
    expect(result).toBe("27 Jan 2025");
  });

  it("should format the date with month and year only when shouldShowDay is false", () => {
    const date = "2025-01-27"; // ISO format
    const result = convertDate(date, false);
    expect(result).toBe("Jan 2025");
  });

  it("should handle invalid date strings gracefully", () => {
    const invalidDate = "invalid-date";
    expect(convertDate(invalidDate)).toEqual("Invalid Date");
  });

  it("should default to showing the day if shouldShowDay is not provided", () => {
    const date = "2025-01-27";
    const result = convertDate(date);
    expect(result).toBe("27 Jan 2025");
  });

  it("should handle different locales correctly (using en-GB)", () => {
    const date = "2025-12-25";
    const result = convertDate(date, true);
    expect(result).toBe("25 Dec 2025");
  });
});
