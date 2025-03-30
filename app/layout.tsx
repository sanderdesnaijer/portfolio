"use server";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import envConfig from "@/envConfig";
import { GoogleAnalytics } from "@next/third-parties/google";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["200", "400", "700"],
});

if (envConfig.isMockApi) {
  import("./mock").then(({ setupMocks }) => {
    setupMocks();
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${montserrat.variable} overflow-x-hidden antialiased transition-colors duration-200`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        {envConfig.googleAnalytics &&
          process.env.NODE_ENV !== "development" &&
          !envConfig.isMockApi && (
            <GoogleAnalytics gaId={envConfig.googleAnalytics} />
          )}
      </body>
    </html>
  );
}
