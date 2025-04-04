"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  getLocalStorage,
  KEY_COOKIE_CONSENT,
  setLocalStorage,
} from "../utils/localStorage";

export default function CookieBanner() {
  const hasConsentLocal = getLocalStorage(KEY_COOKIE_CONSENT, null);
  const [cookieConsent, setCookieConsent] = useState(() => hasConsentLocal);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const newValue = cookieConsent ? "granted" : "denied";

    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: newValue,
      });
    }
  }, [cookieConsent]);

  const onChangeConsent = (isConsent: boolean) => {
    setCookieConsent(isConsent);
    setLocalStorage(KEY_COOKIE_CONSENT, isConsent);
  };

  const t = useTranslations("consent");

  if (!isMounted || cookieConsent === true || cookieConsent === false) {
    return null;
  }

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-20 mx-auto my-10 flex max-w-max flex-col items-center justify-between gap-4 rounded-lg bg-gray-700 px-3 py-3 shadow sm:flex-row md:max-w-screen-sm md:px-4`}
    >
      <div className="text-center">
        <Link href="/info/cookies">
          <p className="text-white">{t("message")}</p>
        </Link>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onChangeConsent(false)}
          className="rounded-md border-gray-900 px-5 py-2 text-gray-300"
        >
          {t("decline")}
        </button>
        <button
          onClick={() => onChangeConsent(true)}
          className="rounded-lg bg-gray-900 px-5 py-2 whitespace-nowrap text-white"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
