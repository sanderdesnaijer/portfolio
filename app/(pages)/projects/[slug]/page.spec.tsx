import { render, screen } from "@testing-library/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import ProjectPage from "./page";
import { mockProject } from "@/app/test-utils/mockProjects";
import { getTranslationKey } from "@/app/test-utils/i18n";

jest.mock("@/components/Project", () => ({
  Project: jest.fn(() => <div>Mocked Project Component</div>),
}));

describe("app/(pages)/[slug]/page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("ProductPage Component", () => {
    it("renders the Project component with fetched project data", async () => {
      (sanityFetch as jest.Mock).mockResolvedValueOnce(mockProject);

      const params = { slug: "test-project" };

      render(await ProjectPage({ params }));

      expect(sanityFetch).toHaveBeenCalledWith({
        query: expect.any(String),
        params,
      });
      expect(screen.getByText("Mocked Project Component")).toBeInTheDocument();
    });

    it("renders PageNotFound when project data is not found", async () => {
      (sanityFetch as jest.Mock).mockResolvedValueOnce(null);

      const params = { slug: "nonexistent-project" };

      render(await ProjectPage({ params }));

      expect(sanityFetch).toHaveBeenCalledWith({
        query: expect.any(String),
        params,
      });
      expect(
        screen.getByText(getTranslationKey("page-not-found"))
      ).toBeInTheDocument();
    });
  });
});
