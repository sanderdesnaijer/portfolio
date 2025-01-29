import { render, screen } from "@testing-library/react";
import { PageNotFound } from "./PageNotFound";

describe("PageNotFound component", () => {
  it("renders the correct content", () => {
    render(<PageNotFound />);

    const message = screen.getByText("[Page not found]");
    expect(message).toBeInTheDocument();
  });
});
