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
              className="h-40"
            />

          </div>

          {/* FRASE */}
          <div className="mb-24">

            <p className="font-serif text-2xl leading-relaxed">

              “Não é sobre fazer perfeito.
              <br />
              É sobre não desistir.”

            </p>

          </div>

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