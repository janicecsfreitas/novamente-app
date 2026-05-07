"use client";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppHeader, MobileBottomMenu } from "@/components/app-navigation";
import { createClient } from "@/lib/supabase/client";

type Gender = "masculino" | "feminino" | "outro";
type Activity = "baixo" | "moderado" | "alto" | "muito-alto" | "hiperativo";
type Goal =
  | "perder-peso"
  | "perder-lentamente"
  | "manter-peso"
  | "aumentar-lentamente"
  | "aumentar-peso";

const activityFactors: Record<Activity, number> = {
  baixo: 1.2,
  moderado: 1.375,
  alto: 1.55,
  "muito-alto": 1.725,
  hiperativo: 1.9,
};

const activityLabels: Record<Activity, string> = {
  baixo: "Baixo",
  moderado: "Moderado",
  alto: "Moderado+",
  "muito-alto": "Intenso",
  hiperativo: "Extremo",
};

const goalLabels: Record<Goal, string> = {
  "perder-peso": "Secar rápido",
  "perder-lentamente": "Secar leve",
  "manter-peso": "Manter",
  "aumentar-lentamente": "Ganhar leve",
  "aumentar-peso": "Ganhar massa",
};

const goalFactors: Record<Goal, number> = {
  "perder-peso": 0.8,
  "perder-lentamente": 0.9,
  "manter-peso": 1,
  "aumentar-lentamente": 1.1,
  "aumentar-peso": 1.2,
};

const activityDescriptions: Record<Activity, string> = {
  baixo: "Pouco ou nenhum exercício",
  moderado: "Treino 1 a 3x por semana",
  alto: "Treino 3 a 5x por semana",
  "muito-alto": "Treino 6 a 7x por semana",
  hiperativo: "Treino intenso + rotina ativa",
};

const STORAGE_KEY = "novamente-dados-calculos-v1";

type HealthProfileRow = {
  activity: Activity;
  age: number;
  bmr_adjusted: number | null;
  bmr_base: number | null;
  bmi: number | null;
  gender: Gender;
  goal: Goal;
  height_cm: number;
  water_goal_ml: number | null;
  weight_kg: number;
};

