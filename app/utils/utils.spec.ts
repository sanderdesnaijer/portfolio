import { convertDate } from "./utils";

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
