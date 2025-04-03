"use server";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import envConfig from "@/envConfig";
import { ConsentWrapper } from "./components/ConsentWrapper";
import { Suspense } from "react";

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
  const title = "Loading...";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${montserrat.variable} overflow-x-hidden antialiased transition-colors duration-200`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Suspense fallback={<div>{title}</div>}>
              <ConsentWrapper>{children}</ConsentWrapper>
            </Suspense>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
