"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppHeader, MobileBottomMenu } from "@/components/app-navigation";
import {
  DietId,
  MetasConfig,
  useMetasConfig,
} from "@/components/metas/use-metas-config";

type DietOption = {
  id: DietId;
  title: string;
  desc?: string;
  carbs?: number;
  protein?: number;
  fat?: number;
};

const diets: DietOption[] = [
  { id: "padrao", title: "Padrão", carbs: 50, protein: 20, fat: 30 },
  { id: "equilibrado", title: "Equilibrado", carbs: 50, protein: 25, fat: 25 },
  {
    id: "pobre-gorduras",
    title: "Pobre em gorduras",
    carbs: 60,
    protein: 25,
    fat: 15,
  },
  {
    id: "rico-proteina",
    title: "Rico em proteína",
    carbs: 25,
    protein: 40,
    fat: 35,
  },
  { id: "cetogenica", title: "Cetogênica", carbs: 5, protein: 30, fat: 65 },
  { id: "personalizar", title: "Personalizar", desc: "Definir manualmente" },
];

function selectDiet(option: DietOption, current: MetasConfig): MetasConfig {
  if (option.id === "personalizar") {
    return { ...current, dietId: "personalizar", dietLabel: "Personalizar" };
  }

  return {
    ...current,
    dietId: option.id,
    dietLabel: option.title,
    macros: {
      carbs: option.carbs ?? current.macros.carbs,
      protein: option.protein ?? current.macros.protein,
      fat: option.fat ?? current.macros.fat,
    },
  };
}

function MiniPie({
  carbs = 50,
  protein = 20,
  fat = 30,
}: {
  carbs?: number;
  protein?: number;
  fat?: number;
}) {
  const c1 = carbs;
  const c2 = carbs + protein;

  return (
    <span
      className="inline-flex h-14 w-14 shrink-0 rounded-full border-[5px] border-white shadow-[0_12px_28px_rgba(0,0,0,0.10)]"
      style={{
        background: `conic-gradient(#FF6B2C 0 ${c1}%, #1B5B0F ${c1}% ${c2}%, #FFDE21 ${c2}% 100%)`,
      }}
    >
      <span className="m-auto h-5 w-5 rounded-full bg-white" />
    </span>
  );
}

export default function TipoDietaPage() {
  const router = useRouter();
  const { config, setConfig } = useMetasConfig();

  const handleSelectDiet = (diet: DietOption) => {
    const nextConfig = selectDiet(diet, config);
    setConfig(nextConfig);

    if (diet.id === "personalizar") {
      router.push("/metas/editar-macronutrientes");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-28 text-[#111827] md:pb-8 md:pl-72">
      <div className="hidden md:block">
        <AppHeader active="goals" />
      </div>

      <main className="mx-auto max-w-4xl px-4 py-5 md:py-8">
        <section className="mb-5 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          <span className="inline-flex rounded-full bg-[#e8f2ff] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#FF6B2C]">
            Health Style
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] md:text-5xl">
            Tipo de dieta
          </h1>

          <p className="mt-3 text-sm leading-7 text-black/50">
            Escolha a distribuição de macronutrientes que combina melhor com seu
            objetivo.
          </p>
        </section>

        <section className="space-y-3">
          {diets.map((diet) => {
            const isActive = config.dietId === diet.id;
            const details =
              diet.desc ??
              `Carbo ${diet.carbs}% • Proteína ${diet.protein}% • Gordura ${diet.fat}%`;

            return (
              <button
                key={diet.id}
                onClick={() => handleSelectDiet(diet)}
                type="button"
                className={`group flex w-full items-center justify-between rounded-[2rem] border px-5 py-5 text-left backdrop-blur-xl transition-all duration-300 ${
                  isActive
                    ? "border-[#FF6B2C]/25 bg-white shadow-[0_22px_65px_rgba(0,113,227,0.14)]"
                    : "border-white/70 bg-white/75 shadow-[0_18px_50px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_65px_rgba(0,0,0,0.08)]"
                }`}
              >
                <div className="flex items-center gap-4">
                  {diet.id === "personalizar" ? (
                    <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f8f8fa] text-[#FF6B2C] shadow-inner">
                      <span className="material-symbols-outlined text-3xl">
                        tune
                      </span>
                    </span>
                  ) : (
                    <MiniPie
                      carbs={diet.carbs}
                      fat={diet.fat}
                      protein={diet.protein}
                    />
                  )}

                  <div>
                    <p className="text-xl font-black tracking-tight md:text-2xl">
                      {diet.title}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-black/45 md:text-base">
                      {details}
                    </p>
                  </div>
                </div>

                <span
                  className={`ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
                    isActive
                      ? "border-[#FF6B2C] bg-[#FF6B2C] text-white"
                      : "border-black/10 bg-[#f8f8fa] text-transparent group-hover:border-[#FF6B2C]/30"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    check
                  </span>
                </span>
              </button>
            );
          })}
        </section>
        <Link
          href="/metas"
          className="mt-5 flex h-14 items-center justify-center rounded-[1.5rem] bg-[#FF6B2C] text-base font-black text-white shadow-[0_18px_45px_rgba(0,113,227,0.22)] transition hover:-translate-y-0.5 "
        >
          Salvar e voltar para Metas
        </Link>
      </main>

      <MobileBottomMenu active="goals" />
    </div>
  );
}
