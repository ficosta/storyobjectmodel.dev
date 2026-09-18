import type { FieldDoc, Family } from '../../../data/envelope';

export type { FieldDoc, Family } from '../../../data/envelope';
export { SYSTEM_TYPES } from '../../../data/envelope';

/** O envelope do SOM 1.0 — o invólucro externo comum a todas as mensagens. É um
 *  objeto fechado: campos de nível superior desconhecidos reprovam na validação. */
export const ENVELOPE_FIELDS: FieldDoc[] = [
  {
    name: 'som_version',
    required: true,
    type: 'string (semver)',
    desc: 'A <b>versão do pacote de schemas</b> à qual o payload está conforme — <code>"1.0.0"</code> para o SOM 1.0.',
    note: 'Apenas informativo: os consumidores NÃO DEVEM ramificar a lógica com base nele. <code>"0.3.2"</code> <b>não</b> é SOM 1.0 — três campos foram retirados antes da ratificação —, então um consumidor não pode tratá-lo como conforme.',
  },
  {
    name: 'message_id',
    required: true,
    type: 'string (UUID)',
    desc: 'Único por mensagem. Recomenda-se UUIDv7, porque ordena por tempo. Cada republicação de uma história ganha um novo.',
    note: 'O schema diz <code>format: uuid</code>, e a maioria dos validadores ignora <code>format</code> a menos que seja instruída do contrário. A conformidade com o SOM 1.0 exige validação de formatos.',
  },
  {
    name: 'correlation_id',
    required: true,
    type: 'string (UUID)',
    desc: 'Liga todas as mensagens sobre o ciclo de vida de uma história. Propague-o de ponta a ponta — é a chave de partição natural.',
  },
  {
    name: 'causation_id',
    required: false,
    type: 'string (UUID)',
    desc: 'A mensagem que causou diretamente esta — um aviso de skill aponta para o snapshot que disparou a avaliação.',
  },
  {
    name: 'message_type',
    required: true,
    type: 'string',
    desc: 'A família do payload — <code>story.context</code>, <code>skill.warning.raised</code>, <code>delivery.media_available</code>, <code>link.committed</code>, …',
    note: 'O <b>único</b> discriminador de parsing. Escolha o schema do payload por este campo — nunca pelo topic, por um nome de arquivo, pelo publicador ou pelo formato do payload.',
  },
  {
    name: 'timestamp',
    required: true,
    type: 'string (date-time)',
    desc: 'O momento oficial do evento. Recomenda-se precisão de microssegundos.',
    note: 'Fica <b>no envelope, nunca dentro do payload</b> — <code>skill.warning.raised</code> proíbe explicitamente um <code>timestamp</code> no payload. Não existe campo <code>signature</code>; o schema o rejeita.',
  },
  {
    name: 'originating_system',
    required: true,
    type: 'object',
    desc: 'Quem publicou esta mensagem. <code>system_id</code> e <code>system_type</code> obrigatórios; <code>system_name</code>, <code>vendor</code>, <code>version</code> opcionais. Objeto fechado.',
    note: '<code>system_type</code> é um enum fechado: <code>ncs</code>, <code>mos_device</code>, <code>graphics</code>, <code>automation</code>, <code>wire_service</code>, <code>ai_agent</code>, <code>compliance_engine</code>, <code>editorial_dashboard</code>, <code>archive</code>, <code>prompter</code>, <code>camera</code>, <code>audio</code>, <code>skill_worker</code>, <code>custom</code>. Renomeado de <code>source</code>, que agora é rejeitado sem exceção. Quem republica uma história a carimba de novo, então uma correção é atribuída a quem corrigiu.',
  },
  {
    name: 'topic',
    required: true,
    type: 'string',
    desc: 'O topic em que a mensagem foi publicada. DEVE começar com <code>som.</code>',
    note: 'Esse prefixo é toda a regra de topics. A organização dos topics é uma escolha de implantação — os exemplos publicados usam formas como <code>som.story.context.&lt;story_id&gt;</code> — e um consumidor nunca deduz dele o tipo do payload.',
  },
  {
    name: 'modification_header',
    required: false,
    type: 'object',
    desc: 'Em mensagens do tipo snapshot, como <code>story.context</code>: <code>story_version</code>, <code>modified_at</code>, <code>modified_by</code>, <code>change_summary</code>, <code>history</code>.',
  },
  {
    name: '_actors',
    required: false,
    type: 'object',
    desc: 'Mapa chave-valor de atores referenciados por chaves curtas, para que um ator seja descrito uma vez e referenciado pela chave nos demais lugares.',
  },
  {
    name: '@context',
    required: false,
    type: 'string | object',
    desc: 'Contexto JSON-LD. Adiado, mas permitido para compatibilidade futura.',
  },
  {
    name: 'extensions',
    required: false,
    type: 'object',
    desc: 'Campos de fornecedores, com namespace em domínio reverso: toda chave deve casar com <code>com.{vendor}.</code>',
    note: 'Os consumidores DEVEM ignorar extensions que não reconhecem e NÃO DEVEM rejeitar uma mensagem por carregá-las. Uma chave sem o namespace <code>com.</code> reprova na validação.',
  },
  {
    name: 'payload',
    required: true,
    type: 'object',
    desc: 'O payload tipado, validado contra o schema do <code>message_type</code> declarado.',
  },
];

