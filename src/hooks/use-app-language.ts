"use client";

import { useEffect, useState } from "react";

import {
  AppLanguage,
  DEFAULT_LANGUAGE,
  isAppLanguage,
  LANGUAGE_STORAGE_KEY,
} from "@/lib/i18n";

const LANGUAGE_CHANGED_EVENT = "before-trash:language-changed";

export function useAppLanguage() {
  const [language, setLanguageState] = useState<AppLanguage>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    function syncFromStorage() {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

      if (stored && isAppLanguage(stored)) {
        setLanguageState(stored);
        document.documentElement.lang = stored;
        document.documentElement.dir = stored === "ar" ? "rtl" : "ltr";
      } else {
        setLanguageState(DEFAULT_LANGUAGE);
        document.documentElement.lang = DEFAULT_LANGUAGE;
        document.documentElement.dir = DEFAULT_LANGUAGE === "ar" ? "rtl" : "ltr";
      }
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === LANGUAGE_STORAGE_KEY) {
        syncFromStorage();
      }
    }

    function handleLocalLanguageUpdate() {
      syncFromStorage();
    }

    syncFromStorage();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(LANGUAGE_CHANGED_EVENT, handleLocalLanguageUpdate);
    setMounted(true);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(LANGUAGE_CHANGED_EVENT, handleLocalLanguageUpdate);
    };
  }, []);

  function setLanguage(nextLanguage: AppLanguage) {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = nextLanguage === "ar" ? "rtl" : "ltr";
    window.dispatchEvent(new Event(LANGUAGE_CHANGED_EVENT));
  }

  return { language, setLanguage, mounted };
}
