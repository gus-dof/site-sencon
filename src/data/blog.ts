/* ───────────────────────────────────────────────────────────────
   Sencon · Blog — shared content + helpers.
   Used by the blog index (/blog) and article pages (/blog/[slug]).

   TODO: substituir os arrays estáticos por dados do Supabase.
   A forma dos tipos (Post / BlogBlock) já espelha o que viria do
   banco, então a troca é só no carregamento dos dados.
   ─────────────────────────────────────────────────────────────── */

/* ── Line-icon set (matches the design system) ───────────────────── */
export const ICONS: Record<string, string> = {
  FileText: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>',
  Activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  Globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  Upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  Layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  Receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17l-3-2-2 2-2-2-2 2-2-2-3 2z"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/></svg>',
  Calculator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><circle cx="8" cy="11" r="0.6" fill="currentColor"/><circle cx="12" cy="11" r="0.6" fill="currentColor"/><circle cx="16" cy="11" r="0.6" fill="currentColor"/><circle cx="8" cy="15" r="0.6" fill="currentColor"/><circle cx="12" cy="15" r="0.6" fill="currentColor"/><line x1="16" y1="14" x2="16" y2="18"/></svg>',
  BarChart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="3" y1="20" x2="21" y2="20"/></svg>',
  ShieldCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11.5 14.5 16 9.5"/></svg>',
}

/* ── Categories → accent colour ──────────────────────────────────── */
export type Cat = { id: string; label: string; c?: string }
export const CATS: Cat[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'b3', label: 'Bolsa (B3)', c: '#155EEF' },
  { id: 'exterior', label: 'Exterior', c: '#0E7C86' },
  { id: 'daytrade', label: 'Day trade', c: '#B65A0B' },
  { id: 'declaracao', label: 'Declaração', c: '#067647' },
  { id: 'guias', label: 'Guias', c: '#7A5AE0' },
  { id: 'novidades', label: 'Novidades', c: '#475569' },
]
const C: Record<string, Cat> = CATS.reduce((m, c) => {
  if (c.c) m[c.id] = c
  return m
}, {} as Record<string, Cat>)
export const catLabel = (id: string) => C[id]?.label || id
export const catColor = (id: string) => C[id]?.c || '#155EEF'

/* ── Content model ───────────────────────────────────────────────── */
export type BlogBlock =
  | { type: 'p'; html: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; html: string; cite?: string }

export type Post = {
  slug: string
  cat: string
  icon: string
  title: string
  excerpt?: string
  date: string
  read: string
  author?: string
  body?: BlogBlock[]
}

