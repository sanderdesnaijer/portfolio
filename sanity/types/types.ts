export interface TextBlock {
  _type: "block";
  _key: string;
  children: Array<{
    _type: "span";
    text: string;
    marks: string[];
  }>;
  style: string;
}

export interface ImageBlock {
  _type: "image";
  _key: string;
  asset: {
    _ref: string;
    _type: string;
  };
  alt?: string;
}

export interface CodeBlock {
  _type: "codeBlock";
  _key: string;
  code: string;
  language?: string;
}

export interface EmbedBlock {
  _type: "embed";
  _key: string;
  type: "component" | "iframe";
  componentId?: string;
  url?: string;
  caption?: string;
  height?: string;
}

export interface TableBlock {
  _type: "table";
  _key: string;
  caption?: string;
  headers: string[];
  rows: Array<{ _key: string; cells: string[] }>;
}

export interface YouTubeBlock {
  _type: "youTube";
  _key: string;
  url: string;
}

export type Block =
  | TextBlock
  | ImageBlock
  | CodeBlock
  | EmbedBlock
  | TableBlock
  | YouTubeBlock;

export interface IconLink {
  title: string;
  link: string;
  icon: string;
}
