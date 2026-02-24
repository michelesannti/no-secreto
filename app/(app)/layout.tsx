"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, DoorOpen, BookOpen, User } from "lucide-react";

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
      <Link href={href} className="flex flex-col items-center relative">
        {active && (
          <div className="absolute -top-3 w-6 h-[2px] bg-[#70412d] rounded-full" />
        )}

        <Icon
          size={22}
          strokeWidth={1.5}
          className={
            active
              ? "text-[#70412d]"
              : "text-[#70412d]/40"
          }
        />
      </Link>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#f9f5e9]">

      {children}

      <nav className="fixed bottom-0 left-0 right-0 bg-[#f9f5e9] border-t border-[#e9d5bb] py-4 flex justify-around">
        <NavItem href="/hoje" Icon={Sparkles} />
        <NavItem href="/secreto" Icon={DoorOpen} />
        <NavItem href="/diario" Icon={BookOpen} />
        <NavItem href="/perfil" Icon={User} />
      </nav>
    </div>
  );
}