/** `skill.warning.raised` — doze campos obrigatórios, conforme skill-warning.schema.json 1.0. */
export const WARNING_FIELDS: FieldDoc[] = [
  { name: 'warning_id', required: true, type: 'string (UUIDv7)', desc: 'Identidade deste aviso.' },
  { name: 'skill_id', required: true, type: 'string', desc: 'Qual skill o declarou, no formato <code>publisher/skill-name</code> — <code>smart-stories/hold-while-flagged</code>.' },
  { name: 'skill_version', required: true, type: 'string (semver)', desc: 'Versão do arquivo de skill que foi acionado (recall).' },
  { name: 'story_id', required: true, type: 'string', desc: 'A história de que trata o aviso. Estável em todos os snapshots.' },
  {
    name: 'scope',
    required: true,
    type: 'string',
    desc: 'O nível de disparo, escrito <code>{level}:{id}</code>: <code>link:{link_id}</code>, <code>asset:{asset_id}</code> ou <code>story:{story_id}</code>.',
    note: 'Um hold específico de um destino tem escopo <code>link:</code>; um que vale para a história inteira tem escopo <code>story:</code>. Uma liberação só vale para o escopo em que o hold foi declarado.',
  },
  {
    name: 'severity',
    required: true,
    type: 'enum',
    desc: '<code>hold</code> | <code>flag</code> | <code>inform</code>.',
    note: 'Em minúsculas, para sempre — uma exceção deliberada aos enums UPPER_SNAKE do SOM. <code>hold</code>: o executor DEVE reter a saída nos campos afetados. <code>flag</code>: marcar para revisão. <code>inform</code>: consultivo.',
  },
  { name: 'rule_id', required: true, type: 'string', desc: 'Qual regra, ou qual instância configurada da skill, o produziu.' },
  { name: 'non_overridable', required: true, type: 'boolean', desc: 'Se alguém pode passar por cima dele com um clique. Um hold que se derruba com um clique é justamente a prática manual que o SOM substitui.' },
  { name: 'affected_fields', required: true, type: 'string[]', desc: 'Os caminhos da história de que trata o aviso — <code>editorial_gates[].status</code>, <code>headline</code>.' },
  { name: 'detail', required: true, type: 'string', desc: 'Motivo legível por humanos. Para um hold, deveria dizer o que o libera — ou vai gerar um telefonema.' },
  { name: 'blocks', required: true, type: 'string[]', desc: 'As ações retidas, como <code>air:story-verdict-0412</code>. Vazio para avisos consultivos.' },
  { name: 'skill_warning_ref', required: true, type: 'string', desc: 'Referência usada para correlacionar um aviso com a sua resolução.' },
  {
    name: 'content_type',
    required: false,
    type: 'string',
    desc: 'Chave de renderização governada (por exemplo, <code>sync.ai.banner</code>), extensível por fornecedores via <code>extensions</code>.',
  },
  {
    name: 'message_type',
    required: false,
    type: 'const',
    desc: '<code>"skill.warning.raised"</code> — a forma com sufixo, que pode viajar no payload para roteamento por topic.',
    note: 'Dois campos são explicitamente rejeitados aqui: <code>timestamp</code> (ele pertence ao envelope) e <code>instance_ref</code> (aposentado — as saídas se restringem ao seu nível de disparo por meio de <code>scope</code>).',
  },
];

/** As sete famílias de mensagens do SOM 1.0, na ordem em que a especificação as lista. */
export const FAMILIES: Family[] = [
  {
    name: 'Envelope de mensagem',
    schema: 'envelope.schema.json',
    messageTypes: ['(toda mensagem)'],
    publishedBy: 'todo publicador',
    purpose: 'O invólucro fechado que toda mensagem carrega. Seu payload é polimórfico conforme o message_type.',
  },
  {
    name: 'story.context',
    schema: 'story-context.schema.json',
    messageTypes: ['story.context'],
    publishedBy: 'o dono da história',
    purpose: 'O estado completo de uma história num dado momento — um snapshot, nunca um delta.',
  },
  {
    name: 'som.telling.*',
    schema: 'telling-event.schema.json',
    messageTypes: ['telling.started', 'telling.ended', 'telling.exposed'],
    publishedBy: 'o publicador de exposição',
    purpose: 'Quando um asset encontrou um público. O estado no ar é derivado destes eventos, nunca armazenado no asset.',
  },
  {
    name: 'som.link.*',
    schema: 'link-event.schema.json',
    messageTypes: ['link.committed', 'link.gate_changed', 'link.withdrawn'],
    publishedBy: 'o sistema que faz o commit',
    purpose: 'Um asset vinculado a um destino, com um gate de compliance por destino. assets[].usage[] é mantido exclusivamente a partir destes eventos.',
  },
  {
    name: 'delivery.media_available',
    schema: 'delivery-media-available.schema.json',
    messageTypes: ['delivery.media_available'],
    publishedBy: 'o repositório de mídia (MAM / TAMS)',
    purpose: 'A mídia chegou a um repositório — por uma Source TAMS ou por um localizador fora do TAMS. Sem bytes, sem story_id.',
  },
  {
    name: 'som.system.audit',
    schema: 'system-audit.schema.json',
    messageTypes: ['system.audit'],
    publishedBy: 'qualquer ator de governança',
    purpose: 'A trilha de governança: CLEARED, SUPPRESSED, WITHHELD ou OVERRIDDEN, sobre um link, um asset ou um telling.',
  },
  {
    name: 'skill.warning.raised',
    schema: 'skill-warning.schema.json',
    messageTypes: ['skill.warning.raised'],
    publishedBy: 'um executor de skills',
    purpose: 'O que uma skill declarou sobre uma história, publicado pelo executor dentro da ferramenta que a acionou (recall).',
  },
];