/* Full article — copy adaptado de sencon.com.br/blog/declarar-prejuizo-de-acoes */
const declararPrejuizo: Post = {
  slug: 'declarar-prejuizo-de-acoes',
  cat: 'b3',
  icon: 'Activity',
  title: 'Como declarar prejuízo de ações?',
  excerpt:
    'Você sabia que é preciso declarar prejuízo de ações no Imposto de Renda? Entenda como funciona esse procedimento para ficar em dia com o leão.',
  date: '12 mai 2026',
  read: '6 min',
  author: 'Equipe Sencon',
  body: [
    { type: 'p', html: 'Nenhum investidor compra ações esperando ter prejuízo. Porém, esse é um risco que sempre existe — seja em maior ou menor nível. Mas você sabia que é preciso <strong>declarar prejuízo de ações no Imposto de Renda</strong>?' },
    { type: 'p', html: 'Na verdade, todos os investidores que realizam operações na Bolsa de Valores devem declarar Imposto de Renda — independentemente de terem obtido lucro ou prejuízo. Essa é uma obrigação prevista na Instrução Normativa RFB nº 2.065:' },
    {
      type: 'quote',
      html: 'Está obrigada a apresentar a Declaração de Ajuste Anual a pessoa física residente no Brasil que, no ano-calendário, obteve, em qualquer mês, ganho de capital na alienação de bens ou direitos sujeito à incidência do Imposto, ou realizou operações em bolsas de valores, de mercadorias, de futuros e assemelhadas.',
      cite: 'Instrução Normativa RFB nº 2.065',
    },
    { type: 'p', html: 'Entretanto, a obrigatoriedade de declarar prejuízo de ações também traz um ponto positivo: a possibilidade de <strong>compensar o prejuízo</strong> para reduzir os impostos pagos sobre os ganhos.' },
    { type: 'p', html: 'Quer entender melhor o processo de declarar prejuízo de ações e compensar essas perdas? Confira a seguir!' },

    { type: 'h2', text: 'Como declarar prejuízo de ações?' },
    { type: 'p', html: 'O processo de declarar prejuízo de ações no Imposto de Renda é simples. Veja o passo a passo:' },
    {
      type: 'ol',
      items: [
        'Abra o Programa IRPF da Receita Federal.',
        'Acesse a ficha “Renda Variável” e selecione “Operações comuns / Day Trade”.',
        'No fim da página, acesse a opção “Resultados” e preencha o valor perdido em “Resultado negativo até o mês anterior”.',
      ],
    },
    { type: 'p', html: 'Para realizar a declaração de prejuízo de ações, o próprio investidor tem a responsabilidade de acompanhar seus ganhos e prejuízos ao longo do ano. Ou seja, você deve calcular seus resultados com base nas suas notas de corretagem.' },
    { type: 'p', html: 'Além disso, é importante destacar que o sistema de declaração faz a compensação entre os meses. Se for reportado um prejuízo de R$ 1 mil em junho, o sistema lança automaticamente como prejuízo a compensar. Se em julho for informado um lucro de R$ 1 mil, ele debita o imposto e lança o saldo a compensar para o próximo mês.' },

    { type: 'h2', text: 'Como funciona a compensação de prejuízo?' },
    { type: 'p', html: 'Já vimos como declarar prejuízo de ações. Agora vamos abordar um assunto que interessa muito aos investidores: a compensação do prejuízo.' },
    { type: 'p', html: 'Como você deve imaginar, o valor do prejuízo em ações não é tributado. Mais do que isso, o investidor pode utilizá-lo em outro momento para reduzir o imposto a ser pago quando ocorrer uma venda com lucro.' },
    { type: 'p', html: 'Ou seja, é possível usar o valor perdido nas operações para abater o imposto sobre os lucros de operações futuras. Para isso, basta que as operações sejam da mesma natureza — operações comuns ou day trade.' },

    { type: 'h2', text: 'Como compensar prejuízo no IR?' },
    { type: 'p', html: 'A compensação de prejuízos é feita mensalmente e funciona de forma intuitiva. Veja alguns exemplos que ajudam a compreender:' },
    {
      type: 'ul',
      items: [
        'Se você perdeu R$ 10 mil em junho e ganhou R$ 8 mil em julho, não precisa recolher imposto — e ainda sobra R$ 2 mil de saldo para abater de ganhos futuros.',
        'Se teve prejuízo de R$ 5 mil em agosto e um ganho de R$ 25 mil em setembro, paga imposto apenas sobre a diferença, que é de R$ 20 mil.',
      ],
    },
    { type: 'p', html: 'Após fazer a compensação, basta aplicar a alíquota referente à operação:' },
    {
      type: 'ul',
      items: [
        'Operações de day trade com ações: alíquota de 20%.',
        'Operações de mais de um dia com ações: alíquota de 15%.',
        'Operações com ETFs (day trade ou não): alíquota de 15%.',
        'Operações com fundos imobiliários (day trade ou não): alíquota de 20%.',
        'Operações de day trade com opções: alíquota de 20%; em mais de um dia, 15%.',
        'Operações de day trade com futuros: alíquota de 20%; em mais de um dia, 15%.',
      ],
    },

    { type: 'h2', text: 'Não deixe de declarar seus prejuízos!' },
    { type: 'p', html: 'Como vimos, declarar prejuízo de ações não é apenas uma obrigação — é também uma oportunidade de compensação dos ganhos futuros.' },
    { type: 'p', html: 'Por isso, é fundamental manter um controle das suas operações para monitorar ganhos e prejuízos ao longo do ano. Assim, você não perde dinheiro e cumpre todas as suas obrigações.' },
    { type: 'p', html: 'Para tornar todo esse processo mais simples, você pode contar com a <strong>Sencon</strong>. Com a calculadora de IR da Sencon você automatiza a apuração mensal, a geração do DARF e a declaração anual do Imposto de Renda das operações na Bolsa de Valores — sem planilha:' },
    {
      type: 'ul',
      items: [
        'Cálculo a partir de todas as notas de corretagem enviadas ao sistema.',
        'Posições, preço médio e resultado de cada ativo.',
        'Geração de DARF com juros e multa, quando necessário.',
        'Relatórios completos para revisão da contabilidade.',
        'Sem limite de corretoras, operações ou valor investido.',
      ],
    },
  ],
}

/* ── Featured + side + grid (TODO: Supabase) ─────────────────────── */
export const FEATURED: Post = declararPrejuizo

export const SIDE: Post[] = [
  { slug: 'day-trade-e-ir', cat: 'daytrade', icon: 'Activity', title: 'Day trade e IR: alíquota, DARF e compensação de prejuízo', date: '24 mai 2026', read: '8 min' },
  { slug: 'lei-14754-investimentos-no-exterior', cat: 'exterior', icon: 'Globe', title: 'Lei 14.754/23: como declarar investimentos no exterior', date: '21 mai 2026', read: '9 min' },
]

