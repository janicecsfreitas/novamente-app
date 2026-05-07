"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader, MobileBottomMenu } from "@/components/app-navigation";

const plans = [
  {
    id: "essencial",
    name: "Essencial",
    monthlyPrice: 29,
    yearlyPrice: 290,
    description: "Para quem esta começando a cuidar da saúde mental.",
    features: [
      "Planner digital semanal",
      "Diário alimentar",
      "Metas básicas",
      "Dashboard pessoal",
      "Acesso ao app mobile",
    ],
    highlight: false,
  },
  {
    id: "pro",
    name: "Performance Pro",
    monthlyPrice: 59,
    yearlyPrice: 590,
    description: "Para quem busca resultados avançados e insights completos.",
    features: [
      "Tudo do Essencial",
      "Cálculos avançados de macronutrientes",
      "Insights completos de saúde",
      "Relatórios semanais",
      "Metas personalizadas com IA",
      "Suporte por e-mail",
    ],
    highlight: true,
    badge: "Mais Popular",
  },
  {
    id: "elite",
    name: "Elite Anual",
    monthlyPrice: 499,
    yearlyPrice: 499,
    description: "Tudo do Pro com economia anual e suporte prioritário.",
    features: [
      "Tudo do Performance Pro",
      "Economia de R$ 208/ano",
      "Suporte prioritário",
      "Consultoria mensal 1:1",
      "Acesso antecipado a novos recursos",
      "Workshop exclusivo trimestral",
    ],
    highlight: false,
    badge: "Melhor Valor",
  },
];

export default function PlanosPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [userPlan, setUserPlan] = useState<string>("pro");
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const getPrice = (plan: (typeof plans)[0]) => {
    if (plan.id === "elite") {
      return billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
    }
    return billing === "yearly"
      ? Math.round(plan.monthlyPrice * 0.8)
      : plan.monthlyPrice;
  };

  const getSavings = (plan: (typeof plans)[0]) => {
    if (plan.id === "elite") return 0;
    const monthly = plan.monthlyPrice * 12;
    const yearly = Math.round(plan.monthlyPrice * 0.8) * 12;
    return monthly - yearly;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-28 md:pl-72">
      <div className="hidden md:block">
        <AppHeader />
      </div>

      <header className="md:hidden flex items-center gap-3 px-5 pt-8 pb-6">
        <Link href="/perfil" className="material-symbols-outlined text-[#3f4945]">
          arrow_back_ios
        </Link>
        <h1 className="text-2xl font-black tracking-tight">Planos de Assinatura</h1>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-2 md:pt-8 md:pb-8 md:pl-0">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <Link
              href="/perfil"
              className="flex items-center gap-1 text-sm text-[#3f4945] transition-colors hover:text-[#111d23]"
            >
              <span className="material-symbols-outlined text-lg">
                arrow_back_ios
              </span>
              Perfil
            </Link>
          </div>
          <h1 className="font-display text-3xl font-black text-[#111d23] md:text-4xl">
            Planos de Assinatura
          </h1>
          <p className="mt-2 max-w-xl text-[#3f4945]">
            Escolha o plano que melhor combina com seus objetivos de saúde e
            bem-estar.
          </p>
        </div>

        <div className="mb-8 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#bfc9c4] bg-white p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-black transition-all ${
                billing === "monthly"
                  ? "bg-[#1B5B0F] text-white shadow-sm"
                  : "text-[#3f4945] hover:bg-[#e9f6fd]"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`rounded-full px-5 py-2 text-sm font-black transition-all ${
                billing === "yearly"
                  ? "bg-[#1B5B0F] text-white shadow-sm"
                  : "text-[#3f4945] hover:bg-[#e9f6fd]"
              }`}
            >
              Anual
              <span className="ml-1.5 rounded-full bg-[#1B5B0F]/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#1B5B0F]">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            const price = getPrice(plan);
            const isCurrent = userPlan === plan.id;
            const isHovered = hoveredPlan === plan.id;
            const savings = getSavings(plan);

            return (
              <article
                key={plan.id}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`group relative flex flex-col rounded-3xl border p-6 transition-all duration-300 ${
                  plan.highlight
                    ? "border-[#1B5B0F]/30 bg-gradient-to-b from-[#afefdd]/20 to-white shadow-[0_20px_60px_rgba(27,91,15,0.12)]"
                    : "border-[#bfc9c4]/50 bg-white shadow-sm hover:border-[#1B5B0F]/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                } ${isHovered ? "-translate-y-1" : ""}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`inline-block rounded-full px-4 py-1 text-xs font-black uppercase tracking-wider ${
                        plan.highlight
                          ? "bg-[#1B5B0F] text-white"
                          : "bg-[#9f4200] text-white"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-black text-[#111d23]">{plan.name}</h3>
                  {isCurrent && (
                    <span className="mt-1 inline-block rounded-full bg-[#FF6D00] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">
                      Plano Atual
                    </span>
                  )}
                </div>

                <div className="mb-1 flex items-baseline gap-1">
                  <span className="font-manrope text-4xl font-black text-[#111d23]">
                    R$ {price}
                  </span>
                  {plan.id !== "elite" && (
                    <span className="text-sm text-[#3f4945]">/mês</span>
                  )}
                  {plan.id === "elite" && billing === "yearly" && (
                    <span className="text-sm text-[#3f4945]">/ano</span>
                  )}
                </div>

                {billing === "yearly" && savings > 0 && (
                  <div className="mb-3">
                    <span className="rounded-full bg-[#1B5B0F]/10 px-2 py-0.5 text-xs font-black text-[#1B5B0F]">
                      Economia de R$ {savings}/ano
                    </span>
                  </div>
                )}

                <p className="mb-6 text-sm text-[#3f4945]">{plan.description}</p>

                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 material-symbols-outlined text-lg ${
                          plan.highlight ? "text-[#1B5B0F]" : "text-[#707975]"
                        }`}
                      >
                        {plan.id === "pro" && i === 0
                          ? "check_circle"
                          : feature.startsWith("Tudo do")
                          ? "subdirectory_arrow_right"
                          : "check_circle"}
                      </span>
                      <span className="text-sm text-[#3f4945]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-4">
                  {isCurrent ? (
                    <div className="flex h-12 items-center justify-center rounded-2xl border border-[#bfc9c4] bg-[#f4faff] font-black text-[#707975]">
                      Assinatura Ativa
                    </div>
                  ) : (
                    <button
                      className={`flex h-12 w-full items-center justify-center rounded-2xl font-black transition-all ${
                        plan.highlight
                          ? "bg-gradient-to-r from-[#1B5B0F] to-[#2d7a1f] text-white shadow-[0_12px_30px_rgba(27,91,15,0.3)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(27,91,15,0.35)]"
                          : "border border-[#bfc9c4] bg-white text-[#111d23] hover:border-[#1B5B0F]/30 hover:bg-[#f4faff]"
                      }`}
                    >
                      Selecionar Plano
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-[#bfc9c4]/50 bg-white/60 p-6 text-center backdrop-blur-sm">
          <p className="text-sm text-[#3f4945]">
            <span className="font-black text-[#111d23]">
              Dúvidas sobre qual plano escolher?
            </span>{" "}
            Entre em contato com nosso time pelo e-mail{" "}
            <span className="font-black text-[#1B5B0F]">
              suporte@novamente.app
            </span>{" "}
            e te ajudamos a encontrar o plano ideal.
          </p>
        </div>
      </main>

      <MobileBottomMenu />
    </div>
  );
}