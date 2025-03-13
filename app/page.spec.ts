import { render, screen } from "@testing-library/react";
import { settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";

import Home from "./page";
import { getTranslationKey } from "./test-utils/i18n";
import { mockPages } from "./test-utils/mockPage";

const mockSanityFetch = sanityFetch as jest.Mock;

describe("app/page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders 'Page not found' when sanityFetch returns null", async () => {
    mockSanityFetch.mockResolvedValue(null).mockResolvedValueOnce(null);

    const { container } = render(await Home());
    expect(
      screen.getByText(getTranslationKey("error.404.generic.title"))
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders the Home page with settings data", async () => {
    const mockSettings = {
      title: "Test Title",
      description: "Test Description",
      socialMedia: [
        { icon: "facebook", link: "https://facebook.com" },
        { icon: "twitter", link: "https://twitter.com" },
      ],
    };

    mockSanityFetch
      .mockResolvedValueOnce(mockSettings)
      .mockResolvedValueOnce(mockPages);

    render(await Home());

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByLabelText("facebook icon")).toBeInTheDocument();
    expect(screen.getByLabelText("twitter icon")).toBeInTheDocument();
  });

  it("calls sanityFetch with the correct query", async () => {
    const mockSettings = { title: "Test Title" };

    mockSanityFetch
      .mockResolvedValueOnce(mockSettings)
      .mockResolvedValueOnce(mockPages);

    await Home();

    expect(mockSanityFetch).toHaveBeenCalledWith({
      query: settingsQuery,
    });
  });
});
