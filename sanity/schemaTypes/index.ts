import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { linkType } from "./linkType";
import { projectType } from "./projectType";
import { pageType } from "./pageType";
import { settingType } from "./settingType";
import { jobType } from "./jobType";
import { tagType } from "./tagType";
import { blogType } from "./blogType";
import { youTubeType } from "./youTubeType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    pageType,
    blockContentType,
    linkType,
    projectType,
    settingType,
    jobType,
    tagType,
    blogType,
    youTubeType,
  ],
};
