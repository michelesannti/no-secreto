import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

export default async function SecretoPage() {
  const supabase = getSupabaseClient();

  const { data: estudos, error } = await supabase
    .from("estudos")
    .select("*")
    .order("ordem", { ascending: true });

  if (error) {
    return <div className="p-6">Erro ao carregar estudos.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]">
      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">
          Secreto
        </h1>
        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
      </div>

      <div className="max-w-2xl mx-auto px-8 space-y-6">
        {estudos?.map((estudo) => (
          <Link
            key={estudo.id}
            href={`/estudo/${estudo.id}`}
            className="block p-6 rounded-xl border border-[#e9d5bb] hover:bg-[#f3ecdd] transition"
          >
            <h2 className="font-serif text-lg">
              {estudo.livro} {estudo.capitulo}:{estudo.versiculo}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}