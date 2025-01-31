import { render, screen } from "@testing-library/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import Page from "./page";
import { getTranslationKey } from "@/app/test-utils/i18n";

jest.mock("next-sanity", () => ({
  ...jest.requireActual("next-sanity"),
  groq: (query: string) => query,

  PortableText: ({ value }: { value: unknown }) => (
    <div data-testid="portable-text">{JSON.stringify(value)}</div>
  ),
}));

describe("Page Component", () => {
  const mockPage = {
    title: "About Me",
    imageAlt: "Profile Picture",
    imageURL: "mock-image-url",
    body: [{ type: "text", children: [{ text: "Mock body content" }] }],
  };

  const mockJobs = [
    {
      _id: "job-1",
      imageURL: "mock-job-image-url",
      companyName: "Company A",
      jobTitle: "Developer",
      startDate: "2022-01-01",
      endDate: null,
      description: [{ type: "text", children: [{ text: "Job description" }] }],
      links: [
        {
          title: "GitHub",
          icon: "github",
        },
      ],
      tags: "React, TypeScript",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the page with correct data", async () => {
    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockPage) // First call for page data
      .mockResolvedValueOnce(mockJobs); // Second call for jobs data

    const { container } = render(await Page());

    // Check page title
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "About Me"
    );

    // Check image rendering
    expect(
      screen.getByAltText("Profile Picture").getAttribute("src")
    ).toContain("mocked-image-url");

    // Check body content rendering
    expect(screen.getByText(JSON.stringify(mockPage.body))).toBeTruthy();

    // Check job experience section
    expect(screen.getByText("Company A")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(
      screen.getByText(`Jan 2022 - ${getTranslationKey("date-present")}`)
    ).toBeInTheDocument();

    // Check links in job
    expect(screen.getByText("GitHub")).toBeInTheDocument();

    // Check snapshot
    expect(container).toMatchSnapshot();
  });

  it("renders [Page not found] when page data is missing", async () => {
    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(null) // First call for page data
      .mockResolvedValueOnce(mockJobs); // Second call for jobs data

    render(await Page());

    expect(screen.getByText("[Page not found]")).toBeInTheDocument();
  });

  it("handles missing job links gracefully", async () => {
    const mockJobsWithoutLinks = [
      {
        ...mockJobs[0],
        links: null, // Remove links
      },
    ];

    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockPage) // First call for page data
      .mockResolvedValueOnce(mockJobsWithoutLinks); // Second call for jobs data

    render(await Page());

    // Ensure it doesn't throw an error and renders correctly
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
  });

  it("handles empty jobs list gracefully", async () => {
    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockPage) // First call for page data
      .mockResolvedValueOnce([]); // Second call for jobs data

    render(await Page());

    // Ensure no jobs are rendered
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("renders correctly when page body is missing", async () => {
    const mockPageWithoutBody = {
      ...mockPage,
      body: null, // Body is missing
    };

    (sanityFetch as jest.Mock).mockResolvedValueOnce(mockPageWithoutBody); // First call for page data

    render(await Page());

    // Ensure the PortableText is not rendered
    expect(screen.queryByTestId("portable-text")).not.toBeInTheDocument();

    // Verify the page title still renders
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "About Me"
    );
  });

  it("renders job with endDate correctly", async () => {
    const mockJobsWithEndDate = [
      {
        ...mockJobs[0],
        endDate: "2023-12-31", // Provide an endDate
      },
    ];

    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockPage) // First call for page data
      .mockResolvedValueOnce(mockJobsWithEndDate); // Second call for jobs data

    render(await Page());

    // Check that the job's start and end date is rendered correctly
    expect(screen.getByText("Jan 2022 - Dec 2023")).toBeInTheDocument();
  });

  it("renders [present] when job endDate is not given", async () => {
    const mockJobsWithoutEndDate = [
      {
        ...mockJobs[0],
        endDate: null, // No end date
      },
    ];

    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockPage) // First call for page data
      .mockResolvedValueOnce(mockJobsWithoutEndDate); // Second call for jobs data

    render(await Page());

    // Check that "[present]" is displayed for the job
    expect(
      screen.getByText(`Jan 2022 - ${getTranslationKey("date-present")}`)
    ).toBeInTheDocument();
  });
});
