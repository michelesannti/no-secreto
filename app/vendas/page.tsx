"use client";

export default function VendaPage() {
  return (
    <div className="bg-[#f9f5e9] text-[#5a3828]">

      <div className="max-w-md mx-auto px-6 py-12 space-y-24">

        {/* HERO */}
        <section className="text-center space-y-6">
          <h1 className="text-3xl font-serif leading-snug">
            Você não precisa recomeçar sua vida com Deus toda semana.
          </h1>

          <p className="text-sm opacity-70">
            se isso te tocou… continua
          </p>

          <a
            href="https://pay.cakto.com.br/aovfbto_873529"
            className="block bg-[#5a3828] text-white py-4 rounded-full text-sm font-medium mt-6"
          >
            Quero viver isso 🤎
          </a>
        </section>

        {/* FRASE IMPACTO */}
        <section className="text-center space-y-2">
          <p className="text-2xl font-serif">
            talvez não seja falta de disciplina
          </p>
          <p className="text-2xl font-serif">
            talvez você só nunca teve um lugar pra permanecer
          </p>
        </section>

        {/* IDENTIFICAÇÃO */}
        <section className="space-y-6 text-[15px] leading-relaxed">
          <p>Você ama Deus.</p>
          <p>Mas sua constância vai e volta.</p>
          <p>Você começa… para… e sente culpa.</p>
        </section>

        {/* BLOCO DESTAQUE */}
        <section className="bg-[#efe3d3] p-6 rounded-2xl text-center">
          <p className="text-lg font-medium">
            nunca foi falta de amor
          </p>
        </section>

        {/* PRINT PERFIL (voltou 👇) */}
        <section className="text-center space-y-4">
          <img
            src="/perfil.png"
            className="w-[220px] mx-auto rounded-xl shadow-lg"
          />
          <p className="text-sm opacity-70">
            constância visível. progresso real.
          </p>
        </section>

        {/* PRINT CONTEXTO */}
        <section className="text-center space-y-4">
          <img
            src="/contexto.png"
            className="w-[220px] mx-auto rounded-xl shadow-lg"
          />
          <p className="text-sm opacity-70">
            você entende. você aplica.
          </p>
        </section>

        {/* FRASE IMPACTO */}
        <section className="text-center space-y-2">
          <p className="text-2xl font-serif">
            você não precisa se forçar
          </p>
          <p className="text-2xl font-serif">
            você começa a querer voltar
          </p>
        </section>

        {/* PROVA */}
        <section className="bg-[#efe3d3] p-5 rounded-xl text-sm italic text-center">
          “eu sinto vontade de voltar todos os dias”
        </section>

        {/* PRINT APLICAÇÃO */}
        <section className="text-center">
          <img
            src="/aplicacao.png"
            className="w-[220px] mx-auto rounded-xl shadow-lg"
          />
        </section>

        {/* DIÁRIO */}
        <section className="text-center space-y-3">
          <p className="text-2xl font-serif">
            sua história com Deus começa a aparecer
          </p>
        </section>

        {/* PRINT DIÁRIO */}
        <section className="text-center">
          <img
            src="/diario.png"
            className="w-[220px] mx-auto rounded-xl shadow-lg"
          />
        </section>

        {/* CLÍMAX */}
        <section className="text-center space-y-3">
          <p className="text-lg">isso não é sobre devocional</p>
          <p className="text-2xl font-semibold">é sobre permanecer</p>
        </section>

        {/* CTA FINAL */}
        <a
          href="https://pay.cakto.com.br/aovfbto_873529"
          className="block text-center bg-[#5a3828] text-white py-5 rounded-full text-base font-semibold"
        >
          Quero parar de recomeçar 🤎
        </a>

      </div>
    </div>
  );
}