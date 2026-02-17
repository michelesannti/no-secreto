export interface Estudo {
  id: number;
  livro: string;
  capitulo: number;
  versiculos: string;
  textoBase: string;
  reflexao: string;
  aplicacao: string;
}

export const estudos: Estudo[] = [
  {
    id: 1,
    livro: "Gênesis",
    capitulo: 1,
    versiculos: "1-3",
    textoBase:
      "No princípio criou Deus os céus e a terra...",
    reflexao:
      "Tudo começa em Deus. Antes de qualquer plano, decisão ou movimento, Ele já era.",
    aplicacao:
      "Hoje, antes de qualquer tarefa, entregue seus planos a Deus em oração."
  },
  {
    id: 2,
    livro: "Gênesis",
    capitulo: 1,
    versiculos: "4-5",
    textoBase:
      "E viu Deus que era boa a luz; e fez separação entre a luz e as trevas.",
    reflexao:
      "Deus separa luz e trevas. Há coisas que precisam ser alinhadas na nossa vida.",
    aplicacao:
      "Identifique hoje algo que precisa ser colocado na luz."
  }
];