import { render, screen } from "@testing-library/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import { generateStaticParams } from "./page";
import ProjectPage from "./page";

jest.mock("@/sanity/lib/fetch", () => ({
  sanityFetch: jest.fn(),
}));

jest.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: jest.fn(),
  },
}));

jest.mock("@/components/Project", () => ({
  Project: jest.fn(() => <div>Mocked Project Component</div>),
}));

describe("ProductPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("generateStaticParams", () => {
    it("fetches project paths correctly", async () => {
      const mockProjects = [
        { slug: { current: "project-1" } },
        { slug: { current: "project-2" } },
      ];

      (client.fetch as jest.Mock).mockResolvedValueOnce(mockProjects);

      const result = await generateStaticParams();

      expect(client.fetch).toHaveBeenCalledWith(expect.any(String)); // Validate query is passed
      expect(result).toEqual(mockProjects);
    });
  });

  describe("ProductPage Component", () => {
    it("renders the Project component with fetched project data", async () => {
      const mockProject = {
        title: "Test Project",
        slug: { current: "test-project" },
        mainImage: {
          asset: { _ref: "image-123", _type: "reference" },
          alt: "Test Image",
        },
        publishedAt: "2023-01-01",
        body: [],
        links: [],
      };

      (sanityFetch as jest.Mock).mockResolvedValueOnce(mockProject);

      const params = { slug: "test-project" };

      render(await ProjectPage({ params }));

      // Ensure the Project component is rendered with the correct props
      expect(sanityFetch).toHaveBeenCalledWith({
        query: expect.any(String), // Validate query is passed
        params,
      });
      expect(screen.getByText("Mocked Project Component")).toBeInTheDocument();
    });
  });
});
