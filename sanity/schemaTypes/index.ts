import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { linkType } from "./linkType";
import { categoryType } from "./categoryType";
import { projectType } from "./projectType";
import { pageType } from "./pageType";
import { settingType } from "./settingType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    pageType,
    blockContentType,
    linkType,
    categoryType,
    projectType,
    settingType,
  ],
};
