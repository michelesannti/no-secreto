"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HojePage() {

  const [mostrarInstall, setMostrarInstall] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMostrarInstall(true);
    }, 1000);
  }, []);

  function fecharInstall() {
    setMostrarInstall(false);
  }

  return (
    <div className="h-[100dvh] bg-[#f9f5e9] flex flex-col items-center justify-center px-8 text-center gap-16">

      {/* LOGO */}
      <div>
        <img src="/logo.png" alt="No Secreto" className="w-[360px]" />
      </div>

      {/* BOTÃO */}
      <Link
        href="/secreto"
        className="px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9]"
      >
        Começar meu tempo com Deus
      </Link>

      {/* CARD */}
      {mostrarInstall && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#70412d] text-[#f9f5e9] px-5 py-4 rounded-xl shadow-lg max-w-sm text-center z-50">
          
          <p className="text-sm">
            Adicione o app à sua tela de início 🤎
          </p>

          <button
            onClick={fecharInstall}
            className="mt-3 text-xs opacity-70"
          >
            Entendi
          </button>
        </div>
      )}

    </div>
  );
}