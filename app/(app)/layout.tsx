"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, BookOpen, User } from "lucide-react";

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
        className="flex flex-col items-center"
      >
        <Icon
          size={22}
          strokeWidth={1.5}
          className={
            active
              ? "text-[#4e3b2f]"
              : "text-[#b6a798]"
          }
        />
      </Link>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#f4ede4]">

      {children}

      <nav className="fixed bottom-0 left-0 right-0 bg-[#f4ede4] border-t border-[#e5d8cc] py-4 flex justify-around">
        <NavItem href="/hoje" Icon={Home} />
        <NavItem href="/secreto" Icon={Heart} />
        <NavItem href="/diario" Icon={BookOpen} />
        <NavItem href="/perfil" Icon={User} />
      </nav>
    </div>
  );
}