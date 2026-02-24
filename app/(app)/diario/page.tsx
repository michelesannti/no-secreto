export default function DiarioPage() {
  const today = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="px-6 pt-12 pb-32 text-[#70412d]">

      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-xl tracking-wide opacity-80">Diário</h1>
        <span className="text-sm opacity-60">{today}</span>
      </div>

      {/* Título */}
      <div className="mb-12">
        <h2 className="text-3xl leading-snug font-light max-w-[320px]">
          O que Deus falou com você hoje?
        </h2>
      </div>

      {/* Área escrita */}
      <div className="relative">
        <textarea
          placeholder="Escreva aqui..."
          className="
            w-full
            h-[320px]
            bg-transparent
            resize-none
            outline-none
            text-lg
            leading-8
            placeholder:text-[#70412d]/40
          "
        />

        {/* Linhas sutis */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="border-b border-[#70412d]/10"
              style={{ marginTop: "32px" }}
            />
          ))}
        </div>
      </div>

    </div>
  );
}