"use client";

import Link from "next/link";

export default function HojePage() {
  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f9f5e9] flex flex-col items-center justify-between pt-16 pb-32 px-8 text-center">

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
        className="w-full max-w-sm px-8 py-4 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide shadow-md transition hover:scale-[1.02] animate-buttonEntrance text-center"
      >
        Iniciar meu tempo com Deus
      </Link>

      <style jsx>{`
        @keyframes logoEntrance {
          0% {
            opacity: 0;
            transform: translateY(30px);
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
          animation: logoEntrance 1.2s ease-out;
        }

        .animate-buttonEntrance {
          animation: buttonEntrance 1.2s ease-out;
          animation-delay: 0.8s;
          animation-fill-mode: both;
        }
      `}</style>

    </div>
  );
}