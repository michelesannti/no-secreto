"use client";

import { useState } from "react";

export default function VendaPage() {
  const [open, setOpen] = useState<number | null>(null);

  const styles = {
    body: { backgroundColor: "#F9F5E9", color: "#70412D" },
    logoContainer: { width: "112px", height: "112px", display: "flex", alignItems: "center", justifyContent: "center" },
    divider: { backgroundColor: "#E9D5BB", width: "40px", height: "2px" },
    ctaButton: {
      backgroundColor: "#70412D",
      color: "#FFFFFF",
      borderRadius: "9999px",
      display: "block",
      paddingTop: "1rem",
      paddingBottom: "1rem",
      boxShadow: "0 20px 25px -5px rgba(112, 65, 45, 0.2)",
    },
    mockupContainer: {
      position: "relative" as const,
      width: "145px",
      height: "280px",
      borderRadius: "28px",
      border: "4px solid rgba(0, 0, 0, 0.8)",
      backgroundColor: "#000000",
      overflow: "hidden",
    },
    contextoContainer: {
      position: "relative" as const,
      width: "145px",
      height: "260px",
      borderRadius: "28px",
      border: "3px solid #000000",
      backgroundColor: "#F9F5E9",
      overflow: "hidden",
    },
  };

  return (
    <div className="min-h-screen bg-[#F9F5E9] text-[#70412D] overflow-hidden" style={styles.body}>
      <div className="relative max-w-md mx-auto px-6 py-8">

        {/* HERO */}
        <section className="text-center space-y-10 pt-2 mb-24">
          <div className="space-y-4">
            <div className="mx-auto relative" style={styles.logoContainer}>
              <img
                src="/logo.webp"
                alt="No Secreto"
                width="112"
                height="112"
                style={{ width: "112px", height: "112px", objectFit: "contain" }}
              />
            </div>
            <div>
              <h2 className="text-xl font-serif tracking-wide">
                No Secreto
              </h2>
              <div className="mt-2 mx-auto" style={styles.divider}></div>
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

          <div className="space-y-3">
            <a
              href="https://pay.cakto.com.br/aovfbto_873529"
              style={styles.ctaButton}
              className="
                text-[16px]
                font-semibold
                text-center
                shadow-xl
                shadow-[#70412D]/20
                active:scale-[0.98]
                hover:scale-[1.015]
                transition-transform
                duration-300
              "
            >
              Quero constância com Deus
            </a>

            <p className="text-[11px] uppercase tracking-[0.05em] opacity-50 font-medium text-center">
              por apenas R$29,90/mês • menos de R$1 por dia
            </p>
          </div>
        </section>

        {/* 2º SCROLL */}
        <section className="flex items-center justify-between gap-5 mb-20">
          <div className="shrink-0 animate-floatMockup">
            <div className="shadow-xl" style={styles.mockupContainer}>
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
                src="/portal.webp"
                alt="Portal No Secreto"
                style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.28)" }}
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

            <div className="bg-[#E9D5BB]" style={{ width: "40px", height: "2px" }}></div>

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
              <div className="mx-auto" style={styles.divider}></div>
            </div>

            <div className="flex justify-center">
              <video
                className="
                  w-[220px]
                  h-[390px]
                  rounded-[26px]
                  shadow-2xl
                  overflow-hidden
                  object-cover
                "
                controls
                playsInline
                preload="metadata"
                poster="/portal.webp"
                style={{ width: "220px", height: "390px" }}
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
                  Antes
                </p>
                <div className="mx-auto" style={styles.divider}></div>
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
                    <div className="flex items-center justify-center bg-[#D9C2A0] rounded-full min-w-[24px] w-6 h-6 text-white text-[10px] shrink-0 shadow-inner">
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
                  Depois
                </p>
                <div className="mx-auto" style={styles.divider}></div>
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
                    <div className="flex items-center justify-center bg-[#C6A46A] rounded-full min-w-[24px] w-6 h-6 shrink-0 shadow-inner">
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
                <div style={styles.divider}></div>
              </div>

              <p className="text-[17px] leading-[1.25] font-serif">
                <span className="font-semibold opacity-90">7 minutos</span> para
                <br />
                entender a <span className="italic opacity-80">Palavra</span>
                <br />
                de forma simples
              </p>
            </div>

            <div className="shrink-0">
              <div className="shadow-xl" style={styles.contextoContainer}>
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
                  src="/contexto.webp"
                  alt="Contexto bíblico"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>

          {/* APLICAÇÃO */}
          <div className="flex items-center justify-between gap-6">
            <div className="shrink-0">
              <div className="shadow-xl" style={styles.contextoContainer}>
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
                  src="/aplicacao.webp"
                  alt="Aplicação bíblica"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
                <div className="ml-auto" style={styles.divider}></div>
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
        <section className="relative mb-20">
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
                <div style={styles.divider}></div>
              </div>

              <p className="text-[17px] leading-[1.2] font-serif">
                sua caminhada
                <br />
                fica{" "}
                <span className="italic opacity-80">
                  registrada
                </span>
              </p>
            </div>

            <img
              src="/diario.webp"
              alt="Diário espiritual"
              className="
                w-[165px]
                h-auto
                rounded-[22px]
                shadow-2xl
                shrink-0
              "
              style={{ width: "165px", height: "auto" }}
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
              <div className="mx-auto" style={styles.divider}></div>
            </div>

            <div className="flex items-center justify-between gap-5">
              <img
                src="/perfil.webp"
                alt="Constância espiritual"
                className="
                  w-[182px]
                  h-auto
                  rounded-[26px]
                  shadow-2xl
                  shrink-0
                "
                style={{ width: "182px", height: "auto" }}
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
                    faz{" "}
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

        {/* ANCORAGEM VISUAL DE ASSINATURA + CTA PRINCIPAL */}
        <section className="mb-24 space-y-4">
          <div className="bg-[#EFE2CC]/60 rounded-[32px] p-8 sm:p-9 border border-[#E9D5BB] text-center space-y-7 backdrop-blur-sm shadow-sm">
            <div className="space-y-3">
              <p className="text-[13px] uppercase tracking-[0.22em] opacity-50 font-medium">
                Plano Mensal
              </p>

              {/* TÍTULO DOS 7 MINUTOS DIÁRIOS */}
              <p className="text-[15px] font-serif italic text-[#70412D]/90 opacity-80 pt-1">
                7 minutos diários com Deus
              </p>

              {/* PREÇO */}
              <div className="flex items-baseline justify-center gap-1.5 pt-1">
                <span className="text-[18px] font-sans font-semibold text-[#70412D]/80 leading-none">
                  R$
                </span>
                <span className="text-[42px] font-sans font-bold text-[#70412D] tracking-tight leading-none tabular-nums">
                  29,90
                </span>
                <span className="text-[14px] font-sans font-medium text-[#70412D]/60 leading-none">
                  /mês
                </span>
              </div>

              <p className="text-[11px] uppercase tracking-[0.12em] opacity-45 pt-1">
                menos de R$1 por dia
              </p>
            </div>

            <ul className="text-[14px] space-y-3.5 text-left w-full px-1 mx-auto opacity-85">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A46A] shrink-0 mt-2" />
                <span>Estudos em ordem guiada</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A46A] shrink-0 mt-2" />
                <span>Diário espiritual individual</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A46A] shrink-0 mt-2" />
                <span>Registro da sua jornada</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A46A] shrink-0 mt-2" />
                <span>Progresso sem datas fixas</span>
              </li>
            </ul>

            <div className="pt-1">
              <p className="text-[11px] uppercase tracking-[0.12em] opacity-45">
                Cancele quando quiser
              </p>
            </div>
          </div>

          <a
            href="https://pay.cakto.com.br/aovfbto_873529"
            style={styles.ctaButton}
            className="
              text-[16px]
              font-semibold
              text-center
              shadow-xl
              shadow-[#70412D]/20
              active:scale-[0.98]
              hover:scale-[1.015]
              transition-transform
              duration-300
            "
          >
            Começar meu tempo com Deus
          </a>
        </section>

        {/* TRANSFORMADAS (PROVA SOCIAL) */}
        <section className="mb-12">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <p
                className="
                  text-[13px]
                  uppercase
                  tracking-[0.18em]
                  opacity-35
                "
              >
                Transformadas
              </p>
              <div className="mx-auto" style={styles.divider}></div>
            </div>

            <div className="space-y-4 flex flex-col items-center">
              <img
                src="/feedback1.webp"
                alt="Feedback 1"
                className="w-full h-auto block"
                style={{ width: "100%", height: "auto" }}
              />
              <img
                src="/feedback2.webp"
                alt="Feedback 2"
                className="w-full h-auto block"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </section>

        {/* DÚVIDAS (FAQ) */}
        <section className="mb-16">
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
              <div className="mx-auto" style={styles.divider}></div>
            </div>

            <div className="space-y-4">
              {[
                {
                  pergunta: "Preciso baixar o aplicativo?",
                  resposta:
                    "O acesso é feito pelo navegador. Ao adicioná-lo à tela inicial, ele funciona como um aplicativo, sem ocupar espaço na memória.",
                },
                {
                  pergunta: "Como funciona a assinatura?",
                  resposta:
                    "O acesso é por assinatura mensal, mantendo sua jornada ativa com uso ilimitado dos estudos e diário espiritual, com liberdade para cancelar quando quiser.",
                },
                {
                  pergunta: "Posso escolher qual livro ou capítulo estudar?",
                  resposta:
                    "Esse é o maior segredo da sua constância: o app segue uma ordem guiada e intencional para te dar clareza no dia a dia e te conduzir a uma intimidade real com Deus.",
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
                          leading-6
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

        {/* CTA FINAL (APÓS O FAQ) */}
        <section className="mb-8">
          <a
            href="https://pay.cakto.com.br/aovfbto_873529"
            style={styles.ctaButton}
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
              transition-transform
              duration-300
            "
          >
            Quero viver isso com Deus
          </a>
        </section>

      </div>
    </div>
  );
}