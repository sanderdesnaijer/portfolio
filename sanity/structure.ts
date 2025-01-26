import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio")
    .items([
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["post", "category", "setting"].includes(item.getId()!)
      ),
      S.documentTypeListItem("post").title("Posts"),
      S.documentTypeListItem("category").title("Categories"),
      S.divider(),
      S.documentTypeListItem("setting").title("Settings"),
    ]);
