import { PageSanity } from "@/sanity/types";

export const mockPage: PageSanity = {
  title: "My page",
  imageAlt: "Profile Picture",
  imageURL: "mock-image-url",
  body: [
    {
      _type: "block",
      children: [
        {
          text: "Mock body content",
          _type: "span",
          marks: [],
        },
      ],
      style: "",
    },
  ],
  name: "",
  description: "",
  slug: {
    _type: "slug",
    current: "",
  },
  mainImage: {
    _type: "image",
    asset: {
      _ref: "",
      _type: "",
    },
    alt: undefined,
  },
  publishedAt: "",
  _id: "page-1",
  _rev: "",
  _type: "",
  _createdAt: "",
  _updatedAt: "",
};
