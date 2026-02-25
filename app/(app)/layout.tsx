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
        className="flex items-center justify-center"
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
                  shadow-[inset_0_2px_4px_rgba(112,65,45,0.12)]
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
            px-9
            py-3
            rounded-3xl
            flex
            gap-8
            items-center
            shadow-[0_12px_30px_rgba(112,65,45,0.08)]
            border border-[#e9d5bb]/50
            w-fit
            overflow-hidden
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