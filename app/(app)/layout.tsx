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
          className={`
            flex items-center justify-center
            w-10 h-10
            rounded-2xl
            transition-all duration-300 ease-out
            ${
              active
                ? `
                  bg-[#eadcc7]
                  shadow-[inset_0_2px_4px_rgba(112,65,45,0.15),0_2px_6px_rgba(112,65,45,0.10)]
                  scale-105
                `
                : `bg-transparent`
            }
          `}
        >
          <Icon
            size={20}
            strokeWidth={active ? 2.4 : 1.6}
            className={
              active
                ? "text-[#5a3424]"
                : "text-[#70412d]/25"
            }
          />
        </div>
      </Link>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-[#f9f5e9]">
      {children}

      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <nav
          className="
            bg-[#f9f5e9]/90
            backdrop-blur-md
            px-7
            py-3
            rounded-3xl
            flex
            gap-7
            items-center
            shadow-[0_8px_25px_rgba(112,65,45,0.10)]
            border border-[#e9d5bb]/50
            w-fit
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