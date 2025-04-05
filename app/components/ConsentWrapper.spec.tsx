import { act, render, screen, waitFor } from "@testing-library/react";
import { ConsentWrapper } from "./ConsentWrapper";
import envConfig from "@/envConfig";

// Mock usePathname
jest.mock("next/navigation", () => ({
  usePathname: () => "/test-path",
}));

// Mock next/script
// eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
jest.mock("next/script", () => (props: any) => {
  return (
    <div data-testid="mock-script" data-src={props.src} id={props.id}>
      {props.children}
    </div>
  );
});

// Mock CookieBanner
jest.mock("./CookieBanner", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="cookie-banner">CookieBanner</div>,
    getLocalStorage: jest.fn((key, defaultValue) => {
      return window.localStorage.getItem(key) || defaultValue;
    }),
  };
});

describe("ConsentWrapper", () => {
  beforeEach(() => {
    jest.resetModules();
    window.localStorage.clear();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag = jest.fn();
  });

  const renderComponent = (children?: React.ReactNode) => {
    return render(
      <ConsentWrapper>{children ?? <p>Child content</p>}</ConsentWrapper>
    );
  };

  it("renders child components and cookie banner", () => {
    window.localStorage.setItem(
      "cookie_consent",
      JSON.stringify({ value: true, expiry: null })
    );

    renderComponent();
    expect(screen.getByText("Child content")).toBeInTheDocument();
    expect(screen.getByTestId("cookie-banner")).toBeInTheDocument();
  });

  it("does not render GA scripts without consent", () => {
    window.localStorage.setItem(
      "cookie_consent",
      JSON.stringify({ value: false, expiry: null })
    );

    renderComponent();
    expect(screen.queryByTestId("mock-script")).not.toBeInTheDocument();
  });

  it("renders GA scripts when consent is granted and env is set", async () => {
    envConfig.googleAnalytics = "G-TEST123";
    window.localStorage.setItem(
      "cookie_consent",
      JSON.stringify({ value: true, expiry: null })
    );

    renderComponent();

    const scripts = await screen.findAllByTestId("mock-script");
    expect(scripts[0]).toHaveAttribute(
      "data-src",
      expect.stringContaining("G-TEST123")
    );
  });

  it("calls gtag pageview on mount when consent is given", async () => {
    envConfig.googleAnalytics = "G-TEST123";
    window.localStorage.setItem(
      "cookie_consent",
      JSON.stringify({ value: true, expiry: null })
    );

    renderComponent();

    await waitFor(() => {
      expect(window.gtag).toHaveBeenCalledWith("config", "G-TEST123", {
        page_path: "/test-path",
      });
    });
  });

  it("updates consent when local-storage-change is dispatched", async () => {
    envConfig.googleAnalytics = "G-TEST123";
    window.localStorage.setItem(
      "cookie_consent",
      JSON.stringify({ value: false, expiry: null })
    );

    renderComponent();

    // simulate user accepting
    window.localStorage.setItem(
      "cookie_consent",
      JSON.stringify({ value: true, expiry: null })
    );

    await act(() => {
      window.dispatchEvent(new Event("local-storage-change"));
    });

    const scripts = await screen.findAllByTestId("mock-script");
    expect(scripts).toHaveLength(2);
  });

  it("does not use expired consent", () => {
    const pastExpiry = new Date().getTime() - 1000; // 1 second in the past
    window.localStorage.setItem(
      "cookie_consent",
      JSON.stringify({ value: true, expiry: pastExpiry })
    );

    renderComponent();

    expect(screen.queryByTestId("mock-script")).not.toBeInTheDocument();
  });
});
