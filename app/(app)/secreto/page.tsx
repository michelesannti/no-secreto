import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

export default async function SecretoPage() {
  const supabase = getSupabaseClient();

  const { data: estudos, error } = await supabase
    .from("estudos")
    .select("*")
    .order("ordem", { ascending: true });

  if (error) {
    return (
      <div className="p-8 text-[#70412d]">
        Erro ao carregar estudos.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-10 pb-40 text-[#70412d]">

      {/* TOPO */}
      <div className="px-8 mb-14">
        <h1 className="text-2xl font-[var(--font-title)] tracking-wide">
          Secreto
        </h1>

        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-3"></div>
      </div>

      {/* LISTA */}
      <div className="max-w-2xl mx-auto px-8 space-y-6">

        {estudos?.map((estudo) => (
          <Link
            key={estudo.id}
            href={/secreto/${estudo.id}}
            className="block group"
          >
            <div className="
              flex
              items-center
              gap-6
              p-6
              rounded-2xl
              border
              border-[#e9d5bb]
              bg-white/40
              backdrop-blur
              transition
              group-hover:bg-[#f3ecdd]
              group-hover:shadow-sm
            ">

              {/* NÚMERO */}
              <div className="text-4xl font-[var(--font-title)] text-[#70412d]/40">
                {String(estudo.ordem).padStart(2, "0")}
              </div>

              {/* TEXTO */}
              <div>

                <h2 className="font-[var(--font-title)] text-lg leading-snug">
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