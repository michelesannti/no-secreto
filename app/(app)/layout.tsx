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
        className="relative flex items-center justify-center transition-all duration-300"
      >
        <div
          className={`transition-all duration-300 ${
            active ? "-translate-y-[2px]" : ""
          }`}
        >
          <Icon
            size={24}
            strokeWidth={active ? 2.4 : 1.4}
            className={
              active
                ? "text-[#70412d]"
                : "text-[#70412d]/20"
            }
          />
        </div>
      </Link>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-[#f9f5e9]">
      {children}

      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <nav
          className="
            bg-[#f9f5e9]/85
            backdrop-blur-lg
            px-12
            py-5
            rounded-[28px]
            flex
            gap-12
            items-center
            shadow-[0_8px_20px_rgba(112,65,45,0.10)]
            border border-[#e9d5bb]/50
          "
        >
          <NavItem href="/hoje" Icon={Home} />
          <NavItem href="/secreto" Icon={BookOpen} />
          <NavItem href="/diario" Icon={Pencil} />
          <NavItem href="/perfil" Icon={User} />
        </nav>
      </div>
    </div>
  );
}