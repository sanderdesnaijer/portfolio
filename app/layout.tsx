import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import IntlProvider from "./components/IntlProvider";
import { ThemeProvider } from "next-themes";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["200", "400", "700"],
});

export const metadata: Metadata = {
  title: "Portfolio Sander de Snaijer",
  description:
    "Passionate software developer turning creative ideas to functional products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <IntlProvider>
      {(locale) => (
        <html lang={locale} suppressHydrationWarning>
          <body
            className={`${montserrat.variable} overflow-x-hidden antialiased`}
          >
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </body>
        </html>
      )}
    </IntlProvider>
  );
}
