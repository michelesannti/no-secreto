"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Lock, BookOpen, User } from "lucide-react";

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
      <Link href={href} className="flex flex-col items-center">
        <div
          className={`
            w-11 h-11
            flex items-center justify-center
            rounded-full
            transition
            ${
              active
                ? "bg-[#e9d5bb]"
                : ""
            }
          `}
        >
          <Icon
            size={20}
            strokeWidth={1.7}
            className={
              active
                ? "text-[#70412d]"
                : "text-[#70412d]/40"
            }
          />
        </div>
      </Link>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[#f9f5e9]">

      {children}

      <nav className="fixed bottom-0 left-0 right-0 bg-[#f9f5e9] border-t border-[#e9d5bb] py-4 flex justify-around">
        <NavItem href="/hoje" Icon={CalendarDays} />
        <NavItem href="/secreto" Icon={Lock} />
        <NavItem href="/diario" Icon={BookOpen} />
        <NavItem href="/perfil" Icon={User} />
      </nav>
    </div>
  );
}