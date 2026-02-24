export default function DiarioPage() {
  const today = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="min-h-screen bg-[#f9f5e9] text-[#70412d] px-6 pt-16 pb-32">

      {/* Header */}
      <div className="flex justify-between items-center mb-14 opacity-60 text-sm">
        <span>Diário</span>
        <span>{today}</span>
      </div>

      {/* Pergunta-direcionamento */}
      <p className="text-sm italic opacity-50 mb-8">
        O que Deus falou com você hoje?
      </p>

      {/* Área principal de escrita */}
      <div className="mb-16">
        <textarea
          placeholder="Escreva com calma..."
          className="
            w-full
            min-h-[280px]
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

      {/* Versículo */}
      <div className="mb-12">
        <p className="text-[11px] tracking-[0.25em] opacity-40 mb-4">
          VERSÍCULO
        </p>

        <textarea
          className="
            w-full
            min-h-[120px]
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
      <div>
        <p className="text-[11px] tracking-[0.25em] opacity-40 mb-4">
          DESTAQUE
        </p>

        <textarea
          className="
            w-full
            min-h-[120px]
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
  );
}