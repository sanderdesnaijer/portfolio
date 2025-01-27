import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "./layout";

describe("RootLayout", () => {
  const originalConsoleError = console.error;

  beforeAll(() => {
    // Suppress hydration warning about <html> being a child of <div>
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("In HTML, %s cannot be a child of <%s>.%s")
      ) {
        return; // Ignore this specific warning
      }
      originalConsoleError(...args); // Allow other errors
    };
  });

  afterAll(() => {
    // Restore original console.error
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

  it("should include the Menu component", () => {
    render(
      <RootLayout>
        <div />
      </RootLayout>
    );

    const menu = screen.getByRole("navigation");
    expect(menu).toBeInTheDocument();
  });

  it("should have the correct metadata", () => {
    expect(metadata.title).toBe("Portfolio Sander de Snaijer");
    expect(metadata.description).toBe(
      "Passionate software developer turning creative ideas to functional products."
    );
  });
});
