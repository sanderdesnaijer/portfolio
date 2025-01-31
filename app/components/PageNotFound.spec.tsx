import { render, screen } from "@testing-library/react";
import { PageNotFound } from "./PageNotFound";
import { getTranslationKey } from "../test-utils/i18n";

describe("PageNotFound component", () => {
  it("renders the correct content", () => {
    render(<PageNotFound />);

    const message = screen.getByText(getTranslationKey("page-not-found"));
    expect(message).toBeInTheDocument();
  });
});
