"use server";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import envConfig from "@/envConfig";
import { ConsentWrapper } from "./components/ConsentWrapper";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["200", "400", "700"],
});

if (envConfig.isMockApi === true) {
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${montserrat.variable} overflow-x-hidden antialiased transition-colors duration-200`}
      >
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ConsentWrapper>{children}</ConsentWrapper>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
