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
    current: "page-slug",
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
  _createdAt: "2025-01-01",
  _updatedAt: "2025-01-02",
};

const mockPage2: PageSanity = {
  title: "My page 2",
  imageAlt: "Page 2 Picture",
  imageURL: "mock-image-url",
  body: [
    {
      _type: "block",
      children: [
        {
          text: "Mock body content page 2",
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
    current: "page2-slug",
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
  _id: "page-2",
  _rev: "",
  _type: "",
  _createdAt: "",
  _updatedAt: "",
};

export const mockPages: PageSanity[] = [mockPage, mockPage2];
