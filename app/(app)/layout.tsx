"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `flex flex-col items-center text-sm ${
      pathname === path ? "text-[#3e3a36]" : "text-[#a39b94]"
    }`;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="p-6">{children}</div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">
        <Link href="/hoje" className={linkStyle("/hoje")}>
          Hoje
        </Link>

        <Link href="/secreto" className={linkStyle("/secreto")}>
          Secreto
        </Link>

        <Link href="/diario" className={linkStyle("/diario")}>
          Diário
        </Link>

        <Link href="/perfil" className={linkStyle("/perfil")}>
          Perfil
        </Link>
      </nav>
    </div>
  );
}