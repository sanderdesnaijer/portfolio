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

declare module "*.svg" {
  const content: string; // For static <img src> usage
  export default content;

  import * as React from "react";
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export { ReactComponent as Raw }; // Optional: Fallback to raw SVG string if needed
}

declare module "*.svg?url" {
  const content: string;
  export default content;
}

declare module "*.svg?inline" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}
