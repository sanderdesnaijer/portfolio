import "server-only";

const dictionaries = {
  en: () => import("../translations/en.json").then((module) => module.default),
};

export const getTranslations = async () => dictionaries.en();
