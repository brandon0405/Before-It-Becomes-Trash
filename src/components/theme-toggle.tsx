"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";

import { useAppLanguage } from "@/hooks/use-app-language";
import type { AppLanguage } from "@/lib/i18n";

type ThemeMode = "system" | "light" | "dark";

type ThemeOption = {
  value: ThemeMode;
  label: string;
};

const THEME_LABELS: Record<
  AppLanguage,
  {
    chip: string;
    aria: string;
    loading: string;
    system: string;
    light: string;
    dark: string;
    systemLight: string;
    systemDark: string;
  }
> = {
  en: {
    chip: "Theme",
    aria: "Select theme",
    loading: "Theme...",
    system: "System",
    light: "Light",
    dark: "Dark",
    systemLight: "Light",
    systemDark: "Dark",
  },
  es: {
    chip: "Tema",
    aria: "Seleccionar tema",
    loading: "Tema...",
    system: "Sistema",
    light: "Claro",
    dark: "Oscuro",
    systemLight: "Claro",
    systemDark: "Oscuro",
  },
  hi: {
    chip: "थीम",
    aria: "थीम चुनें",
    loading: "थीम...",
    system: "सिस्टम",
    light: "हल्का",
    dark: "गहरा",
    systemLight: "हल्का",
    systemDark: "गहरा",
  },
  zh: {
    chip: "主题",
    aria: "选择主题",
    loading: "主题...",
    system: "系统",
    light: "浅色",
    dark: "深色",
    systemLight: "浅色",
    systemDark: "深色",
  },
  ar: {
    chip: "المظهر",
    aria: "اختر المظهر",
    loading: "المظهر...",
    system: "النظام",
    light: "فاتح",
    dark: "داكن",
    systemLight: "فاتح",
    systemDark: "داكن",
  },
  fr: {
    chip: "Theme",
    aria: "Choisir le theme",
    loading: "Theme...",
    system: "Systeme",
    light: "Clair",
    dark: "Sombre",
    systemLight: "Clair",
    systemDark: "Sombre",
  },
  pt: {
    chip: "Tema",
    aria: "Selecionar tema",
    loading: "Tema...",
    system: "Sistema",
    light: "Claro",
    dark: "Escuro",
    systemLight: "Claro",
    systemDark: "Escuro",
  },
};

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { language } = useAppLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedTheme: ThemeMode =
    theme === "light" || theme === "dark" || theme === "system" ? theme : "system";
  const labels = THEME_LABELS[language];
  const effectiveThemeLabel = resolvedTheme === "dark" ? labels.systemDark : labels.systemLight;
  const options: ThemeOption[] = useMemo(
    () => [
      { value: "system", label: `${labels.system} (${effectiveThemeLabel})` },
      { value: "light", label: labels.light },
      { value: "dark", label: labels.dark },
    ],
    [effectiveThemeLabel, labels.dark, labels.light, labels.system],
  );
  const selectedOption = options.find((option) => option.value === selectedTheme) ?? options[0];

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

  function handleThemeChange(value: ThemeMode) {
    setTheme(value);
    setOpen(false);
  }

  function ThemeModeIcon({ mode }: { mode: ThemeMode }) {
    if (mode === "light") {
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5V5" />
          <path d="M12 19v2.5" />
          <path d="M4.9 4.9 6.7 6.7" />
          <path d="m17.3 17.3 1.8 1.8" />
          <path d="M2.5 12H5" />
          <path d="M19 12h2.5" />
          <path d="m4.9 19.1 1.8-1.8" />
          <path d="m17.3 6.7 1.8-1.8" />
        </svg>
      );
    }

    if (mode === "dark") {
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <path d="M20.5 14.8A8.5 8.5 0 1 1 9.2 3.5a7 7 0 1 0 11.3 11.3Z" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <rect x="3.5" y="4" width="17" height="12" rx="1.8" />
        <path d="M8 20h8" />
        <path d="M10.5 16v4" />
        <path d="M13.5 16v4" />
      </svg>
    );
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
          <span className="inline-flex h-4 w-4 items-center justify-center text-emerald-700 dark:text-slate-300">
            <ThemeModeIcon mode={selectedOption.value} />
          </span>
          <span className="flex-1 truncate">{selectedOption.label}</span>
          <span className="text-emerald-700 dark:text-slate-300">▾</span>
        </button>

        {open ? (
          <ul
            role="listbox"
            className="absolute right-0 z-30 mt-2 w-full rounded-2xl border border-emerald-200 bg-white/95 p-1 shadow-xl backdrop-blur dark:border-slate-600 dark:bg-slate-900/95"
          >
            {options.map((option) => {
              const active = option.value === selectedTheme;

              return (
                <li key={option.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => handleThemeChange(option.value)}
                    className={`inline-flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs transition ${
                      active
                        ? "bg-emerald-100/90 font-semibold text-emerald-900 dark:bg-slate-800 dark:text-slate-100"
                        : "text-emerald-900 hover:bg-emerald-50 dark:text-slate-100 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <span className="inline-flex h-4 w-4 items-center justify-center text-emerald-700 dark:text-slate-300">
                      <ThemeModeIcon mode={option.value} />
                    </span>
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
