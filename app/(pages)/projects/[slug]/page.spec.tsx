import { render, screen } from "@testing-library/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import ProjectPage from "./page";
import { mockProject } from "@/app/test-utils/mockProjects";
import { getTranslationKey } from "@/app/test-utils/i18n";
import { mockSetting } from "@/app/test-utils/mockSetting";
import { mockPages } from "@/app/test-utils/mockPage";

describe("app/(pages)/[slug]/page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("ProductPage Component", () => {
    it("renders the Project component with fetched project data", async () => {
      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(mockProject)
        .mockResolvedValueOnce(mockSetting)
        .mockResolvedValueOnce(mockPages);

      const params = { slug: "test-project" };

      render(await ProjectPage({ params }));

      expect(sanityFetch).toHaveBeenCalledWith({
        query: expect.any(String),
        params,
      });
      expect(screen.getByText(mockProject.title)).toBeInTheDocument();
    });

    it("renders not found when project data is not found", async () => {
      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockSetting)
        .mockResolvedValueOnce(mockPages);

      const params = { slug: "nonexistent-project" };

      render(await ProjectPage({ params }));

      expect(sanityFetch).toHaveBeenCalledWith({
        query: expect.any(String),
        params,
      });
      expect(
        screen.getByText(getTranslationKey("error.404.project.description"))
      ).toBeInTheDocument();
    });
  });
});
