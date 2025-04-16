import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio")
    .items([
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["project", "setting", "job", "tag", "blogPost"].includes(
            item.getId()!
          )
      ),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("job").title("Experience"),
      S.documentTypeListItem("tag").title("Tags"),
      S.documentTypeListItem("blogPost").title("Medium articles"),
      S.divider(),
      S.documentTypeListItem("setting").title("Settings"),
    ]);
