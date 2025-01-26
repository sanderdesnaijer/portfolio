export interface SocialMediaSanity {
  title: string;
  link: string;
  icon: string;
}

interface Block {
  _type: "block";
  children: Array<{
    _type: "span";
    text: string;
    marks: string[];
  }>;
  style: string;
}

export interface PageSanity {
  name: string;
  title: string;
  description: string;
  slug: {
    _type: "slug";
    current: string;
  };
  mainImage: {
    _type: "image";
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
  publishedAt: string;
  body: Block[];
  imageAlt: string;
  imageURL: string;
}

export interface SettingSanity {
  title: string;
  description: string;
  socialMedia: SocialMediaSanity[];
}
