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
      
      {/* TOPO */}
      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">
          Secreto
        </h1>

        {/* linha dourada */}
        <div className="w-12 h-px bg-[#C6A46A]/50 mt-3"></div>
      </div>

      {/* LISTA */}
      <div className="max-w-2xl mx-auto px-8 space-y-6">

        {estudos?.map((estudo) => (
          <Link
            key={estudo.id}
            href={`/secreto/${estudo.id}`}
            className="block"
          >
            <div className="flex items-center gap-6 p-6 rounded-2xl border border-[#e9d5bb] hover:bg-[#f3ecdd] transition">

              <div className="text-4xl font-serif text-[#70412d]/40">
                {String(estudo.ordem).padStart(2, "0")}
              </div>

              <div>
                <h2 className="font-serif text-lg leading-snug">
                  {estudo.livro} {estudo.capitulo}:{estudo.versiculo}
                </h2>

                {estudo.titulo && (
                  <p className="text-sm text-[#70412d]/60 mt-1">
                    {estudo.titulo}
                  </p>
                )}
              </div>

            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}