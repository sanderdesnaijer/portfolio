import { AbstractIntlMessages } from "next-intl";
import translations from "../../messages/en.json";

export type MockTranslations = typeof translations;

export const getTranslationKey = (
  key: keyof MockTranslations | string,
  messages: AbstractIntlMessages = translations
): string => {
  return key.split(".").reduce<AbstractIntlMessages | string>((obj, part) => {
    if (obj && typeof obj === "object" && part in obj) {
      return obj[part];
    }
    return key;
  }, messages) as string;
};
