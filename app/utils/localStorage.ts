export const KEY_COOKIE_CONSENT = "cookie_consent";
export const localStorageChangeEvent = "local-storage-change";

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
  window.dispatchEvent(new Event(localStorageChangeEvent));
}
