"use client";

export default function VendaPage() {
  return (
    <div className="min-h-screen bg-[#f9f5e9] text-[#70412d] px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-12">

        {/* HEADLINE */}
        <section className="space-y-4 text-center">
          <h1 className="text-3xl font-serif leading-snug">
            Você não precisa recomeçar sua vida com Deus toda semana — existe uma forma de continuar.
          </h1>

          <p className="text-sm opacity-70">
            Se você sempre recomeça… isso é pra você.
          </p>

          <p className="text-lg">
            Constância com Deus, mesmo na rotina corrida — sem culpa, sem pressão e sem recomeçar do zero.
          </p>
        </section>

        {/* IDENTIFICAÇÃO */}
        <section className="space-y-4">
          <p>Você ama Deus.</p>
          <p>Mas sua constância com Ele vai e volta.</p>
          <p>
            Você começa animada… mas falha um dia… dois… e quando vê, já parou.
          </p>
          <p>
            E aí vem a culpa. A sensação de estar falhando com Deus.
          </p>
          <p>
            “Se eu realmente amasse Deus… eu conseguiria manter”
          </p>
        </section>

        {/* VIRADA */}
        <section className="space-y-4">
          <p>Mas a verdade é:</p>
          <p>O problema nunca foi falta de amor.</p>
          <p>Foi falta de um caminho que você conseguisse sustentar.</p>
          <p>
            Você não precisa de mais cobrança.
            <br />
            Você precisa de um lugar que te ajude a continuar.
          </p>
        </section>

        {/* EXPERIÊNCIA */}
        <section className="space-y-6 text-center">
          <p>Nos primeiros dias, algo muda.</p>

          <p>Você sente vontade de voltar.</p>

          <img
            src="/portal.png"
            alt="Entrada do app"
            className="w-full max-w-xs mx-auto rounded-xl shadow-md"
          />

          <p>Sem esforço.</p>

          <p>Você entende o que está lendo.</p>

          <img
            src="/contexto.png"
            alt="Explicação do versículo"
            className="w-full max-w-xs mx-auto rounded-xl shadow-md"
          />

          <p>E consegue aplicar na sua vida.</p>

          <img
            src="/aplicacao.png"
            alt="Aplicação prática"
            className="w-full max-w-xs mx-auto rounded-xl shadow-md"
          />

          <p>E aos poucos… você para de desistir.</p>
        </section>

        {/* CONSTÂNCIA */}
        <section className="space-y-6 text-center">
          <p>Seu tempo com Deus começa a fazer parte da sua rotina.</p>

          <p>Não por obrigação.</p>

          <p>Mas porque você não quer perder esse momento.</p>

          <img
            src="/perfil.png"
            alt="Progresso no app"
            className="w-full max-w-xs mx-auto rounded-xl shadow-md"
          />

          <p>Você não recomeça.</p>
          <p>Você só continua.</p>
        </section>

        {/* DIÁRIO */}
        <section className="space-y-6 text-center">
          <p>Você começa a registrar sua vida.</p>

          <p>E quer continuar.</p>

          <p>
            Porque sabe que vai querer voltar depois
            e ver tudo o que mudou.
          </p>

          <img
            src="/diario.png"
            alt="Diário espiritual"
            className="w-full max-w-xs mx-auto rounded-xl shadow-md"
          />

          <p>Não é só um devocional.</p>

          <p>É a sua jornada com Deus registrada.</p>
        </section>

        {/* EXPERIÊNCIA ESPIRITUAL */}
        <section className="space-y-4">
          <p>Não é só leitura.</p>
          <p>Você começa a perceber Deus falando com você.</p>
          <p>E aquilo se confirma ao longo dos dias.</p>
          <p>Não é só entendimento.</p>
          <p>É relacionamento.</p>
        </section>

        {/* O QUE É */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">O que é o No Secreto?</h2>

          <p>Não é um devocional.</p>
          <p>Não é um plano de leitura.</p>

          <p>
            É um sistema simples que te mantém em movimento —
            mesmo quando você falha.
          </p>

          <p>Aqui, nada zera.</p>

          <p>
            Você não recomeça.
            <br />
            Você continua.
          </p>
        </section>

        {/* PRA QUEM É */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Pra quem é</h2>

          <ul className="space-y-2 list-disc pl-5">
            <li>Quer ter intimidade com Deus, mas não consegue manter constância</li>
            <li>Se sente culpada por começar e parar</li>
            <li>Não sabe por onde estudar a Bíblia</li>
            <li>Já tentou outros devocionais e não conseguiu continuar</li>
          </ul>
        </section>

        {/* PROMESSA */}
        <section className="space-y-4 text-center">
          <p className="text-lg font-medium">
            Em 30 dias, você não vai se tornar perfeita.
          </p>

          <p className="text-lg font-medium">
            Mas vai se tornar constante.
          </p>
        </section>

        {/* CTA */}
        <section className="pt-6">
          <a
            href="https://pay.cakto.com.br/aovfbto_873529"
            className="block text-center bg-[#70412d] text-[#f9f5e9] py-4 rounded-full text-sm font-medium hover:opacity-90 transition"
          >
            Quero parar de recomeçar e viver meu tempo com Deus 🤎
          </a>
        </section>

      </div>
    </div>
  );
}