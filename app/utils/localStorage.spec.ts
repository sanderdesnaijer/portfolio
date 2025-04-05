import {
  getLocalStorage,
  setLocalStorage,
  localStorageChangeEvent,
} from "./localStorage";

describe("localStorage utility functions", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("getLocalStorage", () => {
    it("should return the default value if the key does not exist", () => {
      const result = getLocalStorage("nonexistent_key", "default");
      expect(result).toBe("default");
    });

    it("should return the stored value if the key exists", () => {
      localStorage.setItem(
        "test_key",
        JSON.stringify({ value: "stored_value" })
      );
      const result = getLocalStorage("test_key", "default");
      expect(result).toBe("stored_value");
    });

    it("should return the default value if the stored item is expired", () => {
      const expiredItem = {
        value: "expired_value",
        expiry: new Date().getTime() - 1000, // Expired 1 second ago
      };
      localStorage.setItem("test_key", JSON.stringify(expiredItem));
      const result = getLocalStorage("test_key", "default");
      expect(result).toBe("default");
      expect(localStorage.getItem("test_key")).toBeNull();
    });

    it("should return the default value if the stored item is invalid JSON", () => {
      localStorage.setItem("test_key", "invalid_json");
      const result = getLocalStorage("test_key", "default");
      expect(result).toBe("default");
    });
  });

  describe("setLocalStorage", () => {
    it("should store the value in localStorage", () => {
      setLocalStorage("test_key", "stored_value");
      const storedItem = JSON.parse(localStorage.getItem("test_key")!);
      expect(storedItem.value).toBe("stored_value");
      expect(storedItem.expiry).toBeNull();
    });

    it("should store the value with an expiry if expiryInDays is provided", () => {
      const expiryInDays = 1;
      const now = new Date().getTime();
      setLocalStorage("test_key", "stored_value", { expiryInDays });
      const storedItem = JSON.parse(localStorage.getItem("test_key")!);
      expect(storedItem.value).toBe("stored_value");
      expect(storedItem.expiry).toBeGreaterThan(now);
    });

    it("should dispatch a localStorageChangeEvent when a value is set", () => {
      const eventListener = jest.fn();
      window.addEventListener(localStorageChangeEvent, eventListener);

      setLocalStorage("test_key", "stored_value");
      expect(eventListener).toHaveBeenCalledTimes(1);

      window.removeEventListener(localStorageChangeEvent, eventListener);
    });
  });
});
