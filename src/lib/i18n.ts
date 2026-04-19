export const SUPPORTED_LANGUAGES = ["en", "es", "hi", "zh", "ar", "fr", "pt"] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: AppLanguage = "es";

export const LANGUAGE_STORAGE_KEY = "before-trash-language";

export type LanguageOption = {
  value: AppLanguage;
  label: string;
  countryCode: string;
};

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "en", label: "English", countryCode: "US" },
  { value: "es", label: "Español", countryCode: "ES" },
  { value: "hi", label: "हिन्दी", countryCode: "IN" },
  { value: "zh", label: "中文", countryCode: "CN" },
  { value: "ar", label: "العربية", countryCode: "SA" },
  { value: "fr", label: "Français", countryCode: "FR" },
  { value: "pt", label: "Português", countryCode: "PT" },
];

const LANGUAGE_PROMPT_NAMES: Record<AppLanguage, string> = {
  en: "English",
  es: "Spanish",
  hi: "Hindi",
  zh: "Chinese",
  ar: "Arabic",
  fr: "French",
  pt: "Portuguese",
};

export function isAppLanguage(value: string): value is AppLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function getPromptLanguageName(language: AppLanguage): string {
  return LANGUAGE_PROMPT_NAMES[language];
}
