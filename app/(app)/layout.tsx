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
        className="flex items-center justify-center transition-all duration-300"
      >
        <Icon
          size={24}
          strokeWidth={active ? 2 : 1.6}
          className={
            active
              ? "text-[#70412d]"
              : "text-[#70412d]/20"
          }
        />
      </Link>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[#f9f5e9]">
      {children}

      <nav className="fixed bottom-0 left-0 right-0 bg-[#f9f5e9] border-t border-[#e9d5bb]/60 py-4 flex justify-around items-center">
        <NavItem href="/hoje" Icon={Home} />
        <NavItem href="/secreto" Icon={BookOpen} />
        <NavItem href="/diario" Icon={Pencil} />
        <NavItem href="/perfil" Icon={User} />
      </nav>
    </div>
  );
}