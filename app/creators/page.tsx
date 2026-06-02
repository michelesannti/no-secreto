"use client";

export default function CreatorsPage() {
  return (
    <main className="bg-[#F9F5E9] text-[#70412D] min-h-screen overflow-hidden">

      <div className="max-w-md mx-auto px-6 py-10">

        {/* TOPO */}
        <section className="text-center mb-28">

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

              <div
                className="
                  relative
                  w-[190px]
                  rounded-[38px]
                  border-[4px]
                  border-black/80
                  bg-black
                  shadow-2xl
                  overflow-hidden
                "
              >

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

          </div>

        </section>

        {/* SOBRE */}
        <section className="mb-24">

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
                Criado para mulheres que querem
                {" "}
                <span className="italic opacity-80">
                  voltar para Deus
                </span>
                {" "}
                de forma leve, profunda e real.
              </p>

            </div>

          </div>

        </section>

        {/* FORMATOS */}
        <section className="mb-20">

          <div className="space-y-6">

            <div className="space-y-3">

              <p className="uppercase tracking-[0.18em] text-[14px] opacity-35 text-center">
                Formatos que funcionam
              </p>

              <div className="w-10 h-[2px] bg-[#E9D5BB] mx-auto"></div>

            </div>

            <div className="flex flex-col items-center gap-3">

              {[
                "Relatos pessoais",
                "Rotina espiritual",
                "Reflexões profundas",
                "Experiência usando o app",
              ].map((item, i) => (
                <div
                  key={i}
                  className="
                    flex
                    items-center
                    w-[280px]
                    rounded-full
                    bg-[#e9d5bb]/30
                    text-[13px]
                    text-[#70412d]/75
                    p-[3px]
                  "
                >

                  <div className="flex items-center justify-center bg-[#C6A46A] rounded-full min-w-[28px] w-7 h-7 shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-white"
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

                  <div className="flex-1 text-center px-4 py-2">
                    {item}
                  </div>

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* EVITAR */}
        <section className="mb-20">

          <div className="space-y-6">

            <div className="space-y-3">

              <p className="uppercase tracking-[0.18em] text-[14px] opacity-35 text-center">
                O que evitar
              </p>

              <div className="w-10 h-[2px] bg-[#E9D5BB] mx-auto"></div>

            </div>

            <div className="flex flex-col items-center gap-3">

              {[
                "Conteúdo forçado",
                "Publicidade agressiva",
                "Tom religioso pesado",
              ].map((item, i) => (
                <div
                  key={i}
                  className="
                    flex
                    items-center
                    w-[280px]
                    rounded-full
                    bg-[#e9d5bb]/30
                    text-[13px]
                    text-[#70412d]/75
                    p-[3px]
                  "
                >

                  <div className="flex items-center justify-center bg-[#D9C2A0] rounded-full min-w-[28px] w-7 h-7 text-white text-[11px] shrink-0">
                    ✕
                  </div>

                  <div className="flex-1 text-center px-4 py-2">
                    {item}
                  </div>

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* RESUMO FINAL */}
        <section className="pb-24">

          <div className="space-y-7 text-[19px] leading-[1.5] font-serif">

            <p>
              Mais do que divulgar o app —
              é viver essa experiência e inspirar outras mulheres
              a
              {" "}
              <span className="italic opacity-80">
                permanecerem em Deus.
              </span>
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}