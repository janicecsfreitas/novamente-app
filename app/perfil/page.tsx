"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AppHeader, MobileBottomMenu } from "@/components/app-navigation";
import { createClient } from "@/lib/supabase/client";
import { getProfileMetadata } from "@/lib/supabase/user-profile";
import logoMini from "@/assets/logo_mini.png";

const subscriptionPlans = [
  {
    name: "Essencial",
    price: "R$ 29/mes",
    description: "Planner, diario alimentar e metas basicas.",
  },
  {
    name: "Performance Pro",
    price: "R$ 59/mes",
    description: "Calculos avancados e insights completos.",
    active: true,
  },
  {
    name: "Elite Anual",
    price: "R$ 499/ano",
    description: "Tudo do Pro com economia anual e suporte prioritario.",
  },
];

type ProfileRow = {
  address: string | null;
  avatar_url: string | null;
  email: string | null;
  full_name: string | null;
  phone: string | null;
};

export default function PerfilPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "saving" | "saved" | "error"
  >("loading");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setStatus("loading");

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!active) return;

        if (!user) {
          setStatus("idle");
          return;
        }

        setUserId(user.id);
        setEmail(user.email ?? "");
        const metadata = getProfileMetadata(user);
        setFullName(metadata.fullName ?? "");
        setAvatarUrl(metadata.avatarUrl);

        const { data, error } = await supabase
          .from("profiles")
          .select("email, full_name, avatar_url, phone, address")
          .eq("user_id", user.id)
          .maybeSingle<ProfileRow>();

        if (!active) return;

        if (error) {
          setStatus("error");
          return;
        }

        if (data) {
          setEmail(data.email ?? user.email ?? "");
          setFullName(data.full_name ?? metadata.fullName ?? "");
          setAvatarUrl(data.avatar_url ?? metadata.avatarUrl);
          setPhone(data.phone ?? "");
          setAddress(data.address ?? "");
        } else {
          await supabase.from("profiles").upsert({
            avatar_url: metadata.avatarUrl,
            email: user.email ?? null,
            full_name: metadata.fullName,
            user_id: user.id,
          });
        }

        setStatus("idle");
      } catch {
        if (active) setStatus("error");
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  async function saveProfile() {
    if (!userId) return;

    setStatus("saving");

    try {
      const supabase = createClient();
      const { error } = await supabase.from("profiles").upsert({
        address: address.trim() || null,
        avatar_url: avatarUrl,
        email: email || null,
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        user_id: userId,
      });

      setStatus(error ? "error" : "saved");
    } catch {
      setStatus("error");
    }
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8F7F2] pb-28 text-[#163326] md:pb-8 md:pl-72">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,109,0,0.16),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(0,77,64,0.13),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(255,214,128,0.18),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <AppHeader />

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-6">
        <section className="rounded-[2.25rem] border border-white/80 bg-white/75 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl md:p-8">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm">
              <Image
                alt="Avatar do perfil"
                className="h-full w-full object-cover"
                height={80}
                src={avatarUrl ?? logoMini}
                unoptimized={Boolean(avatarUrl)}
                width={80}
              />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#FF6D00]">
                Conta
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
                {fullName || "Perfil do usuario"}
              </h1>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-[#163326]/40">
                {status === "loading" && "Carregando perfil"}
                {status === "saving" && "Salvando"}
                {status === "saved" && "Perfil salvo"}
                {status === "error" && "Sincronizacao indisponivel"}
                {status === "idle" && "Dados da conta"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div>
              <label
                className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-[#163326]/45"
                htmlFor="fullName"
              >
                Nome
              </label>
              <input
                className="h-14 w-full rounded-2xl border border-black/5 bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#FF6D00]/40 focus:ring-4 focus:ring-[#FF6D00]/10"
                id="fullName"
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Seu nome"
                type="text"
                value={fullName}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-[#163326]/45"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="h-14 w-full rounded-2xl border bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#FF6D00]/40 focus:ring-4 focus:ring-[#FF6D00]/10"
                id="email"
                placeholder="usuario@seuemail.com.br"
                readOnly
                type="email"
                value={email}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-[#163326]/45"
                  htmlFor="phone"
                >
                  Celular
                </label>
                <input
                  className="h-14 w-full rounded-2xl border border-black/5 bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#FF6D00]/40 focus:ring-4 focus:ring-[#FF6D00]/10"
                  id="phone"
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+55 (11) 99999-9999"
                  type="tel"
                  value={phone}
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-[#163326]/45"
                  htmlFor="address"
                >
                  Endereco
                </label>
                <input
                  className="h-14 w-full rounded-2xl border border-black/5 bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#FF6D00]/40 focus:ring-4 focus:ring-[#FF6D00]/10"
                  id="address"
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Av. Paulista, 1000 - Sao Paulo, SP"
                  type="text"
                  value={address}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.07)] backdrop-blur-xl">
          <h2 className="text-xl font-black">Planos de assinatura</h2>
          <p className="mt-2 text-sm text-[#163326]/55">
            Escolha o plano que melhor combina com seus objetivos.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-[1.5rem] border p-4 ${
                  plan.active
                    ? "border-[#FF6D00]/30 bg-[#FFF3EA]"
                    : "border-black/5 bg-white/80"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="font-black">{plan.name}</h3>
                  {plan.active ? (
                    <span className="rounded-full bg-[#FF6D00] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                      Atual
                    </span>
                  ) : null}
                </div>
                <p className="text-lg font-black text-[#004D40]">
                  {plan.price}
                </p>
                <p className="mt-2 text-sm text-[#163326]/55">
                  {plan.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <button
            className="flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FFA64D] font-black text-white shadow-[0_18px_45px_rgba(255,109,0,0.28)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
            disabled={status === "saving" || !userId}
            onClick={saveProfile}
            type="button"
          >
            {status === "saving" ? "Salvando..." : "Salvar Alteracoes"}
          </button>
          <button
            className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#BA1A1A]/20 bg-[#FFF1F0] font-black text-[#BA1A1A] transition hover:brightness-95"
            onClick={signOut}
            type="button"
          >
            Sair da Conta
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </section>
      </main>

      <MobileBottomMenu />
    </div>
  );
}
