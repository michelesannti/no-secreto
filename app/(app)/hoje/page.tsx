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
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-semibold text-[#3e3a36] mb-2">
        {saudacao} {nome}🤎
      </h1>

      <p className="text-[#6b645f] mb-6">
        Seu tempo com Deus começa aqui.
      </p>

      <div className="bg-[#f3eee9] p-4 rounded-2xl">
        <p className="text-sm text-[#6b645f] mb-2">
          Versículo do dia
        </p>
        <p className="text-[#3e3a36] font-medium">
          “Buscai primeiro o Reino de Deus...” – Mateus 6:33
        </p>
      </div>
    </div>
  );
}