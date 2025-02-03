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
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
  });

  it("highlights the active menu item based on the current path", () => {
    mockedUsePathname.mockReturnValue("/about");

    render(<Menu />);

    const activeMenuItem = screen.getByText("About");
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

  it("renders menu items with correct href attributes", () => {
    mockedUsePathname.mockReturnValue("/");

    render(<Menu />);

    expect(screen.getByText("Home")).toHaveAttribute("href", "/");
    expect(screen.getByText("About")).toHaveAttribute("href", "/about");
    expect(screen.getByText("Projects")).toHaveAttribute("href", "/projects");
    expect(screen.getByText("Blog")).toHaveAttribute("href", "/blog");
  });
});
