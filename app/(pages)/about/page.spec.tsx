import { render, screen } from "@testing-library/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import Page from "./page";
import { getTranslationKey } from "@/app/test-utils/i18n";
import { JobSanity, PageSanity } from "@/sanity/types";
import { mockPage, mockPages } from "@/app/test-utils/mockPage";
import { mockSetting } from "@/app/test-utils/mockSetting";

jest.mock("next-sanity", () => ({
  ...jest.requireActual("next-sanity"),
  groq: (query: string) => query,

  PortableText: ({ value }: { value: unknown }) => (
    <div data-testid="portable-text">{JSON.stringify(value)}</div>
  ),
}));

describe("app/(pages)/about-me", () => {
  const mockAboutMePage: PageSanity = {
    ...mockPage,
    title: "About Me",
  };

  const mockJobs: JobSanity[] = [
    {
      _id: "job-1",
      imageURL: "mock-job-image-url",
      companyName: "Company A",
      jobTitle: "Developer",
      startDate: "2022-01-01",
      endDate: undefined,
      description: [
        {
          _type: "block",
          children: [
            {
              text: "Job description",
              _type: "span",
              marks: [],
            },
          ],
          style: "",
        },
      ],
      link: "https://test.com",
      tags: [
        {
          _type: "tag",
          name: "React",
          label: "",
          _id: "tag-1",
          _rev: "",
          _createdAt: "",
          _updatedAt: "",
        },
        {
          _type: "tag",
          name: "TypeScript",
          label: "",
          _id: "tag-2",
          _rev: "",
          _createdAt: "",
          _updatedAt: "",
        },
      ],
      _rev: "",
      _type: "",
      _createdAt: "",
      _updatedAt: "",
      employmentType: "full-time",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the page with correct data", async () => {
    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockAboutMePage)
      .mockResolvedValueOnce(mockJobs)
      .mockResolvedValueOnce(mockSetting)
      .mockResolvedValueOnce(mockPages);

    render(await Page());

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "About Me"
    );

    expect(
      screen.getByAltText("Profile Picture").getAttribute("src")
    ).toContain("mocked-image-url");

    expect(screen.getByText(JSON.stringify(mockAboutMePage.body))).toBeTruthy();

    expect(screen.getByText("Company A")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(
      screen.getByText(
        `Jan 2022 - ${getTranslationKey("pages.about.datePresent")}`
      )
    ).toBeInTheDocument();
  });

  it("renders Page not found when page data is missing", async () => {
    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockJobs)
      .mockResolvedValueOnce(mockSetting)
      .mockResolvedValueOnce(mockPages);

    render(await Page());

    expect(
      screen.getByText(getTranslationKey("error.404.generic.description"))
    ).toBeInTheDocument();
  });

  it("handles missing job links gracefully", async () => {
    const mockJobsWithoutLinks = [
      {
        ...mockJobs[0],
        links: null,
      },
    ];

    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockAboutMePage)
      .mockResolvedValueOnce(mockJobsWithoutLinks)
      .mockResolvedValueOnce(mockSetting)
      .mockResolvedValueOnce(mockPages);

    render(await Page());

    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
  });

  it("renders correctly when page body is missing", async () => {
    const mockPageWithoutBody = {
      ...mockAboutMePage,
      body: null,
    };

    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockPageWithoutBody)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(mockJobs)
      .mockResolvedValueOnce(mockPages);
    render(await Page());

    expect(screen.queryByTestId("portable-text")).not.toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "About Me"
    );
  });

  it("renders job with endDate correctly", async () => {
    const mockJobsWithEndDate = [
      {
        ...mockJobs[0],
        endDate: "2023-12-31",
      },
    ];

    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockAboutMePage)
      .mockResolvedValueOnce(mockJobsWithEndDate)
      .mockResolvedValueOnce(mockJobs)
      .mockResolvedValueOnce(mockPages);

    render(await Page());

    expect(screen.getByText("Jan 2022 - Dec 2023")).toBeInTheDocument();
  });

  it("renders present when job endDate is not given", async () => {
    const mockJobsWithoutEndDate = [
      {
        ...mockJobs[0],
        endDate: null,
      },
    ];

    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockAboutMePage)
      .mockResolvedValueOnce(mockJobsWithoutEndDate)
      .mockResolvedValueOnce(mockJobs)
      .mockResolvedValueOnce(mockPages);

    render(await Page());

    expect(
      screen.getByText(
        `Jan 2022 - ${getTranslationKey("pages.about.datePresent")}`
      )
    ).toBeInTheDocument();
  });
});
