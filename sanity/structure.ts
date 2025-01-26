import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio")
    .items([
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["project", "category", "setting", "job"].includes(item.getId()!)
      ),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("job").title("Experience"),
      S.divider(),
      S.documentTypeListItem("setting").title("Settings"),
    ]);
