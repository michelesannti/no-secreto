"use client";

export default function SecretoPage() {
  return (
    <div className="min-h-screen bg-[#f9f5e9] text-[#70412d]">

      {/* TOPO */}
      <div className="flex justify-between items-start px-8 pt-10">
        <h1 className="text-xl font-serif tracking-wide">
          Secreto
        </h1>
      </div>

      {/* CONTEÚDO CENTRALIZADO */}
      <div className="max-w-2xl mx-auto px-8 pt-12 pb-32">

        {/* PALAVRA */}
        <div className="mb-16">
          <h2 className="text-sm tracking-widest text-[#70412d]/50 mb-4">
            PALAVRA
          </h2>

          <p className="italic text-lg leading-relaxed text-[#70412d]/80">
            "No princípio Deus criou os céus e a terra."
          </p>

          <p className="mt-3 text-sm text-[#70412d]/60">
            Gênesis 1:1 (NVI)
          </p>
        </div>

        {/* PRA ENTENDER MELHOR */}
        <div className="space-y-14">

          <div>
            <h3 className="font-serif text-lg mb-3">
              Quem é essa pessoa?
            </h3>
            <p className="leading-8 text-[#70412d]/80">
              Deus é apresentado aqui como Criador soberano. Antes de qualquer
              coisa existir, Ele já era. Não há explicação sobre Sua origem,
              porque Ele é eterno. Gênesis começa revelando não um argumento,
              mas uma verdade: Deus é o início de tudo.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-3">
              O que estava acontecendo?
            </h3>
            <p className="leading-8 text-[#70412d]/80">
              Este versículo marca o começo da criação. Não havia forma,
              organização ou vida como conhecemos. Deus inicia a história
              trazendo ordem ao caos. A palavra “princípio” indica o início do
              tempo, da matéria e do espaço.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-3">
              Trazendo pra sua vida hoje
            </h3>
            <p className="leading-8 text-[#70412d]/80">
              Se Deus é o Criador do começo de todas as coisas, Ele também é
              capaz de iniciar novos começos na sua vida. O mesmo Deus que criou
              o universo do nada é capaz de organizar os seus próprios
              recomeços.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-3">
              Uma frase pra guardar
            </h3>
            <p className="italic leading-8 text-[#70412d]">
              Deus continua criando novos começos.
            </p>
          </div>

        </div>

        {/* BOTÃO CONCLUIR */}
        <div className="mt-20">
          <button
            className="
              w-full
              bg-[#70412d]
              text-[#f9f5e9]
              py-4
              font-serif
              tracking-wide
              transition
              hover:opacity-90
            "
          >
            Concluir estudo
          </button>
        </div>

      </div>
    </div>
  );
}