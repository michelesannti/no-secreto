"use client";

export default function CreatorsPage() {
  const styles = {
    mockupContainer: {
      position: "relative" as const,
      width: "190px",
      height: "367px",
      borderRadius: "38px",
      border: "4px solid rgba(0, 0, 0, 0.8)",
      backgroundColor: "transparent",
      overflow: "hidden",
    },
    divider: { backgroundColor: "#E9D5BB", width: "40px", height: "2px" },
  };

  return (
    <main className="bg-[#F9F5E9] text-[#70412D] min-h-screen overflow-hidden">
      {/* Pré-carregamento imediato no topo para exibição instantânea */}
      <link rel="preload" href="/portal.webp" as="image" type="image/webp" />

      <div className="max-w-md mx-auto px-6 py-10">

        {/* TOPO */}
        <section className="text-center mb-20">

          <div className="space-y-3 mb-14">
            <h2 className="text-xl font-serif tracking-wide">
              No Secreto
            </h2>
            <div className="w-10 h-[2px] bg-[#E9D5BB] mx-auto"></div>
          </div>

          {/* TÍTULO */}
          <div className="mb-12">
            <h1 className="text-[28px] leading-[1.12] font-serif uppercase">
              Briefing para
              <br />
              <span className="italic opacity-80 pr-1">
                creators
              </span>
            </h1>
          </div>

          {/* MOCKUP */}
          <div className="flex justify-center">
            <div className="shrink-0 animate-floatMockup">
              <div className="shadow-2xl" style={styles.mockupContainer}>
                {/* Notch / Câmera superior */}
                <div
                  className="
                    absolute
                    top-0
                    left-1/2
                    -translate-x-1/2
                    w-20
                    h-4
                    bg-black
                    rounded-b-2xl
                    z-10
                  "
                />

                {/* Imagem do Portal Pré-carregada */}
                <img
                  src="/portal.webp"
                  alt="Portal No Secreto"
                  // @ts-ignore
                  fetchPriority="high"
                  loading="eager"
                  decoding="sync"
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover", 
                    transform: "scale(1.28)" 
                  }}
                />
              </div>
            </div>
          </div>

        </section>

        {/* SOBRE */}
        <section className="mb-20">
          <div className="space-y-10">
            <div className="space-y-5">
              <p className="uppercase tracking-[0.18em] text-[17px] opacity-35">
                Sobre o No Secreto
              </p>
              <div className="w-10 h-[2px] bg-[#E9D5BB]"></div>
            </div>

            <div className="space-y-7 text-[19px] leading-[1.5] font-serif">
              <p>
                Não é só um aplicativo.
                <br />
                É um lugar de
                {" "}
                <span className="italic opacity-80">
                  encontro com Deus.
                </span>
              </p>

              <p>
                Nasceu da dificuldade de ter
                {" "}
                <span className="italic opacity-80">
                  constância espiritual
                </span>
                {" "}
                e da culpa de sempre começar e parar.
              </p>

              <p>
                Criado para mulheres que desejam
                {" "}
                <span className="italic opacity-80">
                  permanecer em Deus
                </span>
                {" "}
                de forma leve, profunda e real.
              </p>
            </div>
          </div>
        </section>

        {/* COMPARATIVO: O QUE FUNCIONA X O QUE EVITAR */}
        <section className="mb-20">
          <div className="grid grid-cols-2 gap-4 items-start">
            
            {/* O QUE FUNCIONA */}
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="uppercase tracking-[0.18em] text-[14px] opacity-35 text-center">
                  O que funciona
                </p>
                <div className="mx-auto" style={styles.divider}></div>
              </div>

              <div className="flex flex-col items-center gap-2">
                {[
                  "Relatos pessoais",
                  "Rotina com Deus",
                  "Experiência com o app",
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

            {/* O QUE EVITAR */}
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="uppercase tracking-[0.18em] text-[14px] opacity-35 text-center">
                  O que evitar
                </p>
                <div className="mx-auto" style={styles.divider}></div>
              </div>

              <div className="flex flex-col items-center gap-2">
                {[
                  "Conteúdo forçado",
                  "Publicidade agressiva",
                  "Tom religioso pesado",
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

          </div>
        </section>

        {/* PARCERIA */}
        <section className="mb-20">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="uppercase tracking-[0.18em] text-[14px] opacity-35 text-center">
                Parceria
              </p>
              <div className="w-10 h-[2px] bg-[#E9D5BB] mx-auto"></div>
            </div>

            {/* CARD UNIFICADO DE PARCERIA & COMISSIONAMENTO */}
            <div className="bg-[#EFE2CC]/60 rounded-[32px] p-7 border border-[#E9D5BB] text-center space-y-6 backdrop-blur-sm shadow-sm">
              
              {/* DESTAQUES COM MESMO PESO VISUAL */}
              <div className="grid grid-cols-2 gap-3 items-center border-b border-[#E9D5BB]/60 pb-5">
                {/* ASSINATURA */}
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.12em] opacity-50 font-medium">
                    Assinatura
                  </p>
                  <p className="text-[26px] font-sans font-bold text-[#70412D] tracking-tight leading-none tabular-nums">
                    R$ 29,90
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.08em] opacity-45 pt-0.5">
                    /mês
                  </p>
                </div>

                {/* DIVISOR VERTICAL INTERNO */}
                <div className="space-y-1 border-l border-[#E9D5BB]/80 pl-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] opacity-50 font-medium">
                    Sua Comissão
                  </p>
                  <p className="text-[26px] font-sans font-bold text-[#70412D] tracking-tight leading-none tabular-nums">
                    30%
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.08em] opacity-45 pt-0.5">
                    Todo mês
                  </p>
                </div>
              </div>

              {/* LISTA DE BENEFÍCIOS E REGRAS */}
              <ul className="text-[13px] space-y-3.5 text-left w-full px-1 mx-auto opacity-85">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6A46A] shrink-0 mt-2" />
                  <span>
                    <strong>Comissão Contínua:</strong> Você recebe a comissão todo mês enquanto a indicada continuar assinante.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6A46A] shrink-0 mt-2" />
                  <span>
                    <strong>Ganho Acumulativo:</strong> Quanto mais indicadas, maior o seu ganho mensal.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6A46A] shrink-0 mt-2" />
                  <span>
                    <strong>Divulgação:</strong> Marcar <strong><em>@nosecretoapp nos stories</em></strong> e postar em <strong><em>collab no feed</em></strong>.
                  </span>
                </li>
              </ul>
            </div>

            {/* OBSERVAÇÃO */}
            <div className="text-center px-4">
              <p className="text-[12px] leading-relaxed text-[#70412D]/60">
                Alguns conteúdos poderão ser republicados nas redes oficiais do No Secreto com os devidos créditos.
              </p>
            </div>
          </div>
        </section>

        {/* RESUMO FINAL */}
        <section className="pb-10">
          <div className="space-y-8">
            <div className="space-y-7 text-[19px] leading-[1.5] font-serif">
              <p>
                Mais do que divulgar o No Secreto —
                é viver essa experiência e inspirar outras mulheres
                a terem {" "}
                <span className="italic opacity-80">
                  constância com Deus sem culpa.
                </span>
              </p>
            </div>

            <a
              href="https://app.cakto.com.br/affiliate/invite/90601d16-2aba-4917-b63b-af09f9f173e7"
              target="_blank"
              rel="noopener noreferrer"
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
              Quero fazer parte disso
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}