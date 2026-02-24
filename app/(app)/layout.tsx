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
          strokeWidth={active ? 2.3 : 1.5}
          className={
            active
              ? "text-[#70412d]"
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
        <nav className="
          bg-[#f9f5e9]/90
          backdrop-blur-md
          px-10
          py-4
          rounded-3xl
          flex
          gap-10
          items-center
          shadow-[0_10px_30px_rgba(112,65,45,0.12)]
          border border-[#e9d5bb]/60
        ">
          <NavItem href="/hoje" Icon={Home} />
          <NavItem href="/secreto" Icon={BookOpen} />
          <NavItem href="/diario" Icon={Pencil} />
          <NavItem href="/perfil" Icon={User} />
        </nav>
      </div>
    </div>
  );
}