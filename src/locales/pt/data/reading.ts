import type { Principle, Reading } from '../../../data/reading';
import { OFFICIAL_URL, SPEC_REPO_URL, repoFile } from '../../../data/consortium';

export type { Principle, Reading } from '../../../data/reading';

/**
 * Primary sources, official first, in pt-BR. Titles of external articles stay
 * in their original language.
 */
export const READING: Reading[] = [
  {
    title: 'storyobjectmodel.com',
    source: 'A casa oficial do SOM',
    date: 'Setembro de 2026',
    url: OFFICIAL_URL,
    why: 'O enquadramento do próprio padrão, as duas demonstrações do IBC, princípios, FAQ, como participar, o emulador ao vivo e os schemas servidos nas suas URLs permanentes.',
  },
  {
    title: 'storyobjectmodel/som',
    source: 'GitHub — o repositório da especificação',
    date: 'SOM 1.0 · 12 de setembro de 2026',
    url: SPEC_REPO_URL,
    why: 'Os sete schemas normativos, 18 exemplos completos e 20 casos que devem ser rejeitados, os validadores, a biblioteca de skills e os documentos de conformidade, compatibilidade e migração.',
  },
  {
    title: 'Introduction and principles',
    source: 'Jon Roberts, em nome dos autores',
    date: 'Setembro de 2026',
    url: repoFile('spec/introduction.md'),
    why: 'Por que a história nunca teve um modelo quando a mídia e o controle tinham, os três substantivos e os seis princípios pelos quais toda mudança futura precisa passar.',
  },
  {
    title: 'Transforming newsrooms with agentic workflows',
    source: 'TVBEurope — Milan Varga, Octopus Newsroom',
    date: 'Setembro de 2026',
    url: 'https://www.tvbeurope.com/ibc/transforming-newsrooms-with-agentic-workflows',
    why: 'O relato de um participante sobre o projeto e o argumento da procedência para explicar por que uma emissora deveria se importar.',
  },
  {
    title: 'The next newsroom coordination problem',
    source: 'AP Workflow Solutions — Brian Hopman',
    date: '2026',
    url: 'https://workflow.ap.org/news/newsroom-coordination-problem/',
    why: 'Por que o MOS não é o que está sendo substituído, e onde a linha entre o SOM e as skills é difícil de traçar.',
  },
  {
    title: 'Solving the story context gap',
    source: 'TVBEurope — Ash Ellis, Moments Lab',
    date: 'Setembro de 2026',
    url: 'https://www.tvbeurope.com/ibc/solving-the-story-context-gap',
    why: 'O que significa, para um fornecedor, publicar no barramento em vez de passar conteúdo de uma interface para outra.',
  },
  {
    title: 'Writing an open standard for story context',
    source: 'Octopus Newsroom — entrevista com Milan Varga',
    date: '2026',
    url: 'https://www.octopus-news.com/writing-an-open-standard-for-story-context-an-interview-with-milan-varga/',
    why: 'A história de origem: o significado de uma história nunca foi escrito numa forma que pudesse circular.',
  },
  {
    title: 'The Smart Stories Project at IBC Accelerator',
    source: 'Trint — Tessa Kaday',
    date: 'Agosto de 2026',
    url: 'https://trint.com/blog/smart-stories-project-at-ibc-accelerator-2026',
    why: 'A versão curta, escrita antes das demonstrações do IBC.',
  },
  {
    title: 'Incubator 2026: SMART STORIES — the agentic production ecosystem',
    source: 'IBC Accelerator',
    date: '2026',
    url: 'https://show.ibc.org/accelerator-project-incubator-2026-smart-stories-agentic-production-ecosystem',
    why: 'A página do projeto no Accelerator, como o programa o registra.',
  },
];

/** The six working principles from spec/introduction.md, summarised, in pt-BR. */
export const PRINCIPLES: Principle[] = [
  {
    title: 'Escopo de uma única Story',
    body: 'O padrão coordena dentro de uma Story. Relações com outras Stories trafegam como referências, e o escopo para aí.',
  },
  {
    title: 'Mensagens, não organizações',
    body: 'O SOM descreve o que trafega no barramento. Ele não tem opinião sobre as suas mesas, funções ou ferramentas — dois fluxos de trabalho muito diferentes podem falar a mesma Story.',
  },
  {
    title: 'Estado afirmado pelo publicador',
    body: 'Um contexto da história diz aquilo que o seu dono está disposto a assinar. Nada nele é um palpite deduzido de várias fontes.',
  },
  {
    title: 'Coordenação, não consumo',
    body: 'Um campo entra se outro sistema precisa dele para agir corretamente. O SOM não carrega o conteúdo, e não é um formato de entrega.',
  },
  {
    title: 'Não por padrão, sim com justificativa',
    body: 'Um campo conquista o seu lugar quando, sem ele, uma integração real fica travada. A 1.0 retirou três campos propostos exatamente por esse motivo.',
  },
  {
    title: 'Crescimento do vocabulário com governança',
    body: 'A estrutura pode ser permissiva; as palavras que carregam significado, não. A extensão tem um formato definido, para que termos de fornecedores e de redações dividam uma mensagem em pé de igualdade.',
  },
];

/** How the model behaves, from storyobjectmodel.com/principles.html, summarised, in pt-BR. */
export const BEHAVIOURS: Principle[] = [
  {
    title: 'Ninguém está no comando',
    body: 'Nenhum orquestrador, nenhuma aplicação central. Cada ferramenta lê a Story e decide por conta própria.',
  },
  {
    title: 'Skills declaram, executores agem',
    body: 'Uma skill afirma o que é verdade diante de uma regra que a sua redação escreveu. Só a ferramenta dona do executor age — e o silêncio é um resultado válido.',
  },
  {
    title: 'Um único escritor cria',
    body: 'O sistema de gestão de histórias do publicador é dono da Story e da sua sequência. Nunca a agência.',
  },
  {
    title: 'Republicação completa, nunca um delta',
    body: 'Uma ferramenta ligada no meio da madrugada lê um único objeto e fica sabendo de tudo.',
  },
  {
    title: 'Vinculação no ato editorial',
    body: 'A mídia passa a fazer parte de uma Story quando uma pessoa decide que faz — nunca só porque chegou.',
  },
  {
    title: 'Uma transformação nunca levanta um hold',
    body: 'Cortar, recortar ou reversionar um Asset não lava a sua posição de conformidade.',
  },
  {
    title: 'Ler não deixa rastro',
    body: 'Uma ferramenta prova que leu algo publicando por sua vez — e é por isso que o rastro de auditoria surge naturalmente de como as escritas funcionam.',
  },
];
