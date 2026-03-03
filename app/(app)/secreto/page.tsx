"use client";

export default function SecretoPage() {
  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]">

      {/* TOPO FULL WIDTH */}
      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">
          Secreto
        </h1>
        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
      </div>

      {/* CONTEÚDO CENTRALIZADO */}
      <div className="max-w-2xl mx-auto px-8">

        {/* PALAVRA */}
        <div className="mb-16">
          <p className="text-sm tracking-widest text-[#70412d]/50 mb-4">
            PALAVRA
          </p>

          <p className="italic text-lg leading-relaxed text-[#70412d]/85">
            "No princípio Deus criou os céus e a terra."
          </p>

          <p className="mt-3 text-sm text-[#70412d]/60">
            Gênesis 1:1 (NVI)
          </p>
        </div>

        {/* CONTEXTO */}
        <div className="mb-10">
          <p className="text-sm tracking-widest text-[#70412d]/50 mb-8">
            CONTEXTO
          </p>

          <div className="space-y-14">

            {/* QUEM */}
            <div>
              <h2 className="font-semibold text-[17px] text-[#70412d] mb-3">
                Quem é essa pessoa?
              </h2>
              <p className="leading-8 text-[#70412d]/85">
                Deus é apresentado aqui como Criador soberano. Antes de qualquer
                coisa existir, Ele já era. Não há explicação sobre Sua origem,
                porque Ele é eterno.
              </p>
            </div>

            {/* O QUE ESTAVA ACONTECENDO */}
            <div>
              <h2 className="font-semibold text-[17px] text-[#70412d] mb-3">
                O que estava acontecendo?
              </h2>
              <p className="leading-8 text-[#70412d]/85">
                Este versículo marca o começo da criação. A palavra “princípio”
                indica o início do tempo, da matéria e do espaço.
              </p>
            </div>

            {/* TRAZENDO PRA VIDA */}
            <div>
              <h2 className="font-semibold text-[17px] text-[#70412d] mb-3">
                Trazendo pra sua vida hoje
              </h2>
              <p className="leading-8 text-[#70412d]/85">
                O mesmo Deus que criou o universo do nada é capaz de organizar
                os seus próprios recomeços.
              </p>
            </div>

          </div>
        </div>

        {/* FRASE DESTACADA */}
        <div className="flex items-center justify-center mt-16 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-[1.5px] h-8 bg-[#e9d5bb]"></div>

            <p className="font-serif text-xl font-semibold text-center leading-snug">
              Deus continua criando novos começos
            </p>

            <div className="w-[1.5px] h-8 bg-[#e9d5bb]"></div>
          </div>
        </div>

        {/* BOTÃO */}
        <div className="mt-12 flex justify-center">
          <button
            className="px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide"
          >
            Concluir estudo
          </button>
        </div>

      </div>
    </div>
  );
}