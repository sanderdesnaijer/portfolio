import { render, screen } from "@testing-library/react";
import Page from "./page";

it("renders the Page component with the correct structure", async () => {
  // Render the asynchronous Page component
  const { container } = render(await Page());

  // Verify the main heading is present
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Blog");

  // Verify the structure and classes are applied to the outer container
  const gridContainer = container.querySelector("div.grid");
  expect(gridContainer).toBeInTheDocument();
  expect(gridContainer).toHaveClass(
    "grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
  );

  // Verify the main element is rendered with the correct classes
  const mainElement = screen.getByRole("main");
  expect(mainElement).toBeInTheDocument();
  expect(mainElement).toHaveClass(
    "flex flex-col gap-8 row-start-2 items-center sm:items-start"
  );
});
