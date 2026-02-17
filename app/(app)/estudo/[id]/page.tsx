import { estudos } from "../../../../data/estudos";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EstudoPage({ params }: PageProps) {
  const { id } = await params;

  const estudo = estudos.find((e) => e.id === Number(id));

  if (!estudo) {
    return (
      <div className="p-6">
        Estudo não encontrado. ID recebido: {id}
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-[#3e3a36] mb-4">
        {estudo.livro} {estudo.capitulo}:{estudo.versiculos}
      </h1>

      <p className="mb-6 text-[#6b645f]">
        {estudo.textoBase}
      </p>

      <h2 className="font-semibold mb-2">Reflexão</h2>
      <p className="mb-6 text-[#6b645f]">
        {estudo.reflexao}
      </p>

      <h2 className="font-semibold mb-2">Aplicação</h2>
      <p className="text-[#6b645f]">
        {estudo.aplicacao}
      </p>
    </div>
  );
}