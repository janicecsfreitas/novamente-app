import Image from "next/image";
import Link from "next/link";
import { ProfileAvatarLink } from "@/components/profile-avatar-link";
import logoHorizontal from "@/assets/logo_horizontal.png";

export type MenuKey = "routine" | "health" | "food" | "goals" | "data" | "profile";

type AppNavigationProps = {
  active?: MenuKey;
};

const headerMenuItems: Array<{
  id: MenuKey;
  label: string;
  href: string;
  icon: string;
}> = [
  { id: "routine", label: "Planner", href: "/planner", icon: "calendar_today" },
  {
    id: "health",
    label: "Saúde",
    href: "/saude/calculadoras",
    icon: "calculate",
  },
  {
    id: "food",
    label: "Alimentação",
    href: "/alimentacao/diario",
    icon: "restaurant",
  },
  { id: "data", label: "Dados", href: "/dados", icon: "monitoring" },
  { id: "goals", label: "Metas", href: "/metas", icon: "insights" },
];

const bottomMenuItems: Array<{
  id: MenuKey;
  label: string;
  href: string;
  icon: string;
}> = [
  { id: "routine", label: "Planner", href: "/planner", icon: "calendar_today" },
  {
    id: "health",
    label: "Saúde",
    href: "/saude/calculadoras",
    icon: "calculate",
  },
  {
    id: "food",
    label: "Diário",
    href: "/alimentacao/diario",
    icon: "restaurant",
  },
  { id: "data", label: "Dados", href: "/dados", icon: "monitoring" },
  { id: "goals", label: "Metas", href: "/metas", icon: "insights" },
  { id: "profile", label: "Perfil", href: "/perfil", icon: "person" },
];

export function AppHeader({ active }: AppNavigationProps) {
  return (
    <aside className="app-sidebar fixed left-0 top-0 z-50 hidden h-dvh w-72 border-r border-white/70 bg-white/90 px-5 py-6 shadow-[18px_0_50px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:flex md:flex-col">
      <Link
        className="flex items-center justify-center rounded-[1.75rem] bg-white px-4 py-3 shadow-[0_14px_35px_rgba(0,0,0,0.05)]"
        href="/planner"
      >
        <div className="flex w-full items-center justify-center">
          <Image
            src={logoHorizontal}
            alt="NovaMente"
            className="h-auto w-32 object-contain sm:w-36 lg:w-40"
            priority
          />
        </div>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {headerMenuItems.map((item) => {
          const isActive = item.id === active;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 rounded-[1.35rem] px-4 py-3 text-sm font-black transition-all duration-300 ${
                isActive
                  ? "bg-[#FF6B2C] text-white shadow-[0_16px_34px_rgba(255,107,44,0.22)]"
                  : "text-[#171717]/50 hover:bg-white hover:text-[#FF6B2C] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)]"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] transition ${
                  isActive ? "material-symbols-filled scale-110" : ""
                }`}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-[1.75rem] border border-black/5 bg-white/75 p-4 shadow-[0_14px_35px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/35">
              Conta
            </p>
            <p className="mt-1 text-sm font-black text-[#171717]">Perfil</p>
          </div>
          <ProfileAvatarLink />
        </div>
      </div>
    </aside>
  );
}

export function MobileBottomMenu({ active }: AppNavigationProps) {
  return (
    <nav className="fixed bottom-4 left-1/2 z-50 flex h-16 w-[calc(100%-20px)] max-w-md -translate-x-1/2 items-center justify-around rounded-[1.5rem] border border-white/70 bg-white/85 px-1 shadow-[0_18px_50px_rgba(0,0,0,0.14)] backdrop-blur-2xl md:hidden">
      {bottomMenuItems.map((item) => {
        const isActive = item.id === active;

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center rounded-[1rem] px-1 py-1 transition-all duration-200 active:scale-95 ${
              isActive
                ? "bg-[#FF6D00] text-white shadow-[0_10px_24px_rgba(255,109,0,0.25)]"
                : "text-black/35 hover:bg-[#f5f5f7] hover:text-[#FF6D00]"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                isActive ? "material-symbols-filled" : ""
              }`}
            >
              {item.icon}
            </span>

            <span className="mt-0.5 truncate text-[8px] font-black">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
