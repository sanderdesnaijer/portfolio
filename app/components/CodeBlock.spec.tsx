import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  let writeText: jest.Mock;

  beforeEach(() => {
    writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
      writable: true,
    });
  });

  it("renders highlighted code and the language label", () => {
    render(<CodeBlock code="const n = 1;" language="javascript" />);
    expect(screen.getByText("javascript")).toBeInTheDocument();
    const code = document.querySelector("code.hljs");
    expect(code).toBeInTheDocument();
    expect(code?.innerHTML).toContain("const");
  });

  it("shows Code as the label when language is omitted or text", () => {
    const { rerender } = render(<CodeBlock code="x" />);
    expect(screen.getByText("Code")).toBeInTheDocument();
    rerender(<CodeBlock code="x" language="text" />);
    expect(screen.getByText("Code")).toBeInTheDocument();
  });

  it("copies raw source to the clipboard when Copy is clicked", async () => {
    const snippet = "const x = 1;\n";
    render(<CodeBlock code={snippet} language="typescript" />);
    fireEvent.click(screen.getByRole("button", { name: /copy code/i }));
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(snippet);
    });
  });

  it("shows Copied feedback after copying", async () => {
    render(<CodeBlock code="a" language="typescript" />);
    fireEvent.click(screen.getByRole("button", { name: /copy code/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /^copied$/i })
      ).toBeInTheDocument();
    });
  });
});
