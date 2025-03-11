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
            className={`${montserrat.variable} overflow-x-hidden antialiased transition-colors duration-200`}
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
