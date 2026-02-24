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
        {active && (
          <span
            className="
              absolute
              w-10
              h-10
              rounded-full
              bg-[#e9d5bb]
              blur-sm
              opacity-60
            "
          />
        )}

        <Icon
          size={24}
          strokeWidth={active ? 2.4 : 1.6}
          className={
            active
              ? "text-[#70412d] relative z-10"
              : "text-[#70412d]/25"
          }
        />
      </Link>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-[#f9f5e9]">
      {children}

      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <nav
          className="
            bg-[#f9f5e9]
            px-12
            py-5
            rounded-[30px]
            flex
            gap-12
            items-center
            shadow-[0_6px_18px_rgba(112,65,45,0.08)]
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