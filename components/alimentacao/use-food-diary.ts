"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type MealKey = "breakfast" | "lunch" | "dinner" | "snacks";

export interface FoodEntry {
  id: string;
  mealKey: MealKey;
  name: string;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  foodDate: string;
  createdAt: string;
}

export interface FoodDiaryState {
  entries: FoodEntry[];
  waterMl: number;
  loading: boolean;
}

export type TaskArea = "Casa" | "Trabalho" | "Treino" | "Estudo" | "Saúde" | "Outro";
export type TaskPriority = "Normal" | "Alta" | "Essencial";

export interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  area: TaskArea;
  priority: TaskPriority;
  icon: string;
  done: boolean;
  taskDate: string;
  createdAt: string;
  completedAt?: string;
  userId?: string;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getDayOfWeekName(date: Date): string {
  const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  return days[date.getDay()];
}

const mealLabels: Record<MealKey, string> = {
  breakfast: "Café da manhã",
  lunch: "Almoço",
  dinner: "Jantar",
  snacks: "Lanches",
};

const mealIcons: Record<MealKey, string> = {
  breakfast: "wb_twilight",
  lunch: "light_mode",
  dinner: "dark_mode",
  snacks: "cookie",
};

export function useFoodDiary() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [waterMl, setWaterMl] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchDiary = useCallback(async (date: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const [foodResult, waterResult] = await Promise.all([
        supabase
          .from("food_diary")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("food_date", date)
          .order("created_at", { ascending: true }),
        supabase
          .from("water_intake")
          .select("amount_ml")
          .eq("user_id", session.user.id)
          .eq("water_date", date)
          .order("created_at", { ascending: false })
          .limit(1),
      ]);

      if (foodResult.error) throw foodResult.error;

      const mappedEntries: FoodEntry[] = (foodResult.data || []).map((row) => ({
        id: String(row.id),
        mealKey: row.meal_key as MealKey,
        name: row.food_name,
        carbs: Number(row.carbs || 0),
        protein: Number(row.protein || 0),
        fat: Number(row.fat || 0),
        calories: Number(row.calories || 0),
        foodDate: String(row.food_date),
        createdAt: String(row.created_at),
      }));

      const totalWater = waterResult.data?.reduce((sum, r) => sum + (r.amount_ml || 0), 0) || 0;

      setEntries(mappedEntries);
      setWaterMl(totalWater);
    } catch (err) {
      console.error("Error fetching diary:", err);
      setError("Failed to load diary");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDiary(selectedDate);
  }, [selectedDate, fetchDiary]);

  const addFood = useCallback(
    async (entry: Omit<FoodEntry, "id" | "foodDate" | "createdAt">) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data, error: insertError } = await supabase
          .from("food_diary")
          .insert({
            user_id: session.user.id,
            meal_key: entry.mealKey,
            food_name: entry.name,
            carbs: entry.carbs,
            protein: entry.protein,
            fat: entry.fat,
            calories: entry.calories,
            food_date: selectedDate,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        const newEntry: FoodEntry = {
          id: String(data.id),
          mealKey: data.meal_key as MealKey,
          name: data.food_name,
          carbs: Number(data.carbs || 0),
          protein: Number(data.protein || 0),
          fat: Number(data.fat || 0),
          calories: Number(data.calories || 0),
          foodDate: data.food_date,
          createdAt: data.created_at,
        };

        setEntries((prev) => [...prev, newEntry]);
      } catch (err) {
        console.error("Error adding food:", err);
        setError("Failed to add food");
      }
    },
    [supabase, selectedDate]
  );

  const removeFood = useCallback(
    async (entryId: string) => {
      try {
        await supabase.from("food_diary").delete().eq("id", entryId);
        setEntries((prev) => prev.filter((e) => e.id !== entryId));
      } catch (err) {
        console.error("Error removing food:", err);
        setError("Failed to remove food");
      }
    },
    [supabase]
  );

  const updateWater = useCallback(
    async (amount: number) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        await supabase.from("water_intake").insert({
          user_id: session.user.id,
          amount_ml: amount,
          water_date: selectedDate,
        });

        setWaterMl((prev) => Math.max(0, prev + amount));
      } catch (err) {
        console.error("Error updating water:", err);
        setError("Failed to update water");
      }
    },
    [supabase, selectedDate]
  );

  const changeDate = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const goToNextDay = useCallback(() => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    setSelectedDate(formatDate(current));
  }, [selectedDate]);

  const goToPrevDay = useCallback(() => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    setSelectedDate(formatDate(current));
  }, [selectedDate]);

  const goToToday = useCallback(() => {
    setSelectedDate(formatDate(new Date()));
  }, []);

  const entriesByMeal = useMemo(() => {
    const result: Record<MealKey, FoodEntry[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };
    entries.forEach((e) => {
      result[e.mealKey].push(e);
    });
    return result;
  }, [entries]);

  const totalsByMeal = useMemo(() => {
    const result: Record<MealKey, { carbs: number; protein: number; fat: number; calories: number }> = {
      breakfast: { carbs: 0, protein: 0, fat: 0, calories: 0 },
      lunch: { carbs: 0, protein: 0, fat: 0, calories: 0 },
      dinner: { carbs: 0, protein: 0, fat: 0, calories: 0 },
      snacks: { carbs: 0, protein: 0, fat: 0, calories: 0 },
    };
    entries.forEach((e) => {
      const total = result[e.mealKey];
      total.carbs += e.carbs;
      total.protein += e.protein;
      total.fat += e.fat;
      total.calories += e.calories;
    });
    return result;
  }, [entries]);

  const dayTotals = useMemo(() => {
    return Object.values(totalsByMeal).reduce(
      (acc, t) => ({
        carbs: acc.carbs + t.carbs,
        protein: acc.protein + t.protein,
        fat: acc.fat + t.fat,
        calories: acc.calories + t.calories,
      }),
      { carbs: 0, protein: 0, fat: 0, calories: 0 }
    );
  }, [totalsByMeal]);

  const selectedDateObj = useMemo(() => new Date(selectedDate + "T00:00:00"), [selectedDate]);

  const dayLabel = useMemo(() => {
    const today = formatDate(new Date());
    if (selectedDate === today) return "Hoje";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (selectedDate === formatDate(tomorrow)) return "Amanhã";
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (selectedDate === formatDate(yesterday)) return "Ontem";
    return getDayOfWeekName(selectedDateObj);
  }, [selectedDate, selectedDateObj]);

  return {
    entries,
    entriesByMeal,
    totalsByMeal,
    dayTotals,
    waterMl,
    loading,
    error,
    selectedDate,
    dayLabel,
    mealLabels,
    mealIcons,
    addFood,
    removeFood,
    updateWater,
    changeDate,
    goToNextDay,
    goToPrevDay,
    goToToday,
    refetch: () => fetchDiary(selectedDate),
  };
}