import Link from "next/link";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col">
      <main className="flex-1">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e2df] flex justify-around py-3">
        <Link href="/hoje" className="text-sm text-[#3e3a36]">
          Hoje
        </Link>
        <Link href="/secreto" className="text-sm text-[#3e3a36]">
          Secreto
        </Link>
        <Link href="/diario" className="text-sm text-[#3e3a36]">
          Diário
        </Link>
        <Link href="/perfil" className="text-sm text-[#3e3a36]">
          Perfil
        </Link>
      </nav>
    </div>
  );
}