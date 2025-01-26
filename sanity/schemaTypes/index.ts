import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { projectType } from "./postType";
import { pagesType } from "./pagesType";
import { settingType } from "./settingType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [pagesType, blockContentType, categoryType, projectType, settingType],
};
