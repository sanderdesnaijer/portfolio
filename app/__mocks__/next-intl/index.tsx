import React from "react";
import { getTranslationKey, MockTranslations } from "../../test-utils/i18n";

export const useTranslations = jest.fn().mockImplementation(() => {
  return (key: keyof MockTranslations) => {
    return getTranslationKey(key);
  };
});

export const NextIntlClientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div>{children}</div>;
};
