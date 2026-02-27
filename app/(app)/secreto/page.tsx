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
      <div className="max-w-2xl mx-auto px-8 space-y-12">

        {/* PALAVRA */}
        <section className="space-y-4">
          <h2 className="text-sm tracking-widest uppercase text-[#70412d]/60">
            Palavra
          </h2>

          <p className="italic text-[#70412d]/85 leading-relaxed">
            Aqui ficará o versículo base do estudo.
          </p>
        </section>

        {/* PRA ENTENDER MELHOR */}
        <section className="space-y-10">

          <h2 className="text-sm tracking-widest uppercase text-[#70412d]/60">
            Pra entender melhor
          </h2>

          {/* QUEM É ESSA PESSOA */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg">
              Quem é essa pessoa?
            </h3>
            <p className="leading-relaxed text-[#70412d]/90">
              Aqui entra a explicação contextual sobre os personagens envolvidos no texto.
            </p>
          </div>

          {/* O QUE ESTAVA ACONTECENDO */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg">
              O que estava acontecendo?
            </h3>
            <p className="leading-relaxed text-[#70412d]/90">
              Aqui você explica o contexto histórico, cultural e o significado das palavras-chave.
            </p>
          </div>

          {/* TRAZENDO PRA SUA VIDA HOJE */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg">
              Trazendo pra sua vida hoje
            </h3>
            <p className="leading-relaxed text-[#70412d]/90">
              Aqui entra a aplicação prática do texto para a vida da usuária.
            </p>
          </div>

        </section>

        {/* UMA FRASE PRA GUARDAR */}
        <section className="flex items-center justify-center pt-8">

          <div className="flex items-center gap-4">

            <div className="w-[1.5px] h-10 bg-[#e9d5bb]"></div>

            <p className="font-serif text-xl font-semibold text-center leading-tight max-w-md">
              Uma frase para guardar.
            </p>

            <div className="w-[1.5px] h-10 bg-[#e9d5bb]"></div>

          </div>

        </section>

      </div>
    </div>
  );
}