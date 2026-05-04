"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "novamente-metas-config-v1";

export type DietId =
  | "padrao"
  | "equilibrado"
  | "pobre-gorduras"
  | "rico-proteina"
  | "cetogenica"
  | "personalizar";

export type Macros = {
  carbs: number;
  protein: number;
  fat: number;
};

export type MetasConfig = {
  maintenanceCalories: number;
  useRecommendedCalories: boolean;
  recommendedAdjustmentPct: number;
  manualAdjustmentPct: number;
  dietId: DietId;
  dietLabel: string;
  macros: Macros;
};

export const defaultMetasConfig: MetasConfig = {
  maintenanceCalories: 2471,
  useRecommendedCalories: true,
  recommendedAdjustmentPct: -20,
  manualAdjustmentPct: -20,
  dietId: "padrao",
  dietLabel: "Padrao",
  macros: {
    carbs: 50,
    protein: 20,
    fat: 30
  }
};

function round(value: number) {
  return Math.round(value);
}

function parseSafe(json: string | null): MetasConfig | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as Partial<MetasConfig>;
    if (!parsed || typeof parsed !== "object") return null;

    return {
      maintenanceCalories:
        Number.isFinite(parsed.maintenanceCalories) && (parsed.maintenanceCalories ?? 0) > 0
          ? Number(parsed.maintenanceCalories)
          : defaultMetasConfig.maintenanceCalories,
      useRecommendedCalories:
        typeof parsed.useRecommendedCalories === "boolean"
          ? parsed.useRecommendedCalories
          : defaultMetasConfig.useRecommendedCalories,
      recommendedAdjustmentPct:
        Number.isFinite(parsed.recommendedAdjustmentPct)
          ? Number(parsed.recommendedAdjustmentPct)
          : defaultMetasConfig.recommendedAdjustmentPct,
      manualAdjustmentPct:
        Number.isFinite(parsed.manualAdjustmentPct)
          ? Number(parsed.manualAdjustmentPct)
          : defaultMetasConfig.manualAdjustmentPct,
      dietId: (parsed.dietId as DietId) ?? defaultMetasConfig.dietId,
      dietLabel: typeof parsed.dietLabel === "string" ? parsed.dietLabel : defaultMetasConfig.dietLabel,
      macros: {
        carbs: Number.isFinite(parsed.macros?.carbs) ? Number(parsed.macros?.carbs) : defaultMetasConfig.macros.carbs,
        protein: Number.isFinite(parsed.macros?.protein)
          ? Number(parsed.macros?.protein)
          : defaultMetasConfig.macros.protein,
        fat: Number.isFinite(parsed.macros?.fat) ? Number(parsed.macros?.fat) : defaultMetasConfig.macros.fat
      }
    };
  } catch {
    return null;
  }
}

export function getEffectiveAdjustmentPct(config: MetasConfig) {
  return config.useRecommendedCalories ? config.recommendedAdjustmentPct : config.manualAdjustmentPct;
}

export function getTargetCalories(config: MetasConfig) {
  const adjustment = getEffectiveAdjustmentPct(config);
  return round(config.maintenanceCalories * (1 + adjustment / 100));
}

export function getMacroKcal(targetCalories: number, macros: Macros) {
  return {
    carbs: round((targetCalories * macros.carbs) / 100),
    protein: round((targetCalories * macros.protein) / 100),
    fat: round((targetCalories * macros.fat) / 100)
  };
}

export function getMacroGrams(kcal: { carbs: number; protein: number; fat: number }) {
  return {
    carbs: round(kcal.carbs / 4),
    protein: round(kcal.protein / 4),
    fat: round(kcal.fat / 9)
  };
}

export function useMetasConfig() {
  const [config, setConfig] = useState<MetasConfig>(defaultMetasConfig);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = parseSafe(window.localStorage.getItem(STORAGE_KEY));
    if (stored) setConfig(stored);
    setHydrated(true);
  }, []);

  const commit = useCallback((next: MetasConfig) => {
    setConfig((prev) => {
      const updated = { ...prev, ...next };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const patchConfig = useCallback(
    (patch: Partial<MetasConfig>) => {
      setConfig((prev) => {
        const updated = { ...prev, ...patch };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const patchMacros = useCallback(
    (macros: Macros) => {
      setConfig((prev) => {
        const updated = { ...prev, macros };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const derived = useMemo(() => {
    const targetCalories = getTargetCalories(config);
    const macroKcal = getMacroKcal(targetCalories, config.macros);
    const macroGrams = getMacroGrams(macroKcal);
    const macroTotalPct = config.macros.carbs + config.macros.protein + config.macros.fat;

    return {
      targetCalories,
      macroKcal,
      macroGrams,
      macroTotalPct
    };
  }, [config]);

  return {
    config,
    hydrated,
    patchConfig,
    patchMacros,
    setConfig: commit,
    derived
  };
}
