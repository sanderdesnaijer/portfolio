import { getTranslationKey, MockTranslations } from "@/app/test-utils/i18n";

const getTranslations = jest
  .fn()
  .mockResolvedValue((key: keyof MockTranslations) => {
    return getTranslationKey(key);
  });

const getLocale = jest.fn().mockResolvedValue(() => {
  return "en";
});

module.exports = {
  getTranslations,
  getLocale,
  getMessages: getTranslations,
};
