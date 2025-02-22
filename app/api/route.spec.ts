/**
 * @jest-environment node
 */
import { getTranslationKey } from "../test-utils/i18n";
import { GET } from "./route";

describe("GET /api", () => {
  it("should return a 200 status with a message", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ message: getTranslationKey("api.info") });
  });
});
