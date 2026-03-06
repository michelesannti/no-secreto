export default function Hoje() {
  const nome = "Maria";
  const hora = new Date().getHours();

  let saudacao = "Bom dia";

  if (hora >= 12 && hora < 18) {
    saudacao = "Boa tarde";
  } else if (hora >= 18) {
    saudacao = "Boa noite";
  }

  return (
    <div className="px-8 pt-10 pb-32">

      <h1 className="text-3xl font-[var(--font-title)] mb-2">
        {saudacao} {nome} 🤎
      </h1>

      <p className="text-[var(--ns-brown)]/70 mb-10">
        Seu tempo com Deus começa aqui.
      </p>

      <div className="bg-white/40 backdrop-blur p-6 rounded-3xl border border-[var(--ns-beige)] shadow-sm">

        <p className="text-sm text-[var(--ns-brown)]/60 mb-3">
          Versículo do dia
        </p>

        <p className="text-lg font-medium leading-relaxed">
          “Buscai primeiro o Reino de Deus...” – Mateus 6:33
        </p>

      </div>
    </div>
  );
}