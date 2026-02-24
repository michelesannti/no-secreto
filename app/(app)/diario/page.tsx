export default function DiarioPage() {
  const today = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="relative px-8 pt-16 pb-32 text-[#70412d]">

      {/* Header minimalista */}
      <div className="flex justify-between items-center mb-16 opacity-70">
        <span className="tracking-wide">Diário</span>
        <span className="text-sm">{today}</span>
      </div>

      {/* Pergunta sutil */}
      <p className="text-base italic opacity-60 mb-10 max-w-[280px] leading-relaxed">
        O que Deus falou com você hoje?
      </p>

      {/* Conteúdo principal */}
      <div className="flex gap-8">

        {/* Área escrita */}
        <div className="flex-1 relative">
          <textarea
            placeholder="Comece a escrever..."
            className="
              w-full
              h-[420px]
              bg-transparent
              resize-none
              outline-none
              text-lg
              leading-9
              placeholder:text-[#70412d]/30
            "
          />

          {/* Linhas ultra sutis */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="border-b border-[#70412d]/8"
                style={{ marginTop: "36px" }}
              />
            ))}
          </div>
        </div>

        {/* Coluna lateral integrada */}
        <div className="w-[110px] flex flex-col gap-8 pt-2">

          <div className="
            bg-[#e9d5bb]/50
            rounded-[22px]
            px-4
            py-6
            text-xs
            leading-relaxed
            tracking-[0.15em]
            text-center
          ">
            VERSÍCULO
          </div>

          <div className="
            bg-[#e9d5bb]/35
            rounded-[22px]
            px-4
            py-6
            text-xs
            leading-relaxed
            tracking-[0.15em]
            text-center
          ">
            DESTAQUE
          </div>

        </div>
      </div>

    </div>
  );
}