export const POSTS: Post[] = [
  { slug: 'imposto-de-renda-2026-guia-completo', cat: 'guias', icon: 'FileText', title: 'Imposto de Renda 2026: o guia completo para investidores', excerpt: 'Prazos, documentos, o que declarar de cada tipo de investimento e como evitar a malha fina — tudo em um só lugar.', date: '28 mai 2026', read: '12 min' },
  { slug: 'importar-notas-de-corretagem', cat: 'guias', icon: 'Upload', title: 'Como importar suas notas de corretagem na Sencon', excerpt: 'O passo a passo para trazer as notas SINACOR e deixar a apuração no automático.', date: '19 mai 2026', read: '5 min' },
  { slug: 'fiis-no-imposto-de-renda', cat: 'b3', icon: 'Layers', title: 'FIIs no Imposto de Renda: rendimentos isentos e ganho de capital', excerpt: 'Entenda o que é isento, o que é tributado e como apurar a venda de cotas.', date: '16 mai 2026', read: '7 min' },
  { slug: 'dividendos-de-acoes-americanas', cat: 'exterior', icon: 'Receipt', title: 'Dividendos de ações americanas: carnê-leão na prática', excerpt: 'Como declarar dividendos recebidos no exterior e abater o imposto pago na fonte.', date: '14 mai 2026', read: '6 min' },
  { slug: 'darf-em-atraso-juros-e-multa', cat: 'b3', icon: 'Calculator', title: 'DARF em atraso: como calcular juros e multa', excerpt: 'O que acontece quando você perde o prazo e como a Sencon calcula sozinha.', date: '11 mai 2026', read: '4 min' },
  { slug: 'isencao-de-20-mil', cat: 'b3', icon: 'BarChart', title: 'Isenção de R$ 20 mil: quando suas vendas são isentas', excerpt: 'A regra do limite mensal de vendas de ações e como ela entra na apuração.', date: '08 mai 2026', read: '5 min' },
  { slug: 'conferencia-automatica-custodia-b3', cat: 'novidades', icon: 'ShieldCheck', title: 'Novidade: conferência automática contra a custódia da B3', excerpt: 'Agora você compara sua posição com a custódia oficial antes de fechar o mês.', date: '05 mai 2026', read: '3 min' },
  { slug: 'etfs-nacionais-e-internacionais', cat: 'b3', icon: 'Activity', title: 'ETFs nacionais e internacionais: a tributação que muda', excerpt: 'As diferenças de alíquota e apuração entre os tipos de ETF na sua carteira.', date: '02 mai 2026', read: '6 min' },
  { slug: 'declarar-bens-e-direitos-no-exterior', cat: 'exterior', icon: 'Globe', title: 'Como declarar bens e direitos no exterior', excerpt: 'Conversão pela PTAX de 31/12 e organização das posições para a ficha de bens.', date: '29 abr 2026', read: '7 min' },
  declararPrejuizo,
]

export const QUOTE = {
  q: 'A ferramenta de importação de notas me poupou horas. Faço o Imposto de Renda da minha carteira em minutos, sem planilha.',
  name: 'Lucas Bertho',
  role: 'Investidor · ações e FIIs',
}

/* ── Helpers ─────────────────────────────────────────────────────── */
/** Todos os posts (destaque + laterais + grade), sem duplicar por slug. */
export const ALL_POSTS: Post[] = (() => {
  const seen = new Set<string>()
  const out: Post[] = []
  for (const p of [FEATURED, ...SIDE, ...POSTS]) {
    if (seen.has(p.slug)) continue
    seen.add(p.slug)
    out.push(p)
  }
  return out
})()

/** Posts que já têm corpo escrito → geram página de artigo. */
export const ARTICLES: Post[] = ALL_POSTS.filter((p) => p.body && p.body.length > 0)

export const getPost = (slug: string): Post | undefined => ALL_POSTS.find((p) => p.slug === slug)

/** Link de um card: vai para o artigo se houver corpo, senão fica inerte. */
export const postHref = (p: Post): string => (p.body && p.body.length > 0 ? `/blog/${p.slug}` : '#')

/** Iniciais para avatares (autor / depoimento). */
export const initialsOf = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((s) => s[0])
    .join('')

/** N artigos relacionados (mesma categoria primeiro), excluindo o atual. */
export const relatedPosts = (slug: string, n = 3): Post[] => {
  const current = getPost(slug)
  const others = ALL_POSTS.filter((p) => p.slug !== slug)
  const sameCat = others.filter((p) => current && p.cat === current.cat)
  const rest = others.filter((p) => !sameCat.includes(p))
  return [...sameCat, ...rest].slice(0, n)
}
