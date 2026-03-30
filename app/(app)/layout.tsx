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

  const isHoje = pathname === "/hoje";

  function NavItem({
    href,
    Icon,
  }: {
    href: string;
    Icon: any;
  }) {
    const active = pathname === href;

    return (
      <Link href={href} className="relative flex items-center justify-center">
        {active && (
          <div className="absolute w-12 h-12 rounded-2xl bg-[#e9d5bb]" />
        )}

        <Icon
          size={24}
          strokeWidth={active ? 2.3 : 1.5}
          className={active ? "text-[#70412d]" : "text-[#70412d]/25"}
        />
      </Link>
    );
  }

  return (
    <div className={isHoje ? "h-screen overflow-hidden bg-[#f9f5e9]" : "min-h-screen pb-32 bg-[#f9f5e9]"}>
      
      {children}

      {!isHoje && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <nav className="bg-[#f9f5e9]/90 backdrop-blur-lg px-10 py-4 rounded-3xl flex gap-10 items-center border border-[#e9d5bb]/60 shadow-[0_12px_30px_rgba(112,65,45,0.10)]">
            <NavItem href="/hoje" Icon={Home} />
            <NavItem href="/secreto" Icon={BookOpen} />
            <NavItem href="/diario" Icon={Pencil} />
            <NavItem href="/perfil" Icon={User} />
          </nav>
        </div>
      )}

    </div>
  );
}