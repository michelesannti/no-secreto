export default function DiarioPage() {
  const today = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="px-10 pt-20 pb-32 text-[#70412d] bg-[#f9f5e9]">

      {/* Cabeçalho delicado */}
      <div className="flex justify-between items-center mb-16 opacity-60 text-sm">
        <span>Diário</span>
        <span>{today}</span>
      </div>

      {/* Pergunta sutil */}
      <p className="italic text-sm opacity-50 mb-14 max-w-[260px]">
        O que Deus falou com você hoje?
      </p>

      {/* Estrutura tipo página */}
      <div className="flex gap-12">

        {/* Área principal */}
        <div className="flex-1 relative">

          <textarea
            placeholder="Comece a escrever..."
            className="
              w-full
              h-[460px]
              bg-transparent
              resize-none
              outline-none
              text-lg
              leading-10
              placeholder:text-[#70412d]/30
            "
          />

          {/* Linhas suaves de caderno */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="border-b border-[#70412d]/10"
                style={{ marginTop: "40px" }}
              />
            ))}
          </div>
        </div>

        {/* Coluna lateral orgânica */}
        <div className="w-[140px] flex flex-col gap-14 pt-4">

          {/* Versículo */}
          <div className="relative">
            <p className="text-[11px] tracking-[0.2em] mb-3 opacity-50">
              VERSÍCULO
            </p>

            <textarea
              className="
                w-full
                h-[140px]
                bg-[#e9d5bb]/35
                rounded-[24px]
                p-5
                resize-none
                outline-none
                text-sm
                leading-relaxed
              "
            />
          </div>

          {/* Destaque */}
          <div className="relative">
            <p className="text-[11px] tracking-[0.2em] mb-3 opacity-50">
              DESTAQUE
            </p>

            <textarea
              className="
                w-full
                h-[140px]
                bg-[#e9d5bb]/25
                rounded-[24px]
                p-5
                resize-none
                outline-none
                text-sm
                leading-relaxed
              "
            />
          </div>

        </div>

      </div>

    </div>
  );
}