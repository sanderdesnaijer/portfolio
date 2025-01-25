import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
import { pagesType } from "./pagesType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [pagesType, blockContentType, categoryType, postType, authorType],
};
