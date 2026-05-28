"use client";

export default function CreatorsPage() {
  return (
    <main className="bg-[#F9F5E9] text-[#70412D] min-h-screen py-20 px-6">

      <div className="max-w-3xl mx-auto">

        {/* CAPA */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center border-b border-[#E9D5BB]">

          <img
            src="/logo.png"
            alt="No Secreto"
            className="w-28 mb-12"
          />

          <h1 className="text-5xl md:text-6xl font-serif leading-tight max-w-2xl">
            Não é só estudo —
            <br />
            é encontro com Deus
          </h1>

          <div className="w-12 h-[2px] bg-[#E9D5BB] mt-10"></div>

          <p className="mt-10 uppercase tracking-[0.25em] text-sm opacity-40">
            briefing para creators
          </p>

        </section>

        {/* SOBRE */}
        <section className="py-28 border-b border-[#E9D5BB]">

          <div className="space-y-8">

            <p className="uppercase tracking-[0.2em] text-sm opacity-40">
              Sobre o No Secreto
            </p>

            <div className="w-12 h-[2px] bg-[#E9D5BB]"></div>

            <div className="space-y-8 text-[28px] leading-[1.55] font-serif">

              <p>
                O No Secreto não é apenas um aplicativo.
                É um lugar de encontro com Deus.
              </p>

              <p>
                Nasceu da dificuldade de permanecer,
                da culpa de começar e parar,
                da sensação de nunca conseguir manter constância espiritual.
              </p>

              <p>
                Foi criado para mulheres que querem voltar para Deus
                de forma leve, profunda e real.
              </p>

            </div>

          </div>

        </section>

        {/* DORES */}
        <section className="py-28 border-b border-[#E9D5BB]">

          <div className="space-y-14">

            <div className="space-y-5">

              <p className="uppercase tracking-[0.2em] text-sm opacity-40">
                Principais dores
              </p>

              <div className="w-12 h-[2px] bg-[#E9D5BB]"></div>

            </div>

            <div className="space-y-8 text-[26px] leading-[1.6] font-serif">

              <p>
                mulheres que querem se aproximar de Deus,
                mas não conseguem manter constância
              </p>

              <p>
                se sentem culpadas por começar e parar
              </p>

              <p>
                não sabem por onde estudar a Bíblia
              </p>

              <p>
                sentem a vida desalinhada espiritualmente
              </p>

            </div>

          </div>

        </section>

        {/* TRANSFORMAÇÕES */}
        <section className="py-28 border-b border-[#E9D5BB]">

          <div className="space-y-14">

            <div className="space-y-5">

              <p className="uppercase tracking-[0.2em] text-sm opacity-40">
                Principais transformações
              </p>

              <div className="w-12 h-[2px] bg-[#E9D5BB]"></div>

            </div>

            <div className="space-y-8 text-[26px] leading-[1.6] font-serif">

              <p>entender a Palavra com clareza</p>

              <p>ter constância sem culpa</p>

              <p>não depender de motivação</p>

              <p>
                transformar o tempo com Deus
                em parte da rotina
              </p>

            </div>

          </div>

        </section>

        {/* CONTEÚDO */}
        <section className="py-28 border-b border-[#E9D5BB]">

          <div className="space-y-20">

            {/* funciona */}
            <div className="space-y-12">

              <div className="space-y-5">

                <p className="uppercase tracking-[0.2em] text-sm opacity-40">
                  Formatos que funcionam
                </p>

                <div className="w-12 h-[2px] bg-[#E9D5BB]"></div>

              </div>

              <div className="space-y-8 text-[26px] leading-[1.6] font-serif">

                <p>relatos pessoais</p>

                <p>rotina espiritual</p>

                <p>reflexões profundas</p>

                <p>experiência usando o No Secreto</p>

              </div>

            </div>

            {/* evitar */}
            <div className="space-y-12">

              <div className="space-y-5">

                <p className="uppercase tracking-[0.2em] text-sm opacity-40">
                  O que evitar
                </p>

                <div className="w-12 h-[2px] bg-[#E9D5BB]"></div>

              </div>

              <div className="space-y-8 text-[26px] leading-[1.6] font-serif">

                <p>conteúdo forçado</p>

                <p>publicidade agressiva</p>

                <p>tom religioso pesado</p>

              </div>

            </div>

          </div>

        </section>

        {/* FINAL */}
        <section className="py-36 text-center">

          <div className="space-y-12">

            <p className="text-4xl md:text-5xl font-serif leading-[1.5]">
              O conteúdo não deve parecer propaganda.
              <br />
              Deve parecer experiência.
            </p>

            <div className="w-12 h-[2px] bg-[#E9D5BB] mx-auto"></div>

            <p className="text-xl leading-[1.9] opacity-80 max-w-2xl mx-auto">
              Mais do que divulgar o aplicativo,
              o objetivo é fazer mulheres sentirem
              que existe um lugar seguro para voltar
              e permanecer em Deus.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}