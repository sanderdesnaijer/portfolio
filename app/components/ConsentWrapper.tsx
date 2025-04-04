"use client";
import envConfig from "@/envConfig";
import Script from "next/script";
import { useState, useEffect } from "react";
import CookieBanner, { getLocalStorage } from "./CookieBanner";
import { usePathname } from "next/navigation";

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
  const [consentGiven, setConsentGiven] = useState(
    () => getLocalStorage("cookie_consent", null) === "true"
  );

  useEffect(() => {
    const handleChange = () => {
      const localStorageValue = getLocalStorage("cookie_consent", null);
      setConsentGiven(localStorageValue);
    };

    window.addEventListener("local-storage-change", handleChange);
    return () => {
      window.removeEventListener("local-storage-change", handleChange);
    };
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchParamsString = searchParams.toString();
    const url = pathname + (searchParamsString ? `?${searchParamsString}` : "");

    if (envConfig.googleAnalytics && consentGiven) {
      pageview(envConfig.googleAnalytics, url);
    }
  }, [consentGiven, pathname]);

  // const isProd = process.env.NODE_ENV !== "development" && !envConfig.isMockApi;
  const isDebugMode = process.env.NODE_ENV !== "production";

  return (
    <>
      {consentGiven && envConfig.googleAnalytics && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${envConfig.googleAnalytics}`}
          strategy="afterInteractive"
        />
      )}
      {consentGiven && envConfig.googleAnalytics && (
        <Script id="google-analytics" strategy="afterInteractive">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${envConfig.googleAnalytics}', {
                  page_path: window.location.pathname,
                  debug_mode: ${isDebugMode}
              });
            `}
        </Script>
      )}
      {children}
      <CookieBanner />
    </>
  );
}
