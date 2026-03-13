"use client";

import Link from "next/link";

export default function HojePage() {
  return (
    <div className="min-h-screen bg-[#f9f5e9] flex flex-col items-center pt-16 px-8 text-center">

      {/* LOGO + FRASE */}

      <div className="flex flex-col items-center animate-logoEntrance">

        <img
          src="/logo.png"
          alt="No Secreto"
          className="w-[360px] -mb-1"
        />

        <p className="font-serif text-lg text-[#70412d]/80 leading-tight max-w-md -mt-1">

          “Não é sobre fazer perfeito.
          <br />
          É sobre não desistir.”

        </p>

      </div>

      {/* BOTÃO FIXADO NA PARTE INFERIOR */}

      <div className="fixed bottom-28 left-0 w-full flex justify-center px-8">

        <Link
          href="/secreto/1"
          className="w-full max-w-sm px-8 py-4 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide shadow-md transition hover:scale-[1.02] animate-buttonEntrance text-center"
        >
          Iniciar meu tempo com Deus
        </Link>

      </div>

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