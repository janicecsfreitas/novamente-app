"use client";

import { useEffect, useState } from "react";
import { AppHeader, MobileBottomMenu } from "@/components/app-navigation";
import { useFoodDiary, MealKey } from "@/components/alimentacao/use-food-diary";
import { useFoodDatabase } from "@/components/alimentacao/use-food-database";
import { useMetasConfig } from "@/components/metas/use-metas-config";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type FoodDraft = {
  name: string;
  carbs: string;
  protein: string;
  fat: string;
  calories: string;
  quantity: string;
  servingSize: string;
};

const emptyDraft = {
  name: "",
  carbs: "",
  protein: "",
  fat: "",
  calories: "",
  quantity: "100",
  servingSize: "g",
};

const mealMeta = [
  { key: "breakfast", label: "Café da manhã", icon: "wb_twilight" },
  { key: "lunch", label: "Almoço", icon: "light_mode" },
  { key: "dinner", label: "Jantar", icon: "dark_mode" },
  { key: "snacks", label: "Lanches", icon: "cookie" },
];

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function pct(v: number, t: number) {
  return t <= 0 ? 0 : Math.min(100, Math.round((v / t) * 100));
}

export default function Page() {
  const { derived, hydrated } = useMetasConfig();
  const { macroGrams, targetCalories } = derived;
  const {
    entriesByMeal,
    totalsByMeal,
    dayTotals,
    waterMl,
    loading,
    selectedDate,
    dayLabel,
    addFood,
    removeFood,
    updateWater,
    goToNextDay,
    goToPrevDay,
    goToToday,
  } = useFoodDiary();
  const { results: searchResults, searchFood } = useFoodDatabase();

  const [goals, setGoals] = useState({
    carbs: 0,
    protein: 0,
    fat: 0,
    calories: 0,
    waterMl: 3000,
  });
  const [drafts, setDrafts] = useState<Record<MealKey, FoodDraft>>({
    breakfast: { ...emptyDraft },
    lunch: { ...emptyDraft },
    dinner: { ...emptyDraft },
    snacks: { ...emptyDraft },
  });
  const [expanded, setExpanded] = useState<string | null>("breakfast");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data } = (await supabase
        .from("health_profiles")
        .select("bmr_adjusted, water_goal_ml")
        .eq("user_id", session.user.id)
        .maybeSingle()) as any;
      setGoals({
        carbs: macroGrams.carbs,
        protein: macroGrams.protein,
        fat: macroGrams.fat,
        calories: Math.round(data?.bmr_adjusted || targetCalories),
        waterMl: data?.water_goal_ml || 3000,
      });
    })();
  }, [hydrated, macroGrams, targetCalories]);

  const updateDraft = (key: string, field: string, value: string) => {
    setDrafts((prev: any) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleSearch = (key: string, value: string) => {
    updateDraft(key, "name", value);
    if (value.length >= 1) {
      searchFood(value);
      setSearchOpen(true);
    } else setSearchOpen(false);
  };

  const selectResult = (key: string, r: any) => {
    setDrafts((prev: any) => ({
      ...prev,
      [key]: {
        name: r.name,
        carbs: String(r.carbs),
        protein: String(r.protein),
        fat: String(r.fat),
        calories: String(r.calories),
        quantity: "100",
        servingSize: "g",
      },
    }));
    setSearchOpen(false);
  };

  const addFoodHandler = (key: string) => {
    const d = drafts[key as MealKey];
    if (!d.name.trim()) return;
    const qty = Number(d.quantity) || 100;
    const mult = d.servingSize === "g" ? qty / 100 : qty;
    addFood({
      mealKey: key as MealKey,
      name: `${d.name} (${qty}${d.servingSize})`,
      carbs: Math.round(Number(d.carbs || 0) * mult),
      protein: Math.round(Number(d.protein || 0) * mult),
      fat: Math.round(Number(d.fat || 0) * mult),
      calories: Math.round(Number(d.calories || 0) * mult),
    });
    setDrafts((prev: any) => ({ ...prev, [key]: { ...emptyDraft } }));
    setSearchOpen(false);
  };

  const macrosData = [
    { label: "Carboidratos", value: dayTotals.carbs, target: goals.carbs },
    { label: "Proteína", value: dayTotals.protein, target: goals.protein },
    { label: "Gordura", value: dayTotals.fat, target: goals.fat },
  ];

  if (!hydrated || loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] pb-28 md:pl-72 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-[#FF6B2C] animate-spin">
          sync
        </span>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#f5f5f7] pb-28 text-[#111827] md:pb-8 md:pl-72">
    <AppHeader active="food" />

    <main className="mx-auto max-w-7xl px-2 py-3 md:px-6 md:py-6">
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[0.95fr_1.35fr]">
        
        {/* COLUNA ESQUERDA */}
        <section className="space-y-4 md:space-y-6">
          
          {/* CARD DIA */}
          <article className="rounded-2xl md:rounded-[2.5rem] border border-white/70 bg-white/80 p-4 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#e8f2ff] px-3 py-1 md:px-4 md:py-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.22em] text-[#FF6B2C]">
                Health Style
              </span>

              <button
                onClick={goToToday}
                type="button"
                className="rounded-full bg-[#FF6B2C] px-2 py-1 md:px-3 md:py-1 text-[9px] md:text-[10px] font-black text-white"
              >
                Hoje
              </button>
            </div>

            <div className="mt-2 md:mt-3 flex items-center gap-2">
              <button
                onClick={goToPrevDay}
                type="button"
                className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-[#f8f8fa]"
              >
                <span className="material-symbols-outlined text-lg md:text-xl">
                  chevron_left
                </span>
              </button>

              <h1 className="flex-1 text-xl md:text-3xl font-black">
                {dayLabel}
              </h1>

              <button
                onClick={goToNextDay}
                type="button"
                className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-[#f8f8fa]"
              >
                <span className="material-symbols-outlined text-lg md:text-xl">
                  chevron_right
                </span>
              </button>
            </div>

            <p className="mt-1 text-xs md:text-sm text-black/45">
              {formatDate(selectedDate)}
            </p>

            <div className="mt-4 md:mt-8 grid grid-cols-2 gap-2 md:gap-3">
              <div className="rounded-xl md:rounded-2xl bg-[#f8f8fa] p-3 md:p-4">
                <p className="text-[10px] md:text-[11px] font-black uppercase text-black/40">
                  Calorias
                </p>
                <p className="mt-1 md:mt-2 text-lg md:text-2xl font-black text-[#FF6B2C]">
                  {dayTotals.calories} / {goals.calories}
                </p>
              </div>

              <div className="rounded-xl md:rounded-2xl bg-[#f8f8fa] p-3 md:p-4">
                <p className="text-[10px] md:text-[11px] font-black uppercase text-black/40">
                  Água
                </p>
                <p className="mt-1 md:mt-2 text-lg md:text-2xl font-black text-[#FF6B2C]">
                  {waterMl} ml
                </p>
              </div>
            </div>

            {/* BARRAS UMA ABAIXO DA OUTRA */}
            <div className="mt-4 md:mt-6 space-y-3 rounded-[1.25rem] md:rounded-[1.75rem] bg-[#f8f8fa] p-3 md:p-4">
              <div>
                <div className="flex justify-between text-[10px] md:text-xs font-black mb-1">
                  <span>Carboidratos</span>
                  <span>
                    {macrosData[0].value}g / {macrosData[0].target}g
                  </span>
                </div>

                <div className="h-1.5 md:h-2 overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full bg-pink-500"
                    style={{
                      width: `${pct(
                        macrosData[0].value,
                        macrosData[0].target
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] md:text-xs font-black mb-1">
                  <span>Proteína</span>
                  <span>
                    {macrosData[1].value}g / {macrosData[1].target}g
                  </span>
                </div>

                <div className="h-1.5 md:h-2 overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full bg-[#0071e3]"
                    style={{
                      width: `${pct(
                        macrosData[1].value,
                        macrosData[1].target
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] md:text-xs font-black mb-1">
                  <span>Gordura</span>
                  <span>
                    {macrosData[2].value}g / {macrosData[2].target}g
                  </span>
                </div>

                <div className="h-1.5 md:h-2 overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{
                      width: `${pct(
                        macrosData[2].value,
                        macrosData[2].target
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </article>

          {/* HIDRATAÇÃO NO DESKTOP SOMENTE */}
          <article className="hidden md:block rounded-xl md:rounded-[2rem] border border-white/70 bg-white/80 p-3 md:p-5">
            <div className="flex justify-between">
              <h2 className="text-sm md:text-lg font-black">Hidratação</h2>
              <span className="text-xs md:text-sm font-black text-black/45">
                {waterMl}/{goals.waterMl} ml
              </span>
            </div>

            <div className="mt-2 md:mt-4 h-2 md:h-3 overflow-hidden rounded-full bg-[#e5e7eb]">
              <div
                className="h-full rounded-full bg-[#0071e3]"
                style={{ width: `${pct(waterMl, goals.waterMl)}%` }}
              />
            </div>

            <div className="mt-2 md:mt-4 grid grid-cols-3 gap-2">
              <button
                onClick={() => updateWater(250)}
                type="button"
                className="rounded-lg md:rounded-2xl bg-[#f5f5f7] py-2 md:py-3 text-xs md:text-sm font-black"
              >
                +250 ml
              </button>

              <button
                onClick={() => updateWater(500)}
                type="button"
                className="rounded-lg md:rounded-2xl bg-[#f5f5f7] py-2 md:py-3 text-xs md:text-sm font-black"
              >
                +500 ml
              </button>

              <button
                onClick={() => updateWater(-250)}
                type="button"
                className="rounded-lg md:rounded-2xl bg-[#f5f5f7] py-2 md:py-3 text-xs md:text-sm font-black"
              >
                -250 ml
              </button>
            </div>
          </article>
        </section>

        {/* COLUNA DIREITA (REFEIÇÕES) */}
        <section className="space-y-3 md:space-y-5">
          {mealMeta.map((meal) => {
            const total = totalsByMeal[meal.key as MealKey];
            const entries = entriesByMeal[meal.key as MealKey];
            const open = expanded === meal.key;
            const draft = drafts[meal.key as MealKey];

            return (
              <div key={meal.key}>
                <article className="overflow-hidden rounded-xl md:rounded-[2rem] border border-white/70 bg-white/80">
                  <div className="flex items-center justify-between px-3 py-2 md:px-5 md:py-5">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="flex h-8 w-8 md:h-11 md:w-11 items-center justify-center rounded-lg md:rounded-2xl bg-[#e8f2ff] text-[#FF6B2C]">
                        <span className="material-symbols-outlined text-base md:text-xl">
                          {meal.icon}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-sm md:text-xl font-black">
                          {meal.label}
                        </h2>
                        <p className="text-[10px] md:text-sm text-black/45">
                          {total.calories} kcal
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpanded(open ? null : meal.key)}
                      type="button"
                      className="rounded-full bg-[#f5f5f7] px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-sm font-black"
                    >
                      {open ? "Fechar" : "Abrir"}
                    </button>
                  </div>

                  {/* MACROS ALINHADOS (CARB/PROT/FAT/KCAL) */}
                  <div className="grid grid-cols-4 border-y border-black/5 bg-[#fafafa] px-2 py-2 md:px-4 md:py-3 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm md:text-lg font-black text-pink-500 tabular-nums">
                        {total.carbs}
                      </p>
                      <p className="text-[8px] md:text-[9px] font-black uppercase text-black/35 tracking-widest">
                        Carb
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm md:text-lg font-black text-[#0071e3] tabular-nums">
                        {total.protein}
                      </p>
                      <p className="text-[8px] md:text-[9px] font-black uppercase text-black/35 tracking-widest">
                        Prot
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm md:text-lg font-black text-amber-500 tabular-nums">
                        {total.fat}
                      </p>
                      <p className="text-[8px] md:text-[9px] font-black uppercase text-black/35 tracking-widest">
                        Fat
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm md:text-lg font-black text-[#111827] tabular-nums">
                        {total.calories}
                      </p>
                      <p className="text-[8px] md:text-[9px] font-black uppercase text-black/35 tracking-widest">
                        Kcal
                      </p>
                    </div>
                  </div>

                  {open && (
                    <div className="px-3 py-3 md:px-5 md:py-5">
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="col-span-3 relative">
                          <input
                            value={draft.name}
                            onChange={(e) =>
                              handleSearch(meal.key, e.target.value)
                            }
                            placeholder="Buscar..."
                            className="h-9 md:h-11 w-full rounded-lg md:rounded-2xl bg-[#f5f5f7] px-3 text-xs md:text-sm"
                          />

                          {searchOpen && searchResults.length > 0 && (
                            <div className="absolute z-50 mt-1 max-h-40 w-full overflow-auto rounded-lg md:rounded-2xl bg-white shadow-lg">
                              {searchResults.map((r) => (
                                <button
                                  key={r.id}
                                  onClick={() => selectResult(meal.key, r)}
                                  className="w-full px-2 py-1.5 text-left text-xs hover:bg-gray-100 border-b"
                                >
                                  <p className="font-medium truncate">
                                    {r.name}
                                  </p>
                                  <p className="text-[9px]">
                                    C:{r.carbs} P:{r.protein} G:{r.fat} •{" "}
                                    {r.calories}
                                  </p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <input
                          value={draft.quantity}
                          onChange={(e) =>
                            updateDraft(meal.key, "quantity", e.target.value)
                          }
                          placeholder="Qtd"
                          type="number"
                          className="h-9 md:h-11 rounded-lg md:rounded-2xl bg-[#f5f5f7] px-2 text-xs md:text-sm"
                        />

                        <select
                          value={draft.servingSize}
                          onChange={(e) =>
                            updateDraft(meal.key, "servingSize", e.target.value)
                          }
                          className="h-9 md:h-11 rounded-lg md:rounded-2xl bg-[#f5f5f7] px-1 text-xs md:text-sm"
                        >
                          <option value="g">g</option>
                          <option value="ml">ml</option>
                          <option value="un">un</option>
                        </select>

                        <span></span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <input
                          value={draft.carbs}
                          onChange={(e) =>
                            updateDraft(meal.key, "carbs", e.target.value)
                          }
                          placeholder="C"
                          type="number"
                          className="h-9 md:h-11 rounded-lg md:rounded-2xl bg-[#f5f5f7] px-1 text-xs md:text-sm"
                        />

                        <input
                          value={draft.protein}
                          onChange={(e) =>
                            updateDraft(meal.key, "protein", e.target.value)
                          }
                          placeholder="P"
                          type="number"
                          className="h-9 md:h-11 rounded-lg md:rounded-2xl bg-[#f5f5f7] px-1 text-xs md:text-sm"
                        />

                        <input
                          value={draft.fat}
                          onChange={(e) =>
                            updateDraft(meal.key, "fat", e.target.value)
                          }
                          placeholder="G"
                          type="number"
                          className="h-9 md:h-11 rounded-lg md:rounded-2xl bg-[#f5f5f7] px-1 text-xs md:text-sm"
                        />

                        <input
                          value={draft.calories}
                          onChange={(e) =>
                            updateDraft(meal.key, "calories", e.target.value)
                          }
                          placeholder="K"
                          type="number"
                          className="h-9 md:h-11 rounded-lg md:rounded-2xl bg-[#f5f5f7] px-1 text-xs md:text-sm"
                        />
                      </div>

                      <button
                        onClick={() => addFoodHandler(meal.key)}
                        className="w-full rounded-lg md:rounded-2xl bg-[#FF6B2C] py-2 md:py-3 text-xs md:text-sm font-black text-white"
                      >
                        Adicionar
                      </button>
                    </div>
                  )}

                  {entries && entries.length > 0 && (
                    <div className="border-t border-black/5 px-3 py-2 md:px-5 md:py-3">
                      {entries.map((e: any) => (
                        <div
                          key={e.id}
                          className="flex justify-between border-b border-black/5 py-1.5 md:py-2"
                        >
                          <div className="truncate">
                            <p className="text-xs md:text-sm font-black truncate">
                              {e.name}
                            </p>
                            <p className="text-[9px] md:text-xs text-black/45">
                              C:{e.carbs} P:{e.protein} G:{e.fat} • {e.calories}
                            </p>
                          </div>

                          <button
                            onClick={() => removeFood(e.id)}
                            className="flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-gray-100 text-red-500"
                          >
                            <span className="material-symbols-outlined text-xs md:text-sm">
                              delete
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </article>

                {/* HIDRATAÇÃO APÓS LANCHES (MOBILE) */}
                {meal.key === "snacks" && (
                  <article className="mt-3 md:hidden rounded-xl border border-white/70 bg-white/80 p-4">
                    <div className="flex justify-between">
                      <h2 className="text-sm font-black">Hidratação</h2>
                      <span className="text-xs font-black text-black/45">
                        {waterMl}/{goals.waterMl} ml
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                      <div
                        className="h-full rounded-full bg-[#0071e3]"
                        style={{ width: `${pct(waterMl, goals.waterMl)}%` }}
                      />
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <button
                        onClick={() => updateWater(250)}
                        type="button"
                        className="rounded-xl bg-[#f5f5f7] py-2 text-xs font-black"
                      >
                        +250
                      </button>

                      <button
                        onClick={() => updateWater(500)}
                        type="button"
                        className="rounded-xl bg-[#f5f5f7] py-2 text-xs font-black"
                      >
                        +500
                      </button>

                      <button
                        onClick={() => updateWater(-250)}
                        type="button"
                        className="rounded-xl bg-[#f5f5f7] py-2 text-xs font-black"
                      >
                        -250
                      </button>
                    </div>
                  </article>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </main>

    <MobileBottomMenu active="food" />
  </div>
);
}
