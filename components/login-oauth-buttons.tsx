"use client";

import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { IoLogoApple } from "react-icons/io5";
import { createClient } from "@/lib/supabase/client";

type OAuthProvider = "google" | "apple";

function getRedirectUrl() {
  return `${window.location.origin}/auth/callback?next=/planner`;
}

export function LoginOAuthButtons() {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  async function signInWithProvider(provider: OAuthProvider) {
    setError(null);
    setLoadingProvider(provider);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        options: {
          redirectTo: getRedirectUrl(),
        },
        provider,
      });

      if (error) {
        setError(error.message);
        setLoadingProvider(null);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Nao foi possivel iniciar o login.",
      );
      setLoadingProvider(null);
    }
  }

  return (
    <>
      <button
        className="group mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FFA64D] font-bold text-white shadow-[0_15px_35px_rgba(255,109,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_45px_rgba(255,109,0,0.32)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        disabled={loadingProvider !== null}
        onClick={() => signInWithProvider("google")}
        type="button"
      >
        <FaGoogle className="text-[20px]" />
        {loadingProvider === "google" ? "Conectando..." : "Continuar com Google"}
      </button>

      <div className="relative my-6 flex items-center">
        <div className="flex-grow border-t border-black/5" />
        <span className="mx-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#163326]/40">
          ou continue com
        </span>
        <div className="flex-grow border-t border-black/5" />
      </div>

      <button
        className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-black/5 bg-white font-bold text-[#163326] outline-none transition hover:border-[#FF6D00]/40 hover:ring-4 hover:ring-[#FF6D00]/10 disabled:cursor-wait disabled:opacity-70"
        disabled={loadingProvider !== null}
        onClick={() => signInWithProvider("apple")}
        type="button"
      >
        <IoLogoApple className="text-[22px]" />
        {loadingProvider === "apple" ? "Conectando..." : "Apple"}
      </button>

      {error && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-center text-xs font-bold leading-5 text-red-600">
          {error}
        </p>
      )}
    </>
  );
}
