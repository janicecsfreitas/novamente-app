import Image from "next/image";
import logoVertical from "@/assets/logo_vertical.png";
import { LoginOAuthButtons } from "@/components/login-oauth-buttons";

export default function LoginPage() {
  return (
    <div className="relative -mt-12 min-h-screen overflow-hidden bg-[#F8F7F2] text-[#163326]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,109,0,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(0,77,64,0.14),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(255,214,128,0.16),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
        {/* Login Centralizado */}
        <section className="w-full mt-12 max-w-md">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/75 p-6 shadow-[0_35px_100px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:p-8">
            <div className="absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-[#FF6D00]/10 blur-3xl" />

            <div className="relative flex justify-center">
              <div className="rounded-[2rem] border border-black/5 bg-white px-8 py-6 shadow-sm">
                <Image
                  alt="Logo NovaMente"
                  className="h-auto w-44 sm:w-56"
                  priority
                  src={logoVertical}
                />
              </div>
            </div>

            <div className="mt-8 space-y-3 text-center">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#FF6D00]">
                Bem-vindo(a)
              </p>

              <h2 className="text-3xl font-black tracking-[-0.04em] text-[#163326]">
                Sua nova rotina começa aqui.
              </h2>

              <p className="text-sm leading-6 text-[#163326]/60">
                Controle tarefas, saúde, treinos e produtividade em um só lugar.
              </p>
            </div>

            <LoginOAuthButtons />

            <p className="pt-6 text-center text-[12px] leading-5 text-[#163326]/45">
              Ao continuar, você concorda com os{" "}
              <span className="font-bold text-[#FF6D00]">Termos de Uso</span> e{" "}
              <span className="font-bold text-[#FF6D00]">
                Política de Privacidade
              </span>
              .
            </p>
          </div>
        </section>
      </main>

      {/* Bottom Nav Mobile */}
      <footer className="fixed bottom-4 left-1/2 z-50 flex h-20 w-[calc(100%-28px)] max-w-md -translate-x-1/2 items-center justify-around rounded-[2rem] border border-white/80 bg-white/75 px-4 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl md:hidden">
        {[
          ["timer", "Focus"],
          ["favorite", "Health"],
          ["calendar_today", "Plan"],
          ["edit_note", "Log"],
        ].map(([icon, label]) => (
          <button
            key={label}
            className="flex flex-col items-center justify-center text-[#163326]/55 transition hover:text-[#FF6D00]"
            type="button"
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        ))}

        <button
          className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6D00] to-[#FFA64D] px-3 py-2 text-white shadow-lg"
          type="button"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-black">Perfil</span>
        </button>
      </footer>
    </div>
  );
}
