import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "./layout";

// Mock IntlProvider to avoid async/await issues in client components
jest.mock("./components/IntlProvider", () => ({
  __esModule: true,
  default: ({ children }: { children: (locale: string) => React.ReactNode }) =>
    children("en"),
}));

describe("app/layout", () => {
  // eslint-disable-next-line no-console
  const originalConsoleError = console.error;

  beforeAll(() => {
    // Suppress hydration warning about <html> being a child of <div>
    // eslint-disable-next-line no-console
    console.error = (...args) => {
      if (
        (typeof args[0] === "string" &&
          args[0].includes("In HTML, %s cannot be a child of <%s>.%s")) ||
        (typeof args[0] === "string" &&
          args[0].includes("async/await it not yet supported"))
      ) {
        return; // Ignore this specific warning
      }
      originalConsoleError(...args); // Allow other errors
    };
  });

  afterAll(() => {
    // Restore original console.error
    // eslint-disable-next-line no-console
    console.error = originalConsoleError;
  });

  it("should render children inside the layout", () => {
    render(
      <RootLayout>
        <main data-testid="main-content">Hello, World!</main>
      </RootLayout>
    );

    const mainContent = screen.getByTestId("main-content");
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveTextContent("Hello, World!");
  });

  it("should have the correct metadata", () => {
    expect(metadata.title).toBe("Sander de Snaijer");
    expect(metadata.description).toBe(
      "Passionate software developer turning creative ideas to functional products."
    );
  });
});
