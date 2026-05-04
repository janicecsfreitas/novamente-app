"use client";

import { AppHeader, MobileBottomMenu } from "@/components/app-navigation";
import { MetasMobileHeader } from "@/components/metas/metas-mobile-header";
import { getEffectiveAdjustmentPct, getTargetCalories, useMetasConfig } from "@/components/metas/use-metas-config";

function formatInt(value: number) {
  return Math.round(value).toLocaleString("pt-BR");
}

export default function RequisitosCaloricosPage() {
  const { config, patchConfig } = useMetasConfig();

  const currentAdjustment = getEffectiveAdjustmentPct(config);
  const targetCalories = getTargetCalories(config);
  const sliderValue = Math.max(-20, Math.min(20, currentAdjustment));
  const sliderPos = ((sliderValue + 20) / 40) * 100;

  return (
    <div className="min-h-screen bg-[#f2f2f6] pb-24 md:pl-72">
      <div className="hidden md:block">
        <AppHeader active="goals" />
      </div>

      <MetasMobileHeader backHref="/metas" title="Requisitos calóricos" />

      <main className="mx-auto max-w-3xl px-4 py-5">
        <section className="rounded-[1.5rem] bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="text-center">
            <p className="text-4xl font-black">{formatInt(targetCalories)}</p>
            <p className="text-2xl font-black text-[#1b5b0f]">kcal</p>
            <p className="mt-2 text-lg font-black text-[#8d8d93]">
              Calorias de manutenção: {formatInt(config.maintenanceCalories)} kcal
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
            <p className="text-2xl font-black">Usar recomendado</p>
            <button
              aria-label="Alternar recomendado"
              className={`relative h-10 w-20 rounded-full transition duration-500 ease-in-out ${config.useRecommendedCalories ? "bg-[#1b5b0f]" : "bg-[#cfd2d9]"}`}
              onClick={() => patchConfig({ useRecommendedCalories: !config.useRecommendedCalories })}
              type="button"
            >
              <span
                className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow transition duration-500 ease-in-out ${config.useRecommendedCalories ? "right-1" : "left-1"}`}
              />
            </button>
          </div>
        </section>

        <section className="mt-4 rounded-[1.5rem] bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black">Requisitos calóricos</p>
            <p className="text-3xl font-black">
              {formatInt(targetCalories)} <span className="text-[#8d8d93]">kcal</span>
            </p>
          </div>

          <div className="mt-8 px-1">
            <div className="relative h-3 rounded-full bg-[#efefef]">
              <div className="absolute left-0 top-0 h-full w-[20%] rounded-l-full bg-[#FC6C00]" />
              <div className="absolute left-[20%] top-0 h-full w-[10%] bg-[#ffde21]" />
              <div className="absolute left-[30%] top-0 h-full w-[40%] bg-[#1b5b0f]" />
              <div className="absolute left-[70%] top-0 h-full w-[10%] bg-[#ffde21]" />
              <div className="absolute left-[80%] top-0 h-full w-[20%] rounded-r-full bg-[#FC6C00]" />
              <span
                className="absolute top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border-2 border-white bg-[#3c3c3c] shadow"
                style={{ left: `calc(${sliderPos}% - 18px)` }}
              />
            </div>

            <input
              className="mt-5 w-full"
              disabled={config.useRecommendedCalories}
              max={20}
              min={-20}
              onChange={(e) => patchConfig({ manualAdjustmentPct: Number(e.target.value) })}
              type="range"
              value={sliderValue}
            />
          </div>

          <p className="mt-4 text-center text-2xl font-black">
            Modificação de calorias de manutenção: {currentAdjustment > 0 ? "+" : ""}
            {currentAdjustment} %
          </p>

          <div className="mt-5 rounded-2xl bg-[#d7e8ff] p-4 text-xl leading-9 text-[#1e4b8d]">
            Essas são as calorias que precisa consumir todos os dias para alcançar o objetivo, dependendo do nível de atividade física, sexo, idade etc. O resultado pode aumentar ou diminuir até 20%.
          </div>
        </section>
      </main>

      <MobileBottomMenu active="goals" />
    </div>
  );
}
