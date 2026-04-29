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

      {/* MODAL */}
      {mostrarInstall && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          
          <div className="bg-[#f9f5e9] text-[#70412d] px-6 py-6 rounded-2xl shadow-lg max-w-sm text-center border border-[#e9d5bb]">
            
            <p className="text-base">
              Adicione o app à sua tela de início 🤎
            </p>

            <button
              onClick={fecharInstall}
              className="mt-6 px-5 py-2 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm"
            >
              Entendi
            </button>

          </div>
        </div>
      )}

    </div>
  );
}