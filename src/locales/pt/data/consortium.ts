import type { Demo } from '../../../data/consortium';

export {
  OFFICIAL_URL,
  SPEC_REPO_URL,
  SCHEMA_BASE_URL,
  EMULATOR_URL,
  DEMOS_URL,
  INVOLVED_FORM_URL,
  CONTACT_EMAIL,
  AGENTSKILLS_URL,
  repoFile,
  repoDir,
  CHAMPION_MARKS,
  AUTHORS,
  CHAMPIONS,
  PARTICIPANTS,
  IBC_PROJECT_URL,
} from '../../../data/consortium';
export type { Demo } from '../../../data/consortium';

/** The two IBC 2026 scenarios, as storyobjectmodel.com describes them, in pt-BR. */
export const DEMOS: Demo[] = [
  {
    title: 'O furacão',
    anchor: 'demo-1',
    summary:
      'Texto de agência e um feed de dados meteorológicos no barramento, com transcrição e inteligência de mídia lendo a Story. Chegam dois clipes — um com credenciais de autenticidade, outro sem — e o gate os trata de forma diferente, com registro. A tempestade é reclassificada na origem, um jornalista confirma, e toda ferramenta que dependia da categoria antiga vê a mudança ao mesmo tempo. Uma afirmação não confirmada, de fonte única, continua segurada enquanto o resto da página vai ao ar.',
    vendors: [
      'AP',
      'The Weather Company',
      'Trint',
      'Moments Lab',
      'Cuez',
      'Vizrt',
      'HyperContent AI',
      'Shure',
      'Amazon Web Services',
    ],
  },
  {
    title: 'O anúncio do primeiro-ministro',
    anchor: 'demo-2',
    summary:
      'Um anúncio cujo desfecho é desconhecido até ser feito. A Story entra no barramento com uma premissa esperada e dois conjuntos de roteiros preparados. As ferramentas que a leem seguram rascunhos de posts para redes sociais, sugerem uma unidade de transmissão ao vivo, transcrevem o sinal e propõem a afirmação no momento em que ela é dita — e nada muda até que um jornalista aprove. Essa única aprovação corta o clipe, compromete os roteiros correspondentes, suprime os outros com um motivo registrado e libera os posts segurados.',
    vendors: ['Reuters', 'Octopus', 'LiveU', 'Fonn Group (Mimir)', 'Trint', 'HyperContent AI', 'Amazon Web Services'],
  },
];
