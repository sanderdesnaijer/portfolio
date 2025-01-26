export interface Block {
  _type: "block";
  children: Array<{
    _type: "span";
    text: string;
    marks: string[];
  }>;
  style: string;
}

export interface IconLink {
  title: string;
  link: string;
  icon: string;
}
