"use client";

import Link from "next/link";
import { AppHeader, MobileBottomMenu } from "@/components/app-navigation";
import { MetasDonut } from "@/components/metas/metas-donut";
import { MetasMobileHeader } from "@/components/metas/metas-mobile-header";
import { useMetasConfig } from "@/components/metas/use-metas-config";

function formatInt(value: number) {
  return Math.round(value).toLocaleString("pt-BR");
}

export default function MetasPage() {
  const { derived, config } = useMetasConfig();
  const { targetCalories, macroGrams, macroKcal } = derived;

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-28 text-[#111827] md:pb-8 md:pl-72">
      <div className="hidden md:block">
        <AppHeader active="goals" />
      </div>

      <MetasMobileHeader title="Metas" />

      <main className="mx-auto max-w-4xl px-4 py-5 md:py-8">
        <section className="mb-5 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          <span className="inline-flex rounded-full bg-[#e8f2ff] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#FF6B2C]">
            Health Style
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] md:text-5xl">
            Suas metas
          </h1>

          <p className="mt-3 text-sm leading-7 text-black/50">
            Acompanhe calorias, macros e sua estratégia alimentar com uma visão
            limpa e premium.
          </p>
        </section>

        <Link
          className="group flex items-center justify-between rounded-[2rem] border border-white/70 bg-white/80 px-5 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
          href="/metas/requisitos-caloricos"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e8f2ff] text-[#FF6B2C]">
              <span className="material-symbols-outlined text-4xl">
                local_fire_department
              </span>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/35">
                Requisitos calóricos diários
              </p>

              <p className="mt-1 text-4xl font-black tracking-tight">
                {formatInt(targetCalories)}
                <span className="ml-1 text-base font-bold text-black/35">
                  kcal
                </span>
              </p>
            </div>
          </div>

          <span className="material-symbols-outlined text-4xl text-black/25 transition group-hover:translate-x-1 group-hover:text-[#FF6B2C]">
            chevron_right
          </span>
        </Link>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          <div className="px-5 pb-4 pt-5 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/35">
              Distribuição diária
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
              Macronutrientes
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 px-4">
            <div className="rounded-3xl bg-[#f8f8fa] p-4 text-center">
              <p className="text-3xl font-black text-pink-500">
                {macroGrams.carbs}g
              </p>
              <p className="mt-1 text-sm font-black text-black/45">
                {macroKcal.carbs} kcal
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
                {macroKcal.protein} kcal
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
                {macroKcal.fat} kcal
              </p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
                Gordura
              </p>
            </div>
          </div>

          <div className="my-6 flex justify-center">
            <div className="rounded-full bg-[#f8f8fa] p-5 shadow-inner">
              <MetasDonut
                carbs={config.macros.carbs}
                fat={config.macros.fat}
                protein={config.macros.protein}
              />
            </div>
          </div>

          <div className="mx-4 mb-4 grid grid-cols-3 gap-2 text-center text-[11px] font-black">
            <span className="rounded-full bg-pink-50 px-3 py-2 text-pink-500">
              Carboidratos
            </span>

            <span className="rounded-full bg-[#e8f2ff] px-3 py-2 text-[#0071e3]">
              Proteína
            </span>

            <span className="rounded-full bg-amber-50 px-3 py-2 text-amber-500">
              Gordura
            </span>
          </div>

          <Link
            className="flex items-center justify-between border-t border-black/5 px-5 py-5 transition hover:bg-[#f8f8fa]"
            href="/metas/tipo-dieta"
          >
            <div>
              <p className="text-lg font-black">Tipo de dieta</p>
              <p className="text-sm text-black/40">Estratégia atual</p>
            </div>

            <span className="rounded-full bg-[#e8f2ff] px-4 py-2 text-sm font-black text-[#FF6B2C]">
              {config.dietLabel}
            </span>
          </Link>

          <Link
            className="flex items-center justify-between border-t border-black/5 px-5 py-5 transition hover:bg-[#f8f8fa]"
            href="/metas/editar-macronutrientes"
          >
            <div>
              <p className="text-lg font-black">Editar macronutrientes</p>
              <p className="text-sm text-black/40">
                Personalize sua divisão
              </p>
            </div>

            <span className="material-symbols-outlined text-4xl text-black/25">
              chevron_right
            </span>
          </Link>
        </section>
      </main>

      <MobileBottomMenu active="goals" />
    </div>
  );
}
