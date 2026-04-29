import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/en.json";
import { EmbedBlock } from "./EmbedBlock";

function renderWithIntl(ui: ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("EmbedBlock", () => {
  describe("iframe type", () => {
    it("renders an iframe with src, lazy loading and camera permission", () => {
      renderWithIntl(
        <EmbedBlock
          type="iframe"
          url="https://demos.sanderdesnaijer.com/face-mesh-explorer"
        />
      );

      const iframe = screen.getByTitle("Interactive demo") as HTMLIFrameElement;
      expect(iframe).toBeInTheDocument();
      expect(iframe.getAttribute("src")).toBe(
        "https://demos.sanderdesnaijer.com/face-mesh-explorer"
      );
      expect(iframe.getAttribute("loading")).toBe("lazy");
      expect(iframe.getAttribute("allow")).toBe("camera");
    });

    it("uses the caption as the iframe title and renders a figcaption", () => {
      renderWithIntl(
        <EmbedBlock
          type="iframe"
          url="https://example.com/demo"
          caption="Live face mesh explorer"
        />
      );

      expect(screen.getByTitle("Live face mesh explorer")).toBeInTheDocument();
      expect(
        screen.getByText("Live face mesh explorer", { selector: "figcaption" })
      ).toBeInTheDocument();
    });

    it("applies the provided height to the iframe wrapper", () => {
      const { container } = renderWithIntl(
        <EmbedBlock type="iframe" url="https://example.com" height="500px" />
      );

      const wrapper = container.querySelector("figure > div");
      expect(wrapper).toHaveStyle({ height: "500px" });
    });

    it("falls back to 80vh when no height is provided", () => {
      const { container } = renderWithIntl(
        <EmbedBlock type="iframe" url="https://example.com" />
      );

      const wrapper = container.querySelector("figure > div");
      expect(wrapper).toHaveStyle({ height: "80vh" });
    });

    it("renders nothing when iframe url is missing", () => {
      const { container } = renderWithIntl(<EmbedBlock type="iframe" />);
      expect(container.querySelector("figure")).toBeNull();
      expect(container.querySelector("iframe")).toBeNull();
    });
  });

  describe("component type", () => {
    it("renders nothing when componentId is missing", () => {
      const { container } = renderWithIntl(<EmbedBlock type="component" />);
      expect(container.querySelector("figure")).toBeNull();
      expect(
        screen.queryByText(/Unknown embed component:/i)
      ).not.toBeInTheDocument();
    });

    it("renders nothing in production when componentId is unknown", () => {
      const original = process.env.NODE_ENV;
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "production",
        configurable: true,
      });

      const { container } = renderWithIntl(
        <EmbedBlock type="component" componentId="does-not-exist" />
      );
      expect(container.querySelector("figure")).toBeNull();
      expect(
        screen.queryByText(/Unknown embed component:/i)
      ).not.toBeInTheDocument();

      Object.defineProperty(process.env, "NODE_ENV", {
        value: original,
        configurable: true,
      });
    });

    it("renders a dev-mode warning when componentId is unknown in development", () => {
      const original = process.env.NODE_ENV;
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "development",
        configurable: true,
      });

      renderWithIntl(<EmbedBlock type="component" componentId="missing" />);

      expect(screen.getByText(/Unknown embed component:/i)).toBeInTheDocument();
      expect(screen.getByText("missing")).toBeInTheDocument();

      Object.defineProperty(process.env, "NODE_ENV", {
        value: original,
        configurable: true,
      });
    });
  });

  describe("invalid input", () => {
    it("renders nothing for an unsupported type", () => {
      const { container } = renderWithIntl(
        // @ts-expect-error testing invalid runtime input
        <EmbedBlock type="other" />
      );
      expect(container.querySelector("figure")).toBeNull();
      expect(container.querySelector("iframe")).toBeNull();
    });
  });
});
