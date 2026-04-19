"use client";

import { useEffect, useState } from "react";

import type { RescueAssessment, RescueLogEntry } from "@/lib/types";

const STORAGE_KEY = "before-it-becomes-trash-log";

function readStoredEntries() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as RescueLogEntry[];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useRescueLog() {
  const [entries, setEntries] = useState<RescueLogEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(readStoredEntries());
    setHydrated(true);
  }, []);

  const persistEntries = (nextEntries: RescueLogEntry[]) => {
    setEntries(nextEntries);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
    } catch {
      // If localStorage is unavailable, keep the in-memory session state working.
    }
  };

  const saveAssessment = (assessment: RescueAssessment) => {
    const nextEntry: RescueLogEntry = {
      ...assessment,
      savedAt: new Date().toISOString(),
    };

    const nextEntries = [nextEntry, ...readStoredEntries()];
    persistEntries(nextEntries);

    return nextEntry;
  };

  return {
    entries,
    hydrated,
    saveAssessment,
  };
}
