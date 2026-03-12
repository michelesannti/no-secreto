import PortalIntro from "./PortalIntro";

export default function HojePage() {
  return (
    <PortalIntro>

      <div className="min-h-screen bg-[#f9f5e9] pt-28 pb-40 text-[#70412d]">

        <div className="max-w-2xl mx-auto px-8 text-center">

          {/* LOGO */}
          <div className="mb-24 flex justify-center">

            <img
              src="/logo.png"
              alt="No Secreto"
              className="h-40 drop-shadow-[0_0_20px_rgba(198,164,106,0.35)]"
            />

          </div>

          {/* FRASE */}
          <div className="mb-24 max-w-md mx-auto">

            <p className="font-serif text-2xl leading-relaxed text-[#70412d]/90">

              “Não é sobre fazer perfeito.
              <br />
              É sobre não desistir.”

            </p>

          </div>

          {/* LINHA DOURADA */}
          <div className="w-16 h-[2px] bg-[#C6A46A]/60 mx-auto mb-10"></div>

          {/* BOTÃO */}
          <a
            href="/secreto"
            className="block text-center py-4 rounded-full bg-[#70412d] text-[#f9f5e9] tracking-wide text-sm transition hover:opacity-90"
          >
            Iniciar meu tempo com Deus
          </a>

        </div>

      </div>

    </PortalIntro>
  );
}