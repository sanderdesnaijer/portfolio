export const KEY_COOKIE_CONSENT = "cookie_consent";
export const localStorageChangeEvent = "local-storage-change";

export function getLocalStorage(key: string, defaultValue: unknown) {
  const itemStr =
    typeof window !== "undefined" ? localStorage.getItem(key) : null;

  if (!itemStr) return defaultValue;

  try {
    const item = JSON.parse(itemStr);
    if (item.expiry && new Date().getTime() > item.expiry) {
      localStorage.removeItem(key);
      return defaultValue;
    }
    return item.value ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setLocalStorage(
  key: string,
  value: unknown,
  options?: {
    expiryInDays?: number;
  }
) {
  const item = {
    value,
    expiry: options?.expiryInDays
      ? Date.now() + options.expiryInDays * 24 * 60 * 60 * 1000
      : null,
  };

  localStorage.setItem(key, JSON.stringify(item));
  window.dispatchEvent(new Event(localStorageChangeEvent));
}
