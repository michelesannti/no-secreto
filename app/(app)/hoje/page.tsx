import PortalIntro from "./PortalIntro";

export default function HojePage() {
  return (
    <PortalIntro>

      <div className="min-h-screen bg-[#f9f5e9] flex flex-col items-center justify-center">

        {/* PORTA / LOGO */}
        <a href="/secreto" className="flex flex-col items-center">

          <img
            src="/logo.png"
            alt="No Secreto"
            className="w-[70vw] max-w-[420px] drop-shadow-[0_0_30px_rgba(198,164,106,0.35)]"
          />

          {/* TEXTO ENTRAR */}
          <p className="mt-10 text-sm tracking-wide text-[#70412d]/60">
            toque para entrar no secreto
          </p>

        </a>

      </div>

    </PortalIntro>
  );
}