/**
 * A biblioteca de skills do SOM, som-skill-library 0.2.2, publicada em skills/
 * em github.com/storyobjectmodel/som. Toda skill é lifecycle: draft,
 * origin: reference. A biblioteca é versionada separadamente do padrão.
 */

import type { LibrarySkill } from '../../../data/skills';

export type { SkillCategory, Severity, LibrarySkill } from '../../../data/skills';
export { LIBRARY_VERSION, CATEGORY_X } from '../../../data/skills';

export const LIBRARY: LibrarySkill[] = [
  {
    name: 'raise-flag-on-match',
    category: 'compliance',
    severities: ['flag', 'inform'],
    declares: 'Uma flag nomeada numa história quando um campo configurado casa com um valor configurado — já na criação, antes mesmo de existir qualquer mídia.',
    targets: ['planning', 'rundown', 'mam', 'graphics', 'discovery'],
  },
  {
    name: 'hold-while-flagged',
    category: 'compliance',
    severities: ['hold'],
    declares: 'Uma ação nomeada retida enquanto houver uma flag de um tipo configurado, liberada apenas por uma liberação de autoridade igual ou superior no mesmo escopo.',
    targets: ['mam', 'playout', 'rundown', 'cms', 'compliance_hub'],
  },
  {
    name: 'gate-by-scope',
    category: 'compliance',
    severities: ['hold', 'inform'],
    declares: 'Se o gate de um caminho de destino permite um telling agora mesmo. Sempre com escopo de link.',
    targets: ['cms', 'playout', 'rundown', 'mam', 'distribution'],
  },
  {
    name: 'record-provenance-on-ingest',
    category: 'compliance',
    severities: ['inform'],
    declares: 'Que a proveniência de uma fonte fica registrada quando ela entra numa história — inclusive uma cadeia C2PA ausente, registrada como ausente.',
    targets: ['mam', 'ingest', 'verification', 'discovery', 'archive'],
  },
  {
    name: 'flag-on-mismatch',
    category: 'editorial',
    severities: ['flag', 'inform'],
    declares: 'Uma divergência quando um asset vinculado ou um item do espelho carrega um valor que a história já não tem — nomeando os dois valores.',
    targets: ['rundown', 'graphics', 'cms', 'playout'],
  },
  {
    name: 'apply-clearance',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Qual membro de um conjunto de versões preparadas uma liberação torna vigente, e quais membros ela substitui.',
    targets: ['playout', 'rundown', 'mam', 'cms', 'graphics'],
  },
  {
    name: 'enrich-on-condition',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Que um enriquecimento nomeado se justifica para um asset enquanto uma condição configurada se mantiver. Nunca executa o enriquecimento.',
    targets: ['mam', 'verification', 'multimodal', 'transcription', 'ingest'],
  },
  {
    name: 'match-and-propose',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Uma história candidata para um clipe solto, com confiança igual ou acima da definida pela casa. A confirmação é um ato humano, registrado em outro lugar.',
    targets: ['multimodal', 'mam', 'discovery', 'ingest', 'rundown'],
  },
  {
    name: 'select-provider-by-context',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Qual fornecedor a política da casa indica para uma capacidade, dado o contexto da história. Nunca atribui nem aciona.',
    targets: ['transcription', 'verification'],
  },
  {
    name: 'surface-on-context-match',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Um item de uma fonte monitorada que corresponde à história em andamento, com a sua proveniência. Aditivo, fora do caminho crítico.',
    targets: ['transcription', 'verification', 'discovery', 'markets_data', 'mam', 'planning'],
  },
  {
    name: 'declare-context-on-commit',
    category: 'workflow',
    severities: ['inform'],
    declares: 'O contexto da história que se aplica a um link quando um asset é vinculado a um destino.',
    targets: ['playout', 'mam', 'graphics'],
    proposed: true,
  },
];

/** Os valores de frontmatter que toda skill da biblioteca garante. */
export const GUARANTEES: { field: string; value: string; meaning: string }[] = [
  {
    field: 'auto_change_content',
    value: 'false',
    meaning: 'O único valor permitido. O que se retém é uma ação, nunca o conteúdo — um executor que edita para liberar quebrou o modelo.',
  },
  {
    field: 'fail_closed',
    value: 'true',
    meaning: 'Um valor ilegível é tratado como se a condição valesse, na severidade mais alta que a skill tem. Silêncio diante de uma restrição ilegível nunca é permitido.',
  },
  {
    field: 'output_messages',
    value: '["skill.warning.raised"]',
    meaning: 'Uma skill tem uma única maneira de dizer qualquer coisa. Ela nunca escreve estado da história.',
  },
  {
    field: 'depends',
    value: '[]',
    meaning: 'O encadeamento acontece pelo barramento, não por dependências declaradas. Um hold se anuncia (advert) a partir do estado da flag, não importa quem a levantou.',
  },
];
