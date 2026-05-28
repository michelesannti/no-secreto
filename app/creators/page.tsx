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
          <div className="mb-14">

            <h1 className="text-[30px] leading-[1.05] font-serif uppercase">
              Briefing para
              <br />
              <span className="italic opacity-80">
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
        <section className="mb-28">

          <div className="space-y-10">

            <div className="space-y-5">

              <p className="uppercase tracking-[0.18em] text-[17px] opacity-35">
                Sobre o No Secreto
              </p>

              <div className="w-10 h-[2px] bg-[#E9D5BB]"></div>

            </div>

            <div className="space-y-7 text-[19px] leading-[1.5] font-serif">

              <p>
                O No Secreto não é apenas um aplicativo.
                <br />
                É um lugar de
                {" "}
                <span className="italic opacity-80">
                  encontro com Deus
                </span>
                .
              </p>

              <p>
                Nasceu da dificuldade de permanecer,
                da culpa de começar e parar,
                da sensação de nunca conseguir manter
                {" "}
                <span className="italic opacity-80">
                  constância espiritual
                </span>
                .
              </p>

              <p>
                Foi criado para mulheres que querem voltar para Deus
                de forma leve,
                {" "}
                <span className="italic opacity-80">
                  profunda
                </span>
                {" "}
                e real.
              </p>

            </div>

          </div>

        </section>

        {/* DORES */}
        <section className="mb-28">

          <div className="space-y-10">

            <div className="space-y-5">

              <p className="uppercase tracking-[0.18em] text-[17px] opacity-35">
                Principais dores
              </p>

              <div className="w-10 h-[2px] bg-[#E9D5BB]"></div>

            </div>

            <div className="space-y-7 text-[19px] leading-[1.5] font-serif">

              <p>
                mulheres que querem se aproximar de Deus,
                mas não conseguem manter
                {" "}
                <span className="italic opacity-80">
                  constância
                </span>
              </p>

              <p>
                se sentem culpadas por começar e parar
              </p>

              <p>
                não sabem por onde estudar a Bíblia
              </p>

              <p>
                sentem a vida desalinhada
                {" "}
                <span className="italic opacity-80">
                  espiritualmente
                </span>
              </p>

            </div>

          </div>

        </section>

        {/* TRANSFORMAÇÕES */}
        <section className="mb-28">

          <div className="space-y-10">

            <div className="space-y-5">

              <p className="uppercase tracking-[0.18em] text-[17px] opacity-35">
                Principais transformações
              </p>

              <div className="w-10 h-[2px] bg-[#E9D5BB]"></div>

            </div>

            <div className="space-y-7 text-[19px] leading-[1.5] font-serif">

              <p>
                entender a Palavra
                {" "}
                <span className="italic opacity-80">
                  com clareza
                </span>
              </p>

              <p>
                ter constância sem culpa
              </p>

              <p>
                não depender de motivação
              </p>

              <p>
                transformar o tempo com Deus
                em parte da
                {" "}
                <span className="italic opacity-80">
                  rotina
                </span>
              </p>

            </div>

          </div>

        </section>

        {/* FORMATOS */}
        <section className="mb-28">

          <div className="space-y-10">

            <div className="space-y-5">

              <p className="uppercase tracking-[0.18em] text-[17px] opacity-35">
                Formatos que funcionam
              </p>

              <div className="w-10 h-[2px] bg-[#E9D5BB]"></div>

            </div>

            <div className="space-y-7 text-[19px] leading-[1.5] font-serif">

              <p>relatos pessoais</p>

              <p>rotina espiritual</p>

              <p>
                reflexões
                {" "}
                <span className="italic opacity-80">
                  profundas
                </span>
              </p>

              <p>
                experiência usando o No Secreto
              </p>

            </div>

          </div>

        </section>

        {/* EVITAR */}
        <section className="mb-32">

          <div className="space-y-10">

            <div className="space-y-5">

              <p className="uppercase tracking-[0.18em] text-[17px] opacity-35">
                O que evitar
              </p>

              <div className="w-10 h-[2px] bg-[#E9D5BB]"></div>

            </div>

            <div className="space-y-7 text-[19px] leading-[1.5] font-serif">

              <p>conteúdo forçado</p>

              <p>
                publicidade
                {" "}
                <span className="italic opacity-80">
                  agressiva
                </span>
              </p>

              <p>tom religioso pesado</p>

            </div>

          </div>

        </section>

        {/* FINAL */}
        <section className="text-center pb-24">

          <div className="space-y-10">

            <p className="text-[27px] leading-[1.2] font-serif">
              Mais do que divulgar
              <br />
              um aplicativo
            </p>

            <p className="text-[18px] leading-[1.8] opacity-80 font-serif px-3">
              o objetivo é fazer mulheres sentirem
              que existe um lugar seguro para voltar
              e permanecer em Deus
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}