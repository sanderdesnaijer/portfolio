import { AbstractIntlMessages } from "next-intl";
import translations from "../translations/en.json";

export type MockTranslations = typeof translations;

export const getTranslationKey = (key: keyof MockTranslations): string => {
  return ((translations as AbstractIntlMessages)[key] || key) as string;
};
