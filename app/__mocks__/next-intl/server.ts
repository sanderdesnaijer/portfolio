import * as React from "react";
import { getTranslationKey, MockTranslations } from "@/app/test-utils/i18n";

function createMockTranslator() {
  const t = (key: keyof MockTranslations | string) => getTranslationKey(key);
  const rich = (
    key: keyof MockTranslations | string,
    parts?: Record<string, (chunks: React.ReactNode) => React.ReactNode>
  ) => {
    const raw = getTranslationKey(key);
    const segments = raw.split(/(<[a-z]+>.*?<\/[a-z]+>)/i);
    return React.createElement(
      React.Fragment,
      null,
      ...segments.map((segment, index) => {
        const match = segment.match(/^<([a-z]+)>(.*)<\/\1>$/i);
        if (match && parts?.[match[1]]) {
          return React.createElement(
            React.Fragment,
            { key: index },
            parts[match[1]](match[2])
          );
        }
        return segment;
      })
    );
  };
  return Object.assign(t, { rich });
}

const getTranslations = jest.fn().mockResolvedValue(createMockTranslator());

const getLocale = jest.fn().mockResolvedValue(() => {
  return "en";
});

module.exports = {
  getTranslations,
  getLocale,
  getMessages: getTranslations,
};
