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

              <p className="text-[18px] tracking-[0.22em] uppercase opacity-30 font-light">
                parar
              </p>

              <p className="text-[18px] tracking-[0.22em] uppercase opacity-30 font-light">
                voltar
              </p>

              <p className="text-[18px] tracking-[0.22em] uppercase opacity-30 font-light">
                desistir
              </p>

              <p className="text-[18px] tracking-[0.22em] uppercase opacity-30 font-light">
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
            Quero constância com Deus
          </a>

        </section>

        {/* 2º SCROLL */}
        <section className="flex items-center justify-between gap-5">

          {/* MOCKUP */}
          <div className="shrink-0 animate-floatMockup">

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

              <div
                className="
                  absolute
                  top-0
                  left-1/2
                  -translate-x-1/2
                  w-16
                  h-3
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

          {/* TEXTO */}
          <div className="flex-1 text-left space-y-4">

            <p className="text-[24px] leading-[1.15] font-serif">
              não é falta
              <br />
              de
              <span className="italic opacity-80"> disciplina</span>
            </p>

            <div className="w-10 h-[2px] bg-[#E9D5BB]"></div>

            <p className="text-[20px] leading-[1.15] font-serif">
              é falta de um lugar
              <br />
              para
              <span className="italic opacity-80"> permanecer</span>
            </p>

          </div>

        </section>

        {/* 3º SCROLL */}
        <section className="space-y-7">

          {/* CONTEXTO */}
          <div className="flex items-center justify-between gap-6">

            <div className="flex-1 space-y-4">

              <div className="space-y-3">

                <p className="
                  text-[13px]
                  uppercase
                  tracking-[0.18em]
                  opacity-35
                ">
                  estudo guiado
                </p>

                <div className="w-10 h-[2px] bg-[#E9D5BB]"></div>

              </div>

              <p className="text-[17px] leading-[1.2] font-serif">
                sua forma de entender a
                <span className="italic opacity-80"> Palavra</span>
                <br />
                é transformada
              </p>

            </div>

            <div className="shrink-0">

              <div className="
                relative
                w-[145px]
                rounded-[28px]
                border-[3px]
                border-black
                bg-black
                shadow-xl
                overflow-hidden
              ">

                <div
                  className="
                    absolute
                    top-0
                    left-1/2
                    -translate-x-1/2
                    w-16
                    h-[4px]
                    bg-black
                    rounded-b-2xl
                    z-10
                  "
                />

                <img
                  src="/contexto.png"
                  alt="Contexto bíblico"
                  className="
                    w-full
                    block
                    object-contain
                  "
                />

              </div>

            </div>

          </div>

          {/* APLICAÇÃO */}
          <div className="flex items-center justify-between gap-6">

            <div className="shrink-0">

              <div className="
                relative
                w-[145px]
                rounded-[28px]
                border-[3px]
                border-black
                bg-black
                shadow-xl
                overflow-hidden
              ">

                <div
                  className="
                    absolute
                    top-0
                    left-1/2
                    -translate-x-1/2
                    w-16
                    h-[4px]
                    bg-black
                    rounded-b-2xl
                    z-10
                  "
                />

                <img
                  src="/aplicacao.png"
                  alt="Aplicação bíblica"
                  className="
                    w-full
                    block
                    object-contain
                  "
                />

              </div>

            </div>

            <div className="flex-1 text-right space-y-4">

              <div className="space-y-3">

                <p className="
                  text-[13px]
                  uppercase
                  tracking-[0.12em]
                  opacity-35
                ">
                  aplicação prática
                </p>

                <div className="w-10 h-[2px] bg-[#E9D5BB] ml-auto"></div>

              </div>

              <p className="text-[18px] leading-[1.15] font-serif">
                você começa a
                <br />
                ouvir a
                <span className="italic opacity-80"> voz de Deus</span>
              </p>

            </div>

          </div>

        </section>

        {/* 4º SCROLL — DIÁRIO */}
        <section className="text-center space-y-5">

          <div className="space-y-3">

            <p className="
              text-[13px]
              uppercase
              tracking-[0.18em]
              opacity-35
            ">
              diário espiritual
            </p>

            <div className="w-10 h-[2px] bg-[#E9D5BB] mx-auto"></div>

          </div>

          <p className="text-[20px] leading-[1.12] font-serif">
            sua
            {" "}
            <span className="italic opacity-80">caminhada</span>
            {" "}
            com Deus
            <br />
            fica
            {" "}
            <span className="italic opacity-80">registrada</span>
          </p>

          {/* PRINT DIÁRIO */}
          <img
            src="/diario.png"
            alt="Diário espiritual"
            className="
              w-[235px]
              mx-auto
              rounded-[24px]
              shadow-2xl
              rotate-[-2deg]
            "
          />

        </section>

        {/* 5º SCROLL — PERFIL */}
        <section className="space-y-6 text-center">

          <div className="space-y-3">

            <p className="
              text-[13px]
              uppercase
              tracking-[0.24em]
              opacity-35
            ">
              constância real
            </p>

            <div className="w-10 h-[2px] bg-[#E9D5BB] mx-auto"></div>

          </div>

          <p className="text-[31px] leading-[1.12] font-serif">
            sua caminhada
            <br />
            com Deus começa
            <br />
            a ganhar forma
          </p>

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

            <div
              className="
                absolute
                top-0
                left-1/2
                -translate-x-1/2
                w-32
                h-6
                bg-black
                rounded-b-3xl
                z-10
              "
            />

            <img
              src="/perfil.png"
              className="w-full block"
            />

          </div>

          <p className="text-sm opacity-70">
            constância visível. progresso real.
          </p>

        </section>

        {/* BLOCO DESTAQUE */}
        <section className="bg-[#E9D5BB] p-8 rounded-[32px] text-center shadow-sm">
          <p className="text-2xl font-serif leading-snug">
            nunca foi falta de amor
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
          Quero parar de recomeçar
        </a>

      </div>
    </div>
  );
}