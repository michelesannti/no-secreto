"use client";

import { useState } from "react";

export default function VendaPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-[#F9F5E9] text-[#70412D] overflow-hidden">

      <div className="relative max-w-md mx-auto px-6 py-8">

        {/* HERO */}
        <section className="text-center space-y-10 pt-2 mb-24">

          <div className="space-y-4">
            <img
              src="/logo.png"
              alt="No Secreto"
              className="w-28 h-28 mx-auto object-contain"
            />

            <div>
              <h2 className="text-xl font-serif tracking-wide">
                No Secreto
              </h2>

              <div className="w-10 h-[2px] bg-[#E9D5BB] mt-2 mx-auto"></div>
            </div>
          </div>

          <div className="space-y-7 pt-1">

            <div className="space-y-3 leading-none">

              <p className="text-[18px] tracking-[0.22em] uppercase opacity-30 font-light">
                parar
              </p>

              <p className="text-[18px] tracking-[0.22em] uppercase opacity-30 font-light">
                voltar
              </p>

              <p className="text-[18px] tracking-[0.22em] uppercase opacity-30 font-light">
                desistir
              </p>

              <p className="text-[18px] tracking-[0.22em] uppercase opacity-30 font-light">
                recomeçar
              </p>

            </div>

            <div>
              <h1 className="text-[26px] leading-[1.15] font-serif px-2">
                você não precisa
                <br />
                viver assim
                <span className="italic opacity-80"> com Deus</span>
              </h1>
            </div>

          </div>

          <a
            href="https://pay.cakto.com.br/aovfbto_873529"
            className="
              block
              bg-[#70412D]
              text-white
              py-4
              rounded-full
              text-[16px]
              font-semibold
              shadow-xl
              shadow-[#70412D]/20
              active:scale-[0.98]
              hover:scale-[1.015]
              transition-all
              duration-300
            "
          >
            Quero constância com Deus
          </a>

        </section>

        {/* 2º SCROLL */}
        <section className="flex items-center justify-between gap-5 mb-20">

          <div className="shrink-0 animate-floatMockup">

            <div className="
              relative
              w-[145px]
              rounded-[28px]
              border-[4px]
              border-black/80
              bg-black
              shadow-xl
              overflow-hidden
            ">

              <div
                className="
                  absolute
                  top-0
                  left-1/2
                  -translate-x-1/2
                  w-16
                  h-3
                  bg-black
                  rounded-b-2xl
                  z-10
                "
              />

              <img
                src="/portal.png"
                alt="Portal No Secreto"
                className="
                  w-full
                  h-full
                  object-cover
                  scale-[1.28]
                "
              />

            </div>

          </div>

          <div className="flex-1 text-left space-y-4">

            <p className="text-[24px] leading-[1.15] font-serif">
              não é falta
              <br />
              de
              <span className="italic opacity-80"> disciplina</span>
            </p>

            <div className="w-10 h-[2px] bg-[#E9D5BB]"></div>

            <p className="text-[20px] leading-[1.15] font-serif">
              é falta de um lugar
              <br />
              para
              <span className="italic opacity-80"> permanecer</span>
            </p>

          </div>

        </section>
{/* VÍDEO APP */}
<section className="mb-24">

  <div className="space-y-8">

    <div className="text-center space-y-3">

      <p
        className="
          text-[13px]
          uppercase
          tracking-[0.18em]
          opacity-35
        "
      >
        Conheça a experiência
      </p>

      <div className="w-10 h-[2px] bg-[#E9D5BB] mx-auto"></div>

    </div>

    <div className="flex justify-center">

      <video
        className="
          w-[220px]
          rounded-[26px]
          shadow-2xl
          overflow-hidden
        "
        controls
        playsInline
        preload="metadata"
        poster="/portal.png"
      >
        <source
          src="/videoapp.mp4"
          type="video/mp4"
        />
      </video>

    </div>

  </div>

</section>
        {/* DORES + TRANSFORMAÇÕES */}
        <section className="mb-24">

          <div className="grid grid-cols-2 gap-4 items-start">

            {/* DORES */}
            <div className="space-y-6">

              <div className="space-y-3">

                <p className="uppercase tracking-[0.18em] text-[14px] opacity-35 text-center">
                  Dores
                </p>

                <div className="w-10 h-[2px] bg-[#E9D5BB] mx-auto"></div>

              </div>

              <div className="flex flex-col items-center gap-2">

                {[
                  "Inconstância espiritual",
                  "Dificuldade na Palavra",
                  "Vida sem propósito",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center w-full rounded-full bg-[#e9d5bb]/30 text-[11px] text-[#70412d]/70 p-[2px]"
                  >

                    <div className="flex items-center justify-center bg-[#D9C2A0] rounded-full min-w-[24px] w-6 h-6 text-white text-[10px] shrink-0">
                      ✕
                    </div>

                    <div className="px-3 py-1 whitespace-nowrap">
                      {item}
                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* TRANSFORMAÇÕES */}
            <div className="space-y-6">

              <div className="space-y-3">

                <p className="uppercase tracking-[0.18em] text-[14px] opacity-35 text-center">
                  Transformações
                </p>

                <div className="w-10 h-[2px] bg-[#E9D5BB] mx-auto"></div>

              </div>

              <div className="flex flex-col items-center gap-2">

                {[
                  "Constância sem culpa",
                  "Clareza bíblica",
                  "Intimidade com Deus",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center w-full rounded-full bg-[#e9d5bb]/30 text-[11px] text-[#70412d]/70 p-[2px]"
                  >

                    <div className="flex items-center justify-center bg-[#C6A46A] rounded-full min-w-[24px] w-6 h-6 shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 011.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    <div className="px-3 py-1 whitespace-nowrap">
                      {item}
                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </section>

       {/* 3º SCROLL */}
<section className="space-y-7 mb-20">

  {/* CONTEXTO */}
  <div className="flex items-center justify-between gap-6">

    <div className="flex-1 space-y-4">

      <div className="space-y-3">

        <p
          className="
            text-[13px]
            uppercase
            tracking-[0.18em]
            opacity-35
          "
        >
          estudo guiado
        </p>

        <div className="w-10 h-[2px] bg-[#E9D5BB]"></div>

      </div>

      <p className="text-[17px] leading-[1.2] font-serif">
        sua forma de entender a
        <span className="italic opacity-80"> Palavra</span>
        <br />
        é transformada
      </p>

    </div>

    <div className="shrink-0">

      <div
        className="
          relative
          w-[145px]
          rounded-[28px]
          border-[3px]
          border-black
          bg-[#F9F5E9]
          shadow-xl
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2
            w-16
            h-[4px]
            bg-black
            rounded-b-2xl
            z-10
          "
        />

        <img
          src="/contexto.png"
          alt="Contexto bíblico"
          className="
            w-full
            block
            object-contain
          "
          loading="eager"
          decoding="async"
        />

      </div>

    </div>

  </div>

  {/* APLICAÇÃO */}
  <div className="flex items-center justify-between gap-6">

    <div className="shrink-0">

      <div
        className="
          relative
          w-[145px]
          rounded-[28px]
          border-[3px]
          border-black
          bg-[#F9F5E9]
          shadow-xl
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2
            w-16
            h-[4px]
            bg-black
            rounded-b-2xl
            z-10
          "
        />

        <img
          src="/aplicacao.png"
          alt="Aplicação bíblica"
          className="
            w-full
            block
            object-contain
          "
          loading="eager"
          decoding="async"
        />

      </div>

    </div>

    <div className="flex-1 text-right space-y-4">

      <div className="space-y-3">

        <p
          className="
            text-[13px]
            uppercase
            tracking-[0.12em]
            opacity-35
          "
        >
          aplicação prática
        </p>

        <div className="w-10 h-[2px] bg-[#E9D5BB] ml-auto"></div>

      </div>

      <p className="text-[18px] leading-[1.15] font-serif">
        você começa a
        <br />
        ouvir a
        <span className="italic opacity-80"> voz de Deus</span>
      </p>

    </div>

  </div>

</section>

        {/* 4º + 5º */}
        <section className="relative mb-16">

          {/* 4º */}
          <div className="flex items-center justify-between gap-5 mb-14">

            <div className="flex-1 space-y-4">

              <div className="space-y-3">

                <p className="
                  text-[13px]
                  uppercase
                  tracking-[0.12em]
                  opacity-35
                  whitespace-nowrap
                ">
                  diário espiritual
                </p>

                <div className="w-10 h-[2px] bg-[#E9D5BB]"></div>

              </div>

              <p className="text-[17px] leading-[1.2] font-serif">
                sua caminhada
                <br />
                fica
                {" "}
                <span className="italic opacity-80">
                  registrada
                </span>
              </p>

            </div>

            <img
              src="/diario.png"
              alt="Diário espiritual"
              className="
                w-[165px]
                rounded-[22px]
                shadow-2xl
                shrink-0
              "
            />

          </div>

          {/* 5º */}
          <div className="space-y-8">

            <div className="space-y-3 text-center">

              <p className="
                text-[13px]
                uppercase
                tracking-[0.18em]
                opacity-35
              ">
                constância
              </p>

              <div className="w-10 h-[2px] bg-[#E9D5BB] mx-auto"></div>

            </div>

            <div className="flex items-center justify-between gap-5">

              <img
                src="/perfil.png"
                alt="Constância espiritual"
                className="
                  w-[182px]
                  rounded-[26px]
                  shadow-2xl
                  shrink-0
                "
              />

              <div className="flex-1 text-left space-y-5">

                <div className="space-y-4">

                  <p className="text-[28px] leading-[1.02] font-serif">
                    pare de
                    <br />
                    <span className="italic opacity-80">
                      recomeçar
                    </span>
                  </p>

                  <p className="text-[24px] leading-[1.06] font-serif">
                    esse lugar te
                    <br />
                    faz
                    {" "}
                    <span className="italic opacity-80">
                      continuar
                    </span>
                  </p>

                </div>

                <p className="
                  text-[13px]
                  leading-[1.7]
                  uppercase
                  tracking-[0.08em]
                  opacity-45
                ">
                  nada zera
                  <br />
                  sem datas fixas
                  <br />
                  sem culpa
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* CTA FINAL */}
        <a
          href="https://pay.cakto.com.br/aovfbto_873529"
          className="
            block
            text-center
            bg-[#70412D]
            text-white
            py-4
            rounded-full
            text-[16px]
            font-semibold
            shadow-xl
            shadow-[#70412D]/20
            active:scale-[0.98]
            hover:scale-[1.015]
            transition-all
            duration-300
          "
        >
          Quero viver isso com Deus
        </a>

{/* DÚVIDAS */}
<section className="mt-24 mb-16">

  <div className="space-y-10">

    <div className="text-center space-y-3">

      <p
        className="
          text-[13px]
          uppercase
          tracking-[0.18em]
          opacity-35
        "
      >
        Dúvidas
      </p>

      <div className="w-10 h-[2px] bg-[#E9D5BB] mx-auto"></div>

    </div>

    <div className="space-y-4">

      {[
        {
          pergunta: "Preciso baixar o aplicativo?",
          resposta:
            "Não, o acesso é feito pelo navegador. Ao adicioná-lo à tela inicial funciona como um aplicativo, tanto no Android quanto no iPhone.",
        },
        {
          pergunta: "O acesso é por assinatura?",
          resposta:
            "Não. O acesso é liberado através de pagamento único, sem mensalidades.",
        },
        {
          pergunta: "Posso usar mesmo sem conhecer a Bíblia?",
          resposta:
            "Sim. Os estudos são guiados e explicados de forma simples, te ajudando a entender o contexto e aplicar a Palavra à sua vida.",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="
            bg-[#EFE2CC]/45
            rounded-[24px]
            overflow-hidden
            backdrop-blur-sm
          "
        >
          <button
            onClick={() =>
              setOpen(open === index ? null : index)
            }
            className="
              w-full
              flex
              items-center
              justify-between
              px-5
              py-5
              text-left
            "
          >
            <span
              className="
                font-serif
                text-[18px]
                leading-[1.25]
              "
            >
              {item.pergunta}
            </span>

            <span
              className="
                text-[24px]
                opacity-50
                ml-4
              "
            >
              {open === index ? "−" : "+"}
            </span>
          </button>

          {open === index && (
            <div className="px-5 pb-5">

              <div className="w-8 h-[2px] bg-[#D9C2A0] mb-4"></div>

              <p
                className="
                  text-[15px]
                  leading-7
                  opacity-80
                "
              >
                {item.resposta}
              </p>

            </div>
          )}
        </div>
      ))}

    </div>

  </div>

</section>

{/* CTA FINAL */}
<a
  href="https://pay.cakto.com.br/aovfbto_873529"
  className="
    block
    text-center
    bg-[#70412D]
    text-white
    py-4
    rounded-full
    text-[16px]
    font-semibold
    shadow-xl
    shadow-[#70412D]/20
    active:scale-[0.98]
    hover:scale-[1.015]
    transition-all
    duration-300
    mb-10
  "
>
  Começar meu tempo com Deus
</a>

      </div>

    </div>
  );
}