"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Pencil, User } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isHoje = pathname === "/hoje";

  function NavItem({
    href,
    Icon,
  }: {
    href: string;
    Icon: any;
  }) {
    const active = pathname.startsWith(href);

    return (
      <Link
        href={href}
        className="relative flex items-center justify-center"
      >
        {active && (
          <div className="absolute w-12 h-12 rounded-2xl bg-[#e9d5bb] shadow-[inset_0_2px_4px_rgba(112,65,45,0.12)]"></div>
        )}

        <Icon
          size={24}
          strokeWidth={active ? 2.3 : 1.5}
          className={
            active
              ? "relative text-[#70412d]"
              : "text-[#70412d]/25"
          }
        />
      </Link>
    );
  }

  return (
    <div className={isHoje ? "h-screen overflow-hidden bg-[#f9f5e9]" : "min-h-screen bg-[#f9f5e9]"}>
      {children}

      {!isHoje && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <nav
            className="
              relative
              bg-[#f9f5e9]/90
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
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/40"></div>

            <NavItem href="/secreto" Icon={BookOpen} />
            <NavItem href="/diario" Icon={Pencil} />
            <NavItem href="/perfil" Icon={User} />
          </nav>
        </div>
      )}
    </div>
  );
}