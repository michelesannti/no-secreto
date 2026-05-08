"use client";

export default function VendaPage() {
  return (
    <div className="min-h-screen bg-[#F9F5E9] text-[#70412D] overflow-hidden">

      <div className="relative max-w-md mx-auto px-6 py-8 space-y-24">

        {/* HERO */}
        <section className="text-center space-y-10 pt-2">

          {/* LOGO */}
          <div className="space-y-4">
            <img
              src="/logo.png"
              alt="No Secreto"
              className="w-28 h-28 mx-auto object-contain"
            />

            <div>
              <h2 className="text-xl font-serif tracking-wide">
                No Secreto
              </h2>

              <div className="w-10 h-[2px] bg-[#E9D5BB] mt-2 mx-auto"></div>
            </div>
          </div>

          {/* HEADLINE */}
          <div className="space-y-7 pt-1">

            <div className="space-y-3 leading-none">

              <p className="text-[18px] tracking-[0.22em] uppercase opacity-35 font-light">
                parar
              </p>

              <p className="text-[18px] tracking-[0.22em] uppercase opacity-35 font-light">
                voltar
              </p>

              <p className="text-[18px] tracking-[0.22em] uppercase opacity-35 font-light">
                desistir
              </p>

              <p className="text-[18px] tracking-[0.22em] uppercase opacity-35 font-light">
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

          {/* CTA */}
          <a
            href="https://pay.cakto.com.br/aovfbto_873529"
            className="
              block
              bg-[#70412D]
              text-white
              py-4
              rounded-full
              text-sm
              font-medium
              shadow-xl
              shadow-[#70412D]/20
              active:scale-[0.98]
              transition
            "
          >
            Quero constância com Deus 🤎
          </a>

        </section>

        {/* 2º SCROLL */}
        <section className="flex items-center justify-between gap-5">

          {/* MOCKUP */}
          <div className="shrink-0">

            <div className="
              relative
              w-[145px]
              rounded-[28px]
              border-[4px]
              border-black/80
              bg-black
              shadow-xl
              overflow-hidden
            ">

              <div className="
                absolute
                top-0
                left-1/2
                -translate-x-1/2
                w-16
                h-3
                bg-black
                rounded-b-2xl
                z-10
              "></div>

              <img
                src="/portal.png"
                alt="Portal No Secreto"
                className="w-full h-full object-cover scale-[1.28]"
              />

            </div>

          </div>

          {/* TEXTO */}
          <div className="flex-1 text-left space-y-4">

            <p className="text-[24px] leading-[1.15] font-serif">
              não é falta
              <br />
              de
              <span className="italic opacity-80"> disciplina</span>
            </p>

            <div className="w-10 h-[2px] bg-[#E9D5BB]"></div>

            <p className="text-[22px] leading-[1.15] font-serif">
              é falta de um lugar
              <br />
              para
              <span className="italic opacity-80"> permanecer</span>
            </p>

          </div>

        </section>

        {/* IDENTIFICAÇÃO */}
        <section className="space-y-6 text-[16px] leading-relaxed">

          <p>Você ama Deus.</p>

          <p>
            Mas sua constância vai e volta.
          </p>

          <p>
            Você começa animada…
            para alguns dias depois…
            e sente culpa por isso.
          </p>

          <p className="opacity-70 italic">
            “se eu amasse Deus de verdade,
            eu conseguiria manter”
          </p>

        </section>

        {/* BLOCO DESTAQUE */}
        <section className="bg-[#E9D5BB] p-8 rounded-[32px] text-center shadow-sm">
          <p className="text-2xl font-serif leading-snug">
            nunca foi falta de amor
          </p>
        </section>

        {/* PERFIL */}
        <section className="space-y-6 text-center">

          <div className="
            relative
            mx-auto
            w-[300px]
            rounded-[42px]
            border-[10px]
            border-black
            bg-black
            shadow-2xl
            overflow-hidden
          ">

            <div className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2
              w-32
              h-6
              bg-black
              rounded-b-3xl
              z-10
            "></div>

            <img
              src="/perfil.png"
              className="w-full block"
            />

          </div>

          <p className="text-sm opacity-70">
            constância visível. progresso real.
          </p>

        </section>

        {/* CONTEXTO */}
        <section className="space-y-6 text-center">

          <div className="
            relative
            mx-auto
            w-[300px]
            rounded-[42px]
            border-[10px]
            border-black
            bg-black
            shadow-2xl
            overflow-hidden
          ">

            <div className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2
              w-32
              h-6
              bg-black
              rounded-b-3xl
              z-10
            "></div>

            <img
              src="/contexto.png"
              className="w-full block"
            />

          </div>

          <p className="text-sm opacity-70">
            você entende. você aplica.
          </p>

        </section>

        {/* FRASE */}
        <section className="text-center space-y-3">

          <p className="text-3xl font-serif leading-tight">
            você não precisa se forçar
          </p>

          <p className="text-3xl font-serif leading-tight opacity-80">
            você começa a querer voltar
          </p>

        </section>

        {/* PROVA */}
        <section className="
          bg-[#E9D5BB]
          p-6
          rounded-[28px]
          text-center
          italic
          text-[15px]
          leading-relaxed
        ">
          “eu sinto vontade de voltar todos os dias”
        </section>

        {/* APLICAÇÃO */}
        <section className="text-center">

          <div className="
            relative
            mx-auto
            w-[300px]
            rounded-[42px]
            border-[10px]
            border-black
            bg-black
            shadow-2xl
            overflow-hidden
          ">

            <div className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2
              w-32
              h-6
              bg-black
              rounded-b-3xl
              z-10
            "></div>

            <img
              src="/aplicacao.png"
              className="w-full block"
            />

          </div>

        </section>

        {/* DIÁRIO */}
        <section className="text-center space-y-5">

          <p className="text-3xl leading-tight font-serif">
            sua história com Deus
            começa a aparecer
          </p>

        </section>

        {/* PRINT DIÁRIO */}
        <section className="text-center">

          <div className="
            relative
            mx-auto
            w-[300px]
            rounded-[42px]
            border-[10px]
            border-black
            bg-black
            shadow-2xl
            overflow-hidden
          ">

            <div className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2
              w-32
              h-6
              bg-black
              rounded-b-3xl
              z-10
            "></div>

            <img
              src="/diario.png"
              className="w-full block"
            />

          </div>

        </section>

        {/* CLÍMAX */}
        <section className="text-center space-y-4">

          <p className="text-lg opacity-70">
            isso não é sobre devocional
          </p>

          <p className="text-4xl font-serif leading-tight">
            é sobre permanecer
          </p>

        </section>

        {/* CTA FINAL */}
        <a
          href="https://pay.cakto.com.br/aovfbto_873529"
          className="
            block
            text-center
            bg-[#70412D]
            text-white
            py-4
            rounded-full
            text-sm
            font-medium
            shadow-xl
            shadow-[#70412D]/20
            active:scale-[0.98]
            transition
          "
        >
          Quero parar de recomeçar 🤎
        </a>

      </div>
    </div>
  );
}