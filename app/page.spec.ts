import { render, screen } from "@testing-library/react";
import { settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";

import Home from "./page";
import { getTranslationKey } from "./test-utils/i18n";
import { mockPage, mockPages } from "./test-utils/mockPage";
import { AUTHOR_NAME } from "./utils/constants";

const mockSanityFetch = sanityFetch as jest.Mock;

describe("app/page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders 'Page not found' when sanityFetch returns null", async () => {
    mockSanityFetch.mockResolvedValue(null).mockResolvedValueOnce(null);

    render(await Home());
    expect(
      screen.getByText(getTranslationKey("error.404.generic.description"))
    ).toBeInTheDocument();
  });

  it("renders the Home page with settings data", async () => {
    const mockSettings = {
      description: "Test Description",
      socialMedia: [
        { icon: "facebook", link: "https://facebook.com" },
        { icon: "twitter", link: "https://twitter.com" },
      ],
    };

    mockSanityFetch
      .mockResolvedValueOnce(mockSettings)
      .mockResolvedValueOnce(mockPage)
      .mockResolvedValueOnce(mockPages);

    render(await Home());

    expect(screen.getByText(AUTHOR_NAME)).toBeInTheDocument();
    expect(screen.getAllByText("svgrurl")).toHaveLength(3);
  });

  it("calls sanityFetch with the correct query", async () => {
    const mockSettings = { title: "Test Title", socialMedia: [] };

    mockSanityFetch
      .mockResolvedValueOnce(mockSettings)
      .mockResolvedValueOnce(mockPage)
      .mockResolvedValueOnce(mockPages);

    await Home();

    expect(mockSanityFetch).toHaveBeenCalledWith({
      query: settingsQuery,
    });
  });
});
