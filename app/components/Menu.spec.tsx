import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import Menu from "./Menu";

describe("Menu Component", () => {
  const mockedUsePathname = usePathname as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all menu items", () => {
    mockedUsePathname.mockReturnValue("/");

    render(<Menu />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About me")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
  });

  it("highlights the active menu item based on the current path", () => {
    mockedUsePathname.mockReturnValue("/about-me");

    render(<Menu />);

    const activeMenuItem = screen.getByText("About me");
    expect(activeMenuItem).toHaveClass(
      "text-orange-600 underline underline-offset-8 decoration-2"
    );

    const nonActiveMenuItems = [
      screen.getByText("Home"),
      screen.getByText("Projects"),
      screen.getByText("Blog"),
    ];
    nonActiveMenuItems.forEach((item) =>
      expect(item).not.toHaveClass(
        "text-orange-600 underline underline-offset-8 decoration-2"
      )
    );
  });

  it("does not highlight any menu item if the path does not match", () => {
    mockedUsePathname.mockReturnValue("/unknown-path");

    render(<Menu />);

    screen
      .getAllByRole("link")
      .forEach((item) =>
        expect(item).not.toHaveClass(
          "text-orange-600 underline underline-offset-8 decoration-2"
        )
      );
  });

  it("renders menu items with correct href attributes", () => {
    mockedUsePathname.mockReturnValue("/");

    render(<Menu />);

    expect(screen.getByText("Home")).toHaveAttribute("href", "/");
    expect(screen.getByText("About me")).toHaveAttribute("href", "/about-me");
    expect(screen.getByText("Projects")).toHaveAttribute("href", "/projects");
    expect(screen.getByText("Blog")).toHaveAttribute("href", "/blog");
  });
});
