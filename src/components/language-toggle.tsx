"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";

import { useAppLanguage } from "@/hooks/use-app-language";
import { AppLanguage, LANGUAGE_OPTIONS } from "@/lib/i18n";

const LABELS: Record<AppLanguage, { chip: string; aria: string; loading: string }> = {
  en: { chip: "Language", aria: "Select language", loading: "Language..." },
  es: { chip: "Idioma", aria: "Seleccionar idioma", loading: "Idioma..." },
  hi: { chip: "भाषा", aria: "भाषा चुनें", loading: "भाषा..." },
  zh: { chip: "语言", aria: "选择语言", loading: "语言..." },
  ar: { chip: "اللغة", aria: "اختر اللغة", loading: "اللغة..." },
  fr: { chip: "Langue", aria: "Choisir la langue", loading: "Langue..." },
  pt: { chip: "Idioma", aria: "Selecionar idioma", loading: "Idioma..." },
};

export function LanguageToggle() {
  const { language, setLanguage, mounted } = useAppLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const labels = LABELS[language];
  const selectedOption = useMemo(
    () => LANGUAGE_OPTIONS.find((option) => option.value === language) ?? LANGUAGE_OPTIONS[0],
    [language],
  );

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSelect(nextLanguage: AppLanguage) {
    setLanguage(nextLanguage);
    setOpen(false);
  }

  if (!mounted) {
    return (
      <div className="rounded-full border border-emerald-300/60 bg-white/70 px-4 py-2 text-xs font-medium text-emerald-900/80 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200/80">
        {labels.loading}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative inline-flex items-center gap-2 rounded-full border border-emerald-300/70 bg-white/80 px-3 py-2 text-xs font-semibold text-emerald-950 shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900"
    >
      <span className="uppercase tracking-[0.16em]">{labels.chip}</span>
      <div className="relative min-w-[148px]">
        <button
          type="button"
          aria-label={labels.aria}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex w-full items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-left text-xs font-semibold text-emerald-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300/70 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-400 dark:focus:ring-slate-500/50"
        >
          <ReactCountryFlag
            aria-hidden
            svg
            countryCode={selectedOption.countryCode}
            style={{ width: "1.05rem", height: "1.05rem", borderRadius: "9999px" }}
          />
          <span className="flex-1 truncate">{selectedOption.label}</span>
          <span className="text-emerald-700 dark:text-slate-300">▾</span>
        </button>

        {open ? (
          <ul
            role="listbox"
            className="absolute right-0 z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-emerald-200 bg-white/95 p-1 shadow-xl backdrop-blur dark:border-slate-600 dark:bg-slate-900/95"
          >
            {LANGUAGE_OPTIONS.map((option) => {
              const active = option.value === language;

              return (
                <li key={option.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`inline-flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs transition ${
                      active
                        ? "bg-emerald-100/90 font-semibold text-emerald-900 dark:bg-slate-800 dark:text-slate-100"
                        : "text-emerald-900 hover:bg-emerald-50 dark:text-slate-100 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <ReactCountryFlag
                      aria-hidden
                      svg
                      countryCode={option.countryCode}
                      style={{ width: "1rem", height: "1rem", borderRadius: "9999px" }}
                    />
                    <span className="truncate">{option.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
