import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Menu from "./components/Menu";
import IntlProvider from "./components/IntlProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  style: ["normal"],
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
        <html lang={locale}>
          <body className={`${montserrat.variable} antialiased`}>
            <Menu />
            {children}
          </body>
        </html>
      )}
    </IntlProvider>
  );
}
