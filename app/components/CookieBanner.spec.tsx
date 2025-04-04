import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CookieBanner from "./CookieBanner";

// Mock `next-intl` translations
jest.mock("next-intl", () => ({
  useTranslations: jest.fn().mockReturnValue((key: string) => {
    const translations: Record<string, string> = {
      message: "We use cookies for analytics.",
      accept: "Accept",
      decline: "Decline",
    };
    return translations[key] || key;
  }),
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.gtag = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("CookieBanner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it("renders correctly when no consent is given", () => {
    render(<CookieBanner />);
    expect(
      screen.getByText("We use cookies for analytics.")
    ).toBeInTheDocument();
    expect(screen.getByText("Accept")).toBeInTheDocument();
    expect(screen.getByText("Decline")).toBeInTheDocument();
  });

  it("hides the banner if consent is already set", () => {
    localStorageMock.setItem("cookie_consent", JSON.stringify(true));
    render(<CookieBanner />);
    expect(
      screen.queryByText("We use cookies for analytics.")
    ).not.toBeInTheDocument();
  });

  it("sets consent to 'granted' when Accept is clicked", async () => {
    render(<CookieBanner />);
    fireEvent.click(screen.getByText("Accept"));

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "cookie_consent",
        JSON.stringify(true)
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(global.gtag).toHaveBeenCalledWith("consent", "update", {
        analytics_storage: "granted",
      });
    });

    expect(
      screen.queryByText("We use cookies for analytics.")
    ).not.toBeInTheDocument();
  });

  it("sets consent to 'denied' when Decline is clicked", async () => {
    render(<CookieBanner />);
    fireEvent.click(screen.getByText("Decline"));

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "cookie_consent",
        JSON.stringify(false)
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(global.gtag).toHaveBeenCalledWith("consent", "update", {
        analytics_storage: "denied",
      });
    });

    expect(
      screen.queryByText("We use cookies for analytics.")
    ).not.toBeInTheDocument();
  });
});
