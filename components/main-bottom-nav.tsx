import Link from "next/link";

type MainBottomNavProps = {
  active: "routine" | "health" | "food" | "data" | "goals";
};

const items = [
  { id: "routine", label: "Rotina", href: "/planner", icon: "calendar_today" },
  { id: "health", label: "Saúde", href: "/saude/calculadoras", icon: "calculate" },
  { id: "food", label: "Diário", href: "/alimentacao/diario", icon: "restaurant" },
  { id: "data", label: "Dados", href: "/dados", icon: "monitoring" },
  { id: "goals", label: "Metas", href: "/alimentacao/metas-macros", icon: "insights" },
] as const;

export function MainBottomNav({ active }: MainBottomNavProps) {
  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-[2rem] border border-white/70 bg-white/85 px-2 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.14)] backdrop-blur-2xl">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = item.id === active;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-[1.5rem] px-2 py-2 transition-all duration-200 active:scale-95 ${
                isActive
                  ? "bg-[#0071e3] text-white shadow-[0_10px_24px_rgba(0,113,227,0.25)]"
                  : "text-black/35 hover:bg-[#f5f5f7] hover:text-[#0071e3]"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[24px] ${
                  isActive ? "material-symbols-filled" : ""
                }`}
              >
                {item.icon}
              </span>

              <span className="mt-1 truncate text-[10px] font-black">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}