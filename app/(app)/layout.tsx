"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Pencil, User } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function NavItem({
    href,
    Icon,
  }: {
    href: string;
    Icon: any;
  }) {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className="relative flex items-center justify-center"
      >
        {/* Fundo do ativo sem alterar largura */}
        {active && (
          <div className="absolute w-12 h-12 rounded-2xl bg-[#eadcc7] shadow-[inset_0_2px_4px_rgba(112,65,45,0.12)]"></div>
        )}

        <Icon
          size={24}
          strokeWidth={active ? 2.3 : 1.5}
          className={
            active
              ? "relative text-[#5a3424]"
              : "text-[#70412d]/25"
          }
        />
      </Link>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-[#f9f5e9]">
      {children}

      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <nav
          className="
            relative
            bg-[#f9f5e9]/88
            backdrop-blur-lg
            px-10
            py-4
            rounded-3xl
            flex
            gap-10
            items-center
            border border-[#e9d5bb]/60
            shadow-[0_12px_30px_rgba(112,65,45,0.10)]
          "
        >
          {/* Linha interna editorial */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/40"></div>

          <NavItem href="/hoje" Icon={Home} />
          <NavItem href="/secreto" Icon={BookOpen} />
          <NavItem href="/diario" Icon={Pencil} />
          <NavItem href="/perfil" Icon={User} />
        </nav>
      </div>
    </div>
  );
}