"use client";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppHeader, MobileBottomMenu } from "@/components/app-navigation";

const DADOS_STORAGE_KEY = "novamente-dados-calculos-v1";

type DadosCalculosStorage = {
  bmrAdjusted?: number;
  weight?: number;
  height?: number;
  age?: number;
};

function parseInputNumber(value: string) {
  const normalized = value.replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "--";
  return value.toLocaleString("pt-BR", {
    maximumFractionDigits: 0,
  });
}

function getBmiLabel(bmi: number) {
  if (bmi <= 0) return "Preencha peso e altura";
  if (bmi < 18.5) return "Abaixo do peso";
  if (bmi < 25) return "Peso saudável";
  if (bmi < 30) return "Sobrepeso";
  if (bmi < 35) return "Obesidade I";
  if (bmi < 40) return "Obesidade II";
  return "Obesidade III";
}

function readDadosCalculosFromStorage(): DadosCalculosStorage | null {
  try {
    const raw = window.localStorage.getItem(DADOS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DadosCalculosStorage;
  } catch {
    return null;
  }
}

export default function CalculadorasSaudePage() {
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(28);
  const [bmrFromDados, setBmrFromDados] = useState<number | null>(null);

  const bmi = useMemo(() => {
    if (weightKg <= 0 || heightCm <= 0) return 0;
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }, [weightKg, heightCm]);

  const bmrLocal = useMemo(() => {
    if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0;
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }, [weightKg, heightCm, age]);

  useEffect(() => {
    const syncFromDados = () => {
      const parsed = readDadosCalculosFromStorage();
      if (!parsed) return;

      if (parsed.weight) setWeightKg(parsed.weight);
      if (parsed.height) setHeightCm(parsed.height);
      if (parsed.age) setAge(parsed.age);
      if (parsed.bmrAdjusted) setBmrFromDados(parsed.bmrAdjusted);
    };

    syncFromDados();

    window.addEventListener("focus", syncFromDados);
    return () => window.removeEventListener("focus", syncFromDados);
  }, []);

  const bmrToDisplay = bmrFromDados ?? bmrLocal;
  const metricFields: Array<
    [string, number, Dispatch<SetStateAction<number>>]
  > = [
    ["Peso (kg)", weightKg, setWeightKg],
    ["Altura (cm)", heightCm, setHeightCm],
    ["Idade", age, setAge],
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-28 text-[#111827] md:pb-8 md:pl-72">
      <AppHeader active="health" />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* HERO */}
        <section className="mb-6 rounded-[2.5rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e8f2ff] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#FF6B2C]">
            Health Style
          </div>

          <h1 className="text-4xl font-black tracking-[-0.05em] md:text-4xl">
            Saúde inteligente
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/55 md:text-base">
            Acompanhe suas métricas corporais com uma experiência premium,
            moderna e simples.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* SIDEBAR */}
          <aside className="space-y-6 lg:col-span-4">
            <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
              <h3 className="mb-6 text-xl font-black tracking-tight">
                Seus dados
              </h3>

              <div className="space-y-5">
                {metricFields.map(([label, value, setter]) => (
                  <div key={String(label)}>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-black/45">
                      {label}
                    </label>

                    <input
                      className="h-14 w-full rounded-2xl border border-black/5 bg-[#f8f8fa] px-4 text-base font-semibold outline-none transition-all focus:border-[#0071e3]/30 focus:bg-white focus:ring-4 focus:ring-[#0071e3]/10"
                      type="number"
                      value={value as number}
                      min={1}
                      onChange={(e) =>
                        setter(parseInputNumber(e.target.value))
                      }
                    />
                  </div>
                ))}

                <button
                  type="button"
                  className="mt-2 flex h-14 w-full items-center justify-center rounded-2xl bg-[#FF6B2C] font-black text-white shadow-[0_18px_45px_rgba(0,113,227,0.25)] transition hover:-translate-y-0.5"
                >
                  Atualizar métricas
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] bg-gradient-to-br from-[#fc6c00] to-[#ff832d] p-6 text-white shadow-[0_20px_60px_rgba(0,113,227,0.22)]">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/70">
                Dica premium
              </p>

              <h4 className="mt-3 text-xl font-black">
                Consistência vence intensidade.
              </h4>

              <p className="mt-3 text-sm leading-7 text-white/90">
                Pequenas melhorias diárias geram resultados extraordinários em
                poucos meses.
              </p>
            </section>
          </aside>

          {/* CONTENT */}
          <section className="space-y-6 lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* IMC */}
              <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
                <span className="rounded-full bg-[#f2f4f7] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#FF6B2C]">
                  IMC
                </span>

                <h2 className="mt-5 text-4xl font-black tracking-tight">
                  {bmi > 0
                    ? bmi.toLocaleString("pt-BR", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })
                    : "--"}
                </h2>

                <p className="mt-3 text-xl font-black text-[#FF6B2C]">
                  {getBmiLabel(bmi)}
                </p>

                <p className="mt-1 text-sm text-black/45">
                  Faixa ideal: 18.5 — 24.9
                </p>
              </article>

              {/* TMB */}
              <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
                <span className="rounded-full bg-[#f2f4f7] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#FF6B2C]">
                  TMB
                </span>

                <div className="mt-5 flex items-end gap-2">
                  <h2 className="text-4xl font-black tracking-tight">
                    {formatNumber(bmrToDisplay)}
                  </h2>

                  <span className="pb-2 text-sm font-bold text-black/40">
                    kcal
                  </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-black/45">
                  Energia mínima necessária para manter o corpo em repouso.
                </p>
              </article>
            </div>

            {/* MINI CARDS */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                [
                  "Objetivo",
                  "Use IMC e TMB para traçar metas inteligentes.",
                ],
                [
                  "Manutenção",
                  `${formatNumber(bmrToDisplay * 1.4)} kcal estimadas hoje.`,
                ],
                [
                  "Evolução",
                  "Atualize semanalmente e acompanhe mudanças.",
                ],
              ].map(([title, desc]) => (
                <article
                  key={String(title)}
                  className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
                >
                  <h4 className="text-base font-black">{title}</h4>

                  <p className="mt-2 text-sm leading-7 text-black/50">
                    {desc}
                  </p>
                </article>
              ))}
            </div>

            {/* BIG CARD */}
            <article className="rounded-[2rem] bg-gradient-to-br from-[#111827] to-[#1f2937] p-8 text-white shadow-[0_25px_70px_rgba(0,0,0,0.22)]">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/55">
                Performance
              </p>

              <h3 className="mt-4 text-3xl font-black">
                Seu corpo é seu ativo principal.
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                Durma melhor, treine melhor, coma melhor e acompanhe números
                reais para acelerar resultados.
              </p>
            </article>
          </section>
        </div>
      </main>

      <MobileBottomMenu active="health" />
    </div>
  );
}
