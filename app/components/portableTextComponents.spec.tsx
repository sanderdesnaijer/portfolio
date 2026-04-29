import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/en.json";
import { portableTextComponents } from "./portableTextComponents";
import type { PortableTextReactComponents } from "@portabletext/react";

type Types = NonNullable<PortableTextReactComponents["types"]>;

const renderType = <K extends keyof Types>(
  type: K,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any
) => {
  const Component = portableTextComponents.types![type] as ComponentType<
    Record<string, unknown>
  >;
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Component {...props} />
    </NextIntlClientProvider>
  );
};

describe("portableTextComponents", () => {
  describe("table", () => {
    const baseValue = {
      headers: ["Landmark", "Index"],
      rows: [
        { _key: "r1", cells: ["Nose tip", "1"] },
        { _key: "r2", cells: ["Chin", "152"] },
      ],
    };

    it("renders headers in a thead and rows in a tbody", () => {
      renderType("table", { value: baseValue });

      expect(
        screen.getByRole("columnheader", { name: "Landmark" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: "Index" })
      ).toBeInTheDocument();

      const cells = screen.getAllByRole("cell");
      expect(cells.map((c) => c.textContent)).toEqual([
        "Nose tip",
        "1",
        "Chin",
        "152",
      ]);
    });

    it("renders an optional caption inside a figcaption", () => {
      renderType("table", {
        value: { ...baseValue, caption: "Quick lookup" },
      });

      expect(
        screen.getByText("Quick lookup", { selector: "figcaption" })
      ).toBeInTheDocument();
    });

    it("returns null when headers are missing", () => {
      renderType("table", {
        value: { rows: baseValue.rows },
      });
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("returns null when rows are missing", () => {
      renderType("table", {
        value: { headers: baseValue.headers },
      });
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("does not crash when a row has no cells", () => {
      renderType("table", {
        value: {
          headers: ["A", "B"],
          rows: [{ _key: "r1", cells: ["x", "y"] }, { _key: "r2" }],
        },
      });

      expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 rows
      expect(screen.getAllByRole("cell")).toHaveLength(2);
    });
  });

  describe("embed", () => {
    it("forwards iframe values to the EmbedBlock", async () => {
      renderType("embed", {
        value: {
          type: "iframe",
          url: "https://demos.sanderdesnaijer.com/face-mesh-explorer",
          caption: "Explorer",
          height: "70vh",
        },
      });

      const iframe = (await screen.findByTitle(
        "Explorer"
      )) as HTMLIFrameElement;
      expect(iframe.getAttribute("src")).toBe(
        "https://demos.sanderdesnaijer.com/face-mesh-explorer"
      );
    });
  });
});
