"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";

export function getLocalStorage(key: string, defaultValue: unknown) {
  const stickyValue =
    typeof window !== "undefined" ? localStorage.getItem(key) : null;

  return stickyValue !== null && stickyValue !== "undefined"
    ? JSON.parse(stickyValue)
    : defaultValue;
}

export function setLocalStorage(key: string, value: unknown) {
  // TODO: set expiry
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("local-storage-change"));
}

export default function CookieBanner() {
  const hasConsentLocal = getLocalStorage("cookie_consent", null);
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
    setLocalStorage("cookie_consent", isConsent);
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
          className="rounded-lg bg-gray-900 px-5 py-2 text-white"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
