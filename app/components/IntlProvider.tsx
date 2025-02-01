import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export default async function IntlProvider({
  children,
}: {
  children: (locale: string) => React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children(locale)}
    </NextIntlClientProvider>
  );
}
