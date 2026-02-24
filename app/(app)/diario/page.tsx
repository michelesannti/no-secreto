export default function DiarioPage() {
  const today = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="min-h-screen bg-[#f9f5e9] text-[#70412d] px-6 pt-16 pb-32">

      {/* Header */}
      <div className="flex justify-between items-center mb-14 opacity-60 text-sm">
        <span>Diário</span>
        <span>{today}</span>
      </div>

      {/* Versículo + Destaque */}
      <div className="flex gap-4 mb-12">

        {/* Versículo */}
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.25em] opacity-40 mb-3">
            VERSÍCULO
          </p>
          <textarea
            className="
              w-full
              min-h-[90px]
              bg-[#e9d5bb]/35
              rounded-[22px]
              p-4
              resize-none
              outline-none
              text-sm
              leading-relaxed
            "
          />
        </div>

        {/* Destaque */}
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.25em] opacity-40 mb-3">
            DESTAQUE
          </p>
          <textarea
            className="
              w-full
              min-h-[90px]
              bg-[#e9d5bb]/25
              rounded-[22px]
              p-4
              resize-none
              outline-none
              text-sm
              leading-relaxed
            "
          />
        </div>

      </div>

      {/* Pergunta-direcionamento */}
      <p className="text-sm italic opacity-50 mb-8">
        O que Deus falou com você através disso?
      </p>

      {/* Área principal */}
      <div>
        <textarea
          placeholder="Escreva com calma..."
          className="
            w-full
            min-h-[260px]
            bg-[#efe7d6]/40
            rounded-[28px]
            p-6
            resize-none
            outline-none
            text-base
            leading-7
            placeholder:text-[#70412d]/30
          "
        />
      </div>

    </div>
  );
}