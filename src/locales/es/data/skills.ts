/**
 * La biblioteca de skills de SOM, som-skill-library 0.2.2 — versión en español de la prosa.
 * Los identificadores, enums y constantes se reexportan desde el módulo en inglés.
 */

import type { LibrarySkill } from '../../../data/skills';

export type { SkillCategory, Severity, LibrarySkill } from '../../../data/skills';
export { LIBRARY_VERSION, CATEGORY_X } from '../../../data/skills';

export const LIBRARY: LibrarySkill[] = [
  {
    name: 'raise-flag-on-match',
    category: 'compliance',
    severities: ['flag', 'inform'],
    declares: 'Un flag con nombre sobre una Story cuando un campo configurado coincide con un valor configurado — desde su creación, incluso antes de que exista ningún medio.',
    targets: ['planning', 'rundown', 'mam', 'graphics', 'discovery'],
  },
  {
    name: 'hold-while-flagged',
    category: 'compliance',
    severities: ['hold'],
    declares: 'Una acción con nombre retenida mientras siga en pie un flag de un tipo configurado, liberada solo por una aprobación de autoridad igual o superior en el mismo alcance.',
    targets: ['mam', 'playout', 'rundown', 'cms', 'compliance_hub'],
  },
  {
    name: 'gate-by-scope',
    category: 'compliance',
    severities: ['hold', 'inform'],
    declares: 'Si el gate de una ruta de destino permite un Telling ahora mismo. Siempre con alcance de link.',
    targets: ['cms', 'playout', 'rundown', 'mam', 'distribution'],
  },
  {
    name: 'record-provenance-on-ingest',
    category: 'compliance',
    severities: ['inform'],
    declares: 'Que la procedencia de una fuente queda registrada al entrar en una Story — incluida una cadena C2PA ausente, registrada como ausente.',
    targets: ['mam', 'ingest', 'verification', 'discovery', 'archive'],
  },
  {
    name: 'flag-on-mismatch',
    category: 'editorial',
    severities: ['flag', 'inform'],
    declares: 'Una discrepancia cuando un Asset vinculado o un elemento de la escaleta lleva un valor que la Story ya no tiene — nombrando ambos valores.',
    targets: ['rundown', 'graphics', 'cms', 'playout'],
  },
  {
    name: 'apply-clearance',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Qué miembro de un conjunto de versiones preparado pasa a ser el vigente con una aprobación, y a qué miembros sustituye.',
    targets: ['playout', 'rundown', 'mam', 'cms', 'graphics'],
  },
  {
    name: 'enrich-on-condition',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Que un enriquecimiento con nombre está justificado para un Asset mientras se cumpla una condición configurada. Nunca ejecuta el enriquecimiento.',
    targets: ['mam', 'verification', 'multimodal', 'transcription', 'ingest'],
  },
  {
    name: 'match-and-propose',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Una Story candidata para un clip suelto, con una confianza igual o superior a la fijada por la casa. La confirmación es un acto humano que se registra en otro lugar.',
    targets: ['multimodal', 'mam', 'discovery', 'ingest', 'rundown'],
  },
  {
    name: 'select-provider-by-context',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Qué proveedor resuelve la política de la casa para una capacidad, dado el contexto de la historia. Nunca asigna ni invoca.',
    targets: ['transcription', 'verification'],
  },
  {
    name: 'surface-on-context-match',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Un elemento de una fuente monitorizada que coincide con la Story en curso, con su procedencia. Aditivo, fuera de la ruta crítica.',
    targets: ['transcription', 'verification', 'discovery', 'markets_data', 'mam', 'planning'],
  },
  {
    name: 'declare-context-on-commit',
    category: 'workflow',
    severities: ['inform'],
    declares: 'El contexto de la historia que se aplica en un link cuando un Asset se vincula a un destino.',
    targets: ['playout', 'mam', 'graphics'],
    proposed: true,
  },
];

/** Los valores de frontmatter que garantiza toda skill de la biblioteca. */
export const GUARANTEES: { field: string; value: string; meaning: string }[] = [
  {
    field: 'auto_change_content',
    value: 'false',
    meaning: 'El único valor permitido. Lo que se retiene es una acción, nunca el contenido — un executor que edita para liberar ha roto el modelo.',
  },
  {
    field: 'fail_closed',
    value: 'true',
    meaning: 'Un valor ilegible se trata como si la condición se cumpliera, con la severidad más alta que tenga la skill. Nunca se permite el silencio ante una restricción ilegible.',
  },
  {
    field: 'output_messages',
    value: '["skill.warning.raised"]',
    meaning: 'Una skill tiene una sola forma de decir algo. Nunca escribe el estado de la Story.',
  },
  {
    field: 'depends',
    value: '[]',
    meaning: 'El encadenamiento ocurre a través del bus, no mediante dependencias declaradas. Un hold se anuncia contra el estado del flag, sin importar quién lo haya levantado.',
  },
];
