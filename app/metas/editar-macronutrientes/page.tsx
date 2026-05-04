"use client";

import Link from "next/link";
import { AppHeader, MobileBottomMenu } from "@/components/app-navigation";
import { MetasDonut } from "@/components/metas/metas-donut";
import { MetasMobileHeader } from "@/components/metas/metas-mobile-header";
import { useMetasConfig } from "@/components/metas/use-metas-config";

function parsePct(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(999, parsed));
}

function formatInt(value: number) {
  return Math.round(value).toLocaleString("pt-BR");
}

export default function EditarMacronutrientesPage() {
  const { config, patchMacros, patchConfig, derived } = useMetasConfig();
  const { macroKcal, macroGrams, macroTotalPct } = derived;

  const updatePct = (key: "carbs" | "protein" | "fat", value: string) => {
    patchMacros({
      ...config.macros,
      [key]: parsePct(value),
    });

    patchConfig({
      dietId: "personalizar",
      dietLabel: "Personalizar",
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-28 text-[#111827] md:pb-8 md:pl-72">
      <div className="hidden md:block">
        <AppHeader active="goals" />
      </div>

      <MetasMobileHeader backHref="/metas" title="Macronutrientes" />

      <main className="mx-auto max-w-4xl px-4 py-5 md:py-8">
        <section className="mb-5 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          <span className="inline-flex rounded-full bg-[#e8f2ff] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#FF6B2C]">
            Health Style
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] md:text-5xl">
            Personalizar macros
          </h1>

          <p className="mt-3 text-sm leading-7 text-black/50">
            Ajuste seus percentuais e crie uma divisão alimentar sob medida.
          </p>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          <div className="border-b border-black/5 px-5 py-5 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/35">
              Configuração atual
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Distribuição de macronutrientes
            </h2>
          </div>

          <div className="space-y-3 px-4 py-5">
            {[
              {
                label: "Carboidratos",
                key: "carbs" as const,
                value: config.macros.carbs,
                color: "text-pink-500",
                bg: "bg-pink-50",
              },
              {
                label: "Proteína",
                key: "protein" as const,
                value: config.macros.protein,
                color: "text-[#0071e3]",
                bg: "bg-[#e8f2ff]",
              },
              {
                label: "Gordura",
                key: "fat" as const,
                value: config.macros.fat,
                color: "text-amber-500",
                bg: "bg-amber-50",
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between rounded-[1.5rem] bg-[#f8f8fa] px-5 py-4"
              >
                <div>
                  <p className="text-lg font-black">{item.label}</p>
                  <p className="text-sm text-black/40">Percentual diário</p>
                </div>

                <div
                  className={`flex items-center gap-2 rounded-full px-4 py-2 ${item.bg}`}
                >
                  <input
                    type="number"
                    defaultValue={item.value}
                    onBlur={(e) => updatePct(item.key, e.target.value)}
                    className={`w-16 bg-transparent text-right text-2xl font-black outline-none ${item.color}`}
                  />
                  <span className="text-sm font-black text-black/35">%</span>
                </div>
              </label>
            ))}
          </div>

          <div className="px-4 pb-2">
            {macroTotalPct > 100 && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-black text-red-600">
                O total está em {macroTotalPct}%. Ajuste para 100%.
              </div>
            )}

            {macroTotalPct < 100 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-black text-amber-600">
                O total está em {macroTotalPct}%. Ainda faltam{" "}
                {100 - macroTotalPct}%.
              </div>
            )}

            {macroTotalPct === 100 && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-black text-emerald-600">
                Soma perfeita: 100%.
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 px-4 py-5">
            <div className="rounded-3xl bg-[#f8f8fa] p-4 text-center">
              <p className="text-3xl font-black text-pink-500">
                {macroGrams.carbs}g
              </p>
              <p className="mt-1 text-sm font-black text-black/45">
                {formatInt(macroKcal.carbs)} kcal
              </p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
                Carbo
              </p>
            </div>

            <div className="rounded-3xl bg-[#f8f8fa] p-4 text-center">
              <p className="text-3xl font-black text-[#0071e3]">
                {macroGrams.protein}g
              </p>
              <p className="mt-1 text-sm font-black text-black/45">
                {formatInt(macroKcal.protein)} kcal
              </p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
                Proteína
              </p>
            </div>

            <div className="rounded-3xl bg-[#f8f8fa] p-4 text-center">
              <p className="text-3xl font-black text-amber-500">
                {macroGrams.fat}g
              </p>
              <p className="mt-1 text-sm font-black text-black/45">
                {formatInt(macroKcal.fat)} kcal
              </p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
                Gordura
              </p>
            </div>
          </div>

          <div className="pb-6 pt-2 flex justify-center">
            <div className="rounded-full bg-[#f8f8fa] p-5 shadow-inner">
              <MetasDonut
                carbs={config.macros.carbs}
                fat={config.macros.fat}
                protein={config.macros.protein}
              />
            </div>
          </div>

          <div className="mx-4 mb-6 grid grid-cols-3 gap-2 text-center text-[11px] font-black">
            <span className="rounded-full bg-pink-50 px-3 py-2 text-pink-500">
              Carbo
            </span>

            <span className="rounded-full bg-[#e8f2ff] px-3 py-2 text-[#0071e3]">
              Proteína
            </span>

            <span className="rounded-full bg-amber-50 px-3 py-2 text-amber-500">
              Gordura
            </span>
          </div>
        </section>

        <Link
          href="/metas"
          className="mt-5 flex h-14 items-center justify-center rounded-[1.5rem] bg-[#FF6B2C] text-base font-black text-white shadow-[0_18px_45px_rgba(0,113,227,0.22)] transition hover:-translate-y-0.5 "
        >
          Voltar para Metas
        </Link>
      </main>

      <MobileBottomMenu active="goals" />
    </div>
  );
}
