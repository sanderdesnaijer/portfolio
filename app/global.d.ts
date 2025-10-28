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
