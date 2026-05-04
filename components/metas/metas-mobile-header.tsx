import Link from "next/link";

type MetasMobileHeaderProps = {
  title: string;
  backHref?: string;
};

export function MetasMobileHeader({ title, backHref }: MetasMobileHeaderProps) {
  return (
    <header className="relative bg-[#ef695f] px-4 pb-7 pt-8 text-white md:hidden">
      {backHref ? (
        <Link className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-white" href={backHref}>
          <span className="material-symbols-outlined text-4xl">chevron_left</span>
        </Link>
      ) : null}
      <h1 className="text-center text-4xl font-black tracking-tight">{title}</h1>
    </header>
  );
}
