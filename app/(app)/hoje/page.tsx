"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function HojePage() {

  // 🔥 BLOQUEIA SCROLL GLOBAL
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f9f5e9] flex flex-col items-center justify-center px-8 text-center gap-16">

      {/* LOGO */}
      <div className="flex flex-col items-center animate-logoEntrance">
        <img
          src="/logo.png"
          alt="No Secreto"
          className="w-[360px]"
        />
      </div>

      {/* BOTÃO */}
      <Link
        href="/secreto"
        className="
          px-6
          py-2
          rounded-full
          bg-[#70412d]
          text-[#f9f5e9]
          text-sm
          tracking-wide
          transition
          hover:opacity-90
          animate-buttonEntrance
        "
      >
        Iniciar meu tempo com Deus
      </Link>

      <style jsx>{`
        @keyframes logoEntrance {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes buttonEntrance {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-logoEntrance {
          animation: logoEntrance 1s ease-out;
        }

        .animate-buttonEntrance {
          animation: buttonEntrance 1s ease-out;
          animation-delay: 0.5s;
          animation-fill-mode: both;
        }
      `}</style>

    </div>
  );
}