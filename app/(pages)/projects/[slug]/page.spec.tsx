import { render, screen } from "@testing-library/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import ProjectPage from "./page";
import { mockProject } from "@/app/test-utils/mockProjects";
import { mockPages } from "@/app/test-utils/mockPage";
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/app/components/RelatedProjects", () => ({
  RelatedProjects: () => (
    <div data-testid="related-projects">Related Projects</div>
  ),
}));

describe("app/(pages)/[slug]/page", () => {
  beforeEach(() => {
    (sanityFetch as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("ProductPage Component", () => {
    it("renders the Project component with fetched project data", async () => {
      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(mockProject)
        .mockResolvedValueOnce(mockPages);

      const params = { slug: "test-project" };

      render(await ProjectPage({ params }));

      expect(sanityFetch).toHaveBeenCalledWith({
        query: expect.any(String),
        params,
      });
      expect(screen.getByText(mockProject.title)).toBeInTheDocument();
    });

    it("calls notFound when project data is not found", async () => {
      (sanityFetch as jest.Mock).mockResolvedValueOnce(null);

      const params = { slug: "nonexistent-project" };

      await ProjectPage({ params });

      expect(notFound).toHaveBeenCalled();
    });
  });
});
