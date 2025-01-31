import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

export const AppWrapper: React.FC<{
  children: React.ReactNode;
  messages?: AbstractIntlMessages | undefined;
  locale?: string | undefined;
}> = ({ children, messages, locale }) => {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
};
