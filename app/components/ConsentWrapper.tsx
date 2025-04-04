"use client";
import envConfig from "@/envConfig";
import Script from "next/script";
import { useState, useEffect } from "react";
import CookieBanner from "./CookieBanner";
import { usePathname } from "next/navigation";
import {
  getLocalStorage,
  KEY_COOKIE_CONSENT,
  localStorageChangeEvent,
} from "../utils/localStorage";

export const pageview = (GA_MEASUREMENT_ID: string, url: string) => {
  if (window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

export function ConsentWrapper({ children }: { children: React.ReactNode }) {
  const [consentGiven, setConsentGiven] = useState(() =>
    getLocalStorage(KEY_COOKIE_CONSENT, null)
  );

  useEffect(() => {
    const handleChange = () => {
      const localStorageValue = getLocalStorage(KEY_COOKIE_CONSENT, null);
      setConsentGiven(localStorageValue);
    };

    window.addEventListener(localStorageChangeEvent, handleChange);
    return () => {
      window.removeEventListener(localStorageChangeEvent, handleChange);
    };
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchParamsString = searchParams.toString();
    const url = pathname + (searchParamsString ? `?${searchParamsString}` : "");

    if (envConfig.googleAnalytics && consentGiven && !envConfig.isMockApi) {
      pageview(envConfig.googleAnalytics, url);
    }
  }, [consentGiven, pathname]);

  // const isProd = process.env.NODE_ENV !== "development" && !envConfig.isMockApi;
  const isDebugMode = process.env.NODE_ENV !== "production";

  return (
    <>
      {consentGiven && envConfig.googleAnalytics && !envConfig.isMockApi && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${envConfig.googleAnalytics}`}
          strategy="afterInteractive"
        />
      )}
      {consentGiven && envConfig.googleAnalytics && !envConfig.isMockApi && (
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
