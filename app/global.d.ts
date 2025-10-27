import { formats } from "@/i18n/request";
import en from "./translations/en.json";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof en;
    Formats: typeof formats;
  }
}

// SVG module declarations
declare module "*.svg" {
  import React from "react";
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module "*.svg?url" {
  const content: string;
  export default content;
}
