"use client";
import envConfig from "@/envConfig";
import Script from "next/script";
import { useState, useEffect } from "react";
import CookieBanner, { getLocalStorage } from "./CookieBanner";
import { usePathname, useSearchParams } from "next/navigation";

export const pageview = (GA_MEASUREMENT_ID: string, url: string) => {
  if (window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Component to handle Google Analytics loading based on consent
 */
export function ConsentWrapper({ children }: { children: React.ReactNode }) {
  const [consentGiven, setConsentGiven] = useState(() =>
    getLocalStorage("cookie_consent", null)
  );

  useEffect(() => {
    const handleChange = () => {
      const localStorageValue = getLocalStorage("cookie_consent", null);
      setConsentGiven(localStorageValue);
    };

    window.addEventListener("local-storage-change", handleChange);
    window.removeEventListener("local-storage-change", handleChange);
  }, []);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();

    if (envConfig.googleAnalytics) {
      pageview(envConfig.googleAnalytics, url);
    }
  }, [pathname, searchParams]);

  const isProd = process.env.NODE_ENV !== "development" && !envConfig.isMockApi;
  return (
    <>
      {consentGiven && envConfig.googleAnalytics && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${envConfig.googleAnalytics}`}
          strategy="afterInteractive"
        />
      )}
      {envConfig.googleAnalytics && (
        <Script id="google-analytics" strategy="afterInteractive">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${envConfig.googleAnalytics}', {
                  page_path: window.location.pathname,
                  debug_mode: true
              });
            `}
        </Script>
      )}
      {children}
      <CookieBanner />
    </>
  );
}
