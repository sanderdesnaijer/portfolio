import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Menu from "./components/Menu";
import IntlProvider from "./components/IntlProvider"; // Updated import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Menu />
            {children}
          </body>
        </html>
      )}
    </IntlProvider>
  );
}