function formatNumber(value: number, decimals = 0) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function parseInputNumber(value: string) {
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getBmiLabel(bmi: number) {
  if (bmi < 18.5) return "Abaixo";
  if (bmi < 25) return "Ideal";
  if (bmi < 30) return "Sobrepeso";
  if (bmi < 35) return "Obesidade I";
  if (bmi < 40) return "Obesidade II";
  return "Obesidade III";
}

export default function DadosPage() {
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(80);
  const [gender, setGender] = useState<Gender>("masculino");
  const [age, setAge] = useState(30);
  const [activity, setActivity] = useState<Activity>("moderado");
  const [goal, setGoal] = useState<Goal>("manter-peso");

  const [activityOpen, setActivityOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasLoadedRemote, setHasLoadedRemote] = useState(false);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "loading" | "saving" | "saved" | "error"
  >("idle");

  const numericFields: Array<
    [string, number, Dispatch<SetStateAction<number>>, string]
  > = [
    ["Altura", height, setHeight, "cm"],
    ["Peso", weight, setWeight, "kg"],
    ["Idade", age, setAge, "anos"],
  ];

  const activityRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeMenus(e: MouseEvent) {
      if (
        activityRef.current &&
        !activityRef.current.contains(e.target as Node)
      ) {
        setActivityOpen(false);
      }

      if (goalRef.current && !goalRef.current.contains(e.target as Node)) {
        setGoalOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const bmi = useMemo(() => {
    return weight / ((height / 100) * (height / 100));
  }, [weight, height]);

  const bmrBase = useMemo(() => {
    const base = 10 * weight + 6.25 * height - 5 * age;
    if (gender === "masculino") return base + 5;
    if (gender === "feminino") return base - 161;
    return base - 78;
  }, [weight, height, age, gender]);

  const bmrAdjusted = useMemo(() => {
    return bmrBase * activityFactors[activity] * goalFactors[goal];
  }, [bmrBase, activity, goal]);

  const waterGoalMl = useMemo(() => weight * 35, [weight]);

  useEffect(() => {
    let active = true;

    async function loadHealthProfile() {
      setSyncStatus("loading");

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!active) return;

        if (!user) {
          setHasLoadedRemote(true);
          setSyncStatus("idle");
          return;
        }

        setUserId(user.id);

        const { data, error } = await supabase
          .from("health_profiles")
          .select(
            "height_cm, weight_kg, gender, age, activity, goal, bmi, bmr_base, bmr_adjusted, water_goal_ml",
          )
          .eq("user_id", user.id)
          .maybeSingle<HealthProfileRow>();

        if (!active) return;

        if (error) {
          setHasLoadedRemote(true);
          setSyncStatus("error");
          return;
        }

        if (data) {
          setHeight(Number(data.height_cm));
          setWeight(Number(data.weight_kg));
          setGender(data.gender);
          setAge(Number(data.age));
          setActivity(data.activity);
          setGoal(data.goal);
        }

        setHasLoadedRemote(true);
        setSyncStatus(data ? "saved" : "idle");
      } catch {
        if (!active) return;
        setHasLoadedRemote(true);
        setSyncStatus("error");
      }
    }

    loadHealthProfile();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        height,
        weight,
        gender,
        age,
        activity,
        goal,
        bmi,
        bmrBase,
        bmrAdjusted,
        waterGoalMl,
      }),
    );
  }, [
    height,
    weight,
    gender,
    age,
    activity,
    goal,
    bmi,
    bmrBase,
    bmrAdjusted,
    waterGoalMl,
  ]);

  useEffect(() => {
    if (!userId || !hasLoadedRemote) return;

    const timeoutId = window.setTimeout(async () => {
      setSyncStatus("saving");

      try {
        const supabase = createClient();
        const { error } = await supabase.from("health_profiles").upsert({
          activity,
          age,
          bmi,
          bmr_adjusted: bmrAdjusted,
          bmr_base: bmrBase,
          gender,
          goal,
          height_cm: height,
          user_id: userId,
          water_goal_ml: waterGoalMl,
          weight_kg: weight,
        });

        setSyncStatus(error ? "error" : "saved");
      } catch {
        setSyncStatus("error");
      }
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [
    activity,
    age,
    bmi,
    bmrAdjusted,
    bmrBase,
    gender,
    goal,
    hasLoadedRemote,
    height,
    userId,
    waterGoalMl,
    weight,
  ]);

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-28 text-[#111827] md:pl-72">
      <div className="hidden md:block">
        <AppHeader active="data" />
      </div>

      <header className="md:hidden px-5 pt-8 pb-6">
        <h1 className="text-center text-3xl font-black tracking-tight">
          Dados
        </h1>
        <p className="mt-2 text-center text-sm text-black/45">
          Seu painel inteligente de saúde
        </p>
      </header>

      <main className="mx-auto mt-8 max-w-6xl px-4 md:px-6">
        <section className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          <div className="mb-5">
            <span className="rounded-full bg-[#e8f2ff] px-3 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-[#FF6B2C]">
              Health Style
            </span>

            <h2 className="mt-4 text-3xl md:text-4xl font-black tracking-tight">
              Seus números
            </h2>

            <p className="mt-2 text-sm md:text-base text-black/45">
              Ajuste seus dados e acompanhe métricas em tempo real.
            </p>

            <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-black/35">
              {syncStatus === "loading" && "Carregando dados"}
              {syncStatus === "saving" && "Salvando"}
              {syncStatus === "saved" && "Sincronizado"}
              {syncStatus === "error" && "Sincronizacao indisponivel"}
              {syncStatus === "idle" && "Local"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {numericFields.map(([label, value, setter, unit]) => (
              <label
                key={String(label)}
                className="rounded-3xl bg-[#f8f8fa] p-4 text-center"
              >
                <input
                  className="w-full bg-transparent text-center text-4xl font-black outline-none"
                  value={value as number}
                  type="number"
                  onChange={(e) =>
                    setter(parseInputNumber(e.target.value))
                  }
                />
                <span className="mt-1 block text-[11px] font-black uppercase tracking-[0.2em] text-black/35">
                  {label} ({unit})
                </span>
              </label>
            ))}

            <label className="rounded-3xl bg-[#f8f8fa] p-4 text-center">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full bg-transparent text-center text-2xl font-black outline-none"
              >
                <option value="masculino">Homem</option>
                <option value="feminino">Mulher</option>
                <option value="outro">Outro</option>
              </select>

              <span className="mt-1 block text-[11px] font-black uppercase tracking-[0.2em] text-black/35">
                Gênero
              </span>
            </label>
          </div>

          {/* atividade */}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div ref={activityRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setActivityOpen((v) => !v);
                  setGoalOpen(false);
                }}
                className="w-full rounded-3xl bg-[#f8f8fa] px-5 py-4 text-left shadow-inner"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/35">
                  Atividade
                </p>
                <p className="mt-1 text-xl font-black">
                  {activityLabels[activity]}
                </p>
                <p className="text-xs text-black/40">
                  {activityDescriptions[activity]}
                </p>
              </button>

              {activityOpen && (
                <div className="absolute z-50 mt-2 w-full rounded-3xl bg-white p-2 shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
                  {(Object.keys(activityLabels) as Activity[]).map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setActivity(item);
                        setActivityOpen(false);
                      }}
                      className="w-full rounded-2xl px-4 py-3 text-left font-bold hover:bg-[#f5f5f7]"
                    >
                      {activityLabels[item]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* objetivo */}
            <div ref={goalRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setGoalOpen((v) => !v);
                  setActivityOpen(false);
                }}
                className="w-full rounded-3xl bg-[#f8f8fa] px-5 py-4 text-left shadow-inner"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/35">
                  Objetivo
                </p>
                <p className="mt-1 text-xl font-black">{goalLabels[goal]}</p>
              </button>

              {goalOpen && (
                <div className="absolute z-50 mt-2 w-full rounded-3xl bg-white p-2 shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
                  {(Object.keys(goalLabels) as Goal[]).map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setGoal(item);
                        setGoalOpen(false);
                      }}
                      className="w-full rounded-2xl px-4 py-3 text-left font-bold hover:bg-[#f5f5f7]"
                    >
                      {goalLabels[item]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* cards */}
        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <article className="rounded-[2rem] bg-white p-5 shadow-[0_20px_55px_rgba(0,0,0,0.06)]">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/35">
              TMB
            </p>
            <h3 className="mt-3 text-4xl font-black">
              {formatNumber(bmrAdjusted)}
            </h3>
            <p className="text-sm text-black/45">kcal / dia</p>
          </article>

          <article className="rounded-[2rem] bg-white p-5 shadow-[0_20px_55px_rgba(0,0,0,0.06)]">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/35">
              IMC
            </p>
            <h3 className="mt-3 text-4xl font-black">
              {formatNumber(bmi, 1)}
            </h3>
            <p className="text-sm text-black/45">{getBmiLabel(bmi)}</p>
          </article>

          <article className="rounded-[2rem] bg-white p-5 shadow-[0_20px_55px_rgba(0,0,0,0.06)]">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/35">
              Água diária
            </p>
            <h3 className="mt-3 text-4xl font-black">
              {formatNumber(waterGoalMl)}
            </h3>
            <p className="text-sm text-black/45">ml por dia</p>
          </article>
        </section>
      </main>

      <MobileBottomMenu active="data" />
    </div>
  );
}
