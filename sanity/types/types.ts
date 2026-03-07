export interface TextBlock {
  _type: "block";
  children: Array<{
    _type: "span";
    text: string;
    marks: string[];
  }>;
  style: string;
}

export interface ImageBlock {
  _type: "image";
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

export type Block = TextBlock | ImageBlock | CodeBlock;

export interface IconLink {
  title: string;
  link: string;
  icon: string;
}
