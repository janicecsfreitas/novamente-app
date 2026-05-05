import Image from "next/image";
import logoVertical from "@/assets/logo_vertical.png";
import { LoginOAuthButtons } from "@/components/login-oauth-buttons";

export default function LoginPage() {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#F8F7F2] text-[#163326]">
      {/* Background Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,109,0,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(0,77,64,0.14),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(255,214,128,0.16),transparent_32%)]" />

      {/* Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <main className="relative z-10 flex h-full w-full items-center justify-center px-5">
        <section className="w-full max-w-md">
          <div className="relative max-h-[92dvh] overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/75 p-6 shadow-[0_35px_100px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:p-8">
            {/* Glow */}
            <div className="absolute left-1/2 top-6 h-40 w-40 -translate-x-1/2 rounded-full bg-[#FF6D00]/10 blur-3xl" />

            {/* Logo */}
            <div className="relative flex justify-center">
              <div className="px-7 py-5 sm:px-8 sm:py-6">
                <Image
                  alt="Logo NovaMente"
                  className="h-auto w-35 sm:w-60"
                  priority
                  src={logoVertical}
                />
              </div>
            </div>

            {/* Text */}
            <div className="mt-7 space-y-3 text-center sm:mt-8">
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#FF6D00] sm:text-xs">
                Bem-vindo(a)
              </p>

              <h2 className="text-[28px] font-black leading-[1.05] tracking-[-0.04em] text-[#163326] sm:text-3xl">
                Sua nova rotina começa aqui.
              </h2>

              <p className="text-sm leading-6 text-[#163326]/60">
                Controle tarefas, saúde, treinos e produtividade em um só lugar.
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 sm:mt-7">
              <LoginOAuthButtons />
            </div>

            {/* Terms */}
            <p className="pt-5 text-center text-[11px] leading-5 text-[#163326]/45 sm:pt-6 sm:text-[12px]">
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
    </div>
  );
}