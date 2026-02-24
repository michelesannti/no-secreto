export default function DiarioPage() {
  const today = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="relative min-h-screen bg-[#f9f5e9] text-[#70412d]">

      {/* Margem tipo encadernação */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#efe7d6]" />

      <div className="pl-20 pr-10 pt-20 pb-32">

        {/* Header mais sutil */}
        <div className="flex justify-between items-center mb-20 opacity-60 text-sm">
          <span>Diário</span>
          <span>{today}</span>
        </div>

        {/* Pergunta quase invisível */}
        <p className="italic text-sm opacity-40 mb-16 max-w-[240px]">
          O que Deus falou com você hoje?
        </p>

        <div className="flex gap-16">

          {/* Escrita principal */}
          <div className="flex-1 relative">

            <textarea
              placeholder="Escreva com calma..."
              className="
                w-full
                h-[500px]
                bg-transparent
                resize-none
                outline-none
                text-lg
                leading-[42px]
                placeholder:text-[#70412d]/25
              "
            />

            {/* Linhas mais naturais */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="border-b border-[#70412d]/8"
                  style={{ marginTop: "42px" }}
                />
              ))}
            </div>

          </div>

          {/* Coluna lateral mais solta */}
          <div className="w-[150px] flex flex-col gap-20 pt-8">

            <div>
              <p className="text-[11px] tracking-[0.25em] opacity-40 mb-4">
                VERSÍCULO
              </p>
              <textarea
                className="
                  w-full
                  h-[160px]
                  bg-[#e9d5bb]/30
                  rounded-[30px]
                  p-6
                  resize-none
                  outline-none
                  text-sm
                  leading-relaxed
                "
              />
            </div>

            <div>
              <p className="text-[11px] tracking-[0.25em] opacity-40 mb-4">
                DESTAQUE
              </p>
              <textarea
                className="
                  w-full
                  h-[160px]
                  bg-[#e9d5bb]/22
                  rounded-[30px]
                  p-6
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
    </div>
  );
}