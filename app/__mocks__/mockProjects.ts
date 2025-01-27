import { ProjectTypeSanity } from "@/sanity/types";
import { Block } from "@/sanity/types/types";

export const mockProject: ProjectTypeSanity = {
  _id: "1",
  title: "Project 1",
  _createdAt: "2025-01-01",
  slug: { _type: "slug", current: "/project-1" },
  imageURL: "http://mocked-image-url.com/image1.jpg",
  mainImage: {
    _type: "image",
    alt: "Project 1 Image Alt",
    asset: { _ref: "string", _type: "ref" },
  },
  body: [
    { children: [{ text: "This is a project body", _type: "span" }] },
  ] as Block[],
  links: [
    { title: "GitHub", icon: "github", link: "http://test" },
    { title: "Live Demo", icon: "external-link", link: "http://test" },
  ],
  publishedAt: "",
  _updatedAt: "",
  _rev: "",
  _type: "",
};

export const mockProjects: ProjectTypeSanity[] = [
  {
    _id: "1",
    title: "Project 1",
    _createdAt: "2025-01-01",
    slug: { _type: "slug", current: "/project-1" },
    imageURL: "http://mocked-image-url.com/image1.jpg",
    mainImage: {
      _type: "image",
      alt: "Project 1 Image Alt",
      asset: { _ref: "string", _type: "ref" },
    },
    body: [
      { children: [{ text: "This is a project body", _type: "span" }] },
    ] as Block[],
    links: [
      { title: "GitHub", icon: "github", link: "http://test" },
      { title: "Live Demo", icon: "external-link", link: "http://test" },
    ],
    publishedAt: "",
    _updatedAt: "",
    _rev: "",
    _type: "",
  },
  {
    _id: "2",
    title: "Project 2",
    _createdAt: "2025-01-02",
    slug: { current: "/project-2", _type: "slug" },
    imageURL: "http://mocked-image-url.com/image2.jpg",
    mainImage: {
      _type: "image",
      alt: "Project 2 Image Alt",
      asset: { _ref: "string", _type: "ref" },
    },
    body: null!,
    links: [],
    publishedAt: "",
    _updatedAt: "",
    _rev: "",
    _type: "",
  },
];
