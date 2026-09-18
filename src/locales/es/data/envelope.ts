import type { FieldDoc, Family } from '../../../data/envelope';

export type { FieldDoc, Family } from '../../../data/envelope';
export { SYSTEM_TYPES } from '../../../data/envelope';

/** El envelope de SOM 1.0 — el envoltorio exterior que comparten todos los mensajes. */
export const ENVELOPE_FIELDS: FieldDoc[] = [
  {
    name: 'som_version',
    required: true,
    type: 'string (semver)',
    desc: 'La <b>versión del paquete de schemas</b> a la que se ajusta el payload — <code>"1.0.0"</code> para SOM 1.0.',
    note: 'Solo informativo: los consumidores NO DEBEN tomar decisiones en función de él. <code>"0.3.2"</code> <b>no</b> es SOM 1.0 — tres campos se retiraron antes de la ratificación —, así que un consumidor no debe tratarlo como conforme.',
  },
  {
    name: 'message_id',
    required: true,
    type: 'string (UUID)',
    desc: 'Único por mensaje. Se recomienda UUIDv7, porque se ordena por tiempo. Cada republicación de una Story recibe uno nuevo.',
    note: 'El schema dice <code>format: uuid</code>, y la mayoría de los validadores ignoran <code>format</code> salvo que se les indique lo contrario. La conformidad con SOM 1.0 exige la validación de formatos.',
  },
  {
    name: 'correlation_id',
    required: true,
    type: 'string (UUID)',
    desc: 'Enlaza todos los mensajes sobre el ciclo de vida de una Story. Propágalo de principio a fin: es la clave de partición natural.',
  },
  {
    name: 'causation_id',
    required: false,
    type: 'string (UUID)',
    desc: 'El mensaje que causó directamente este — una advertencia de skill apunta al snapshot que desencadenó la evaluación.',
  },
  {
    name: 'message_type',
    required: true,
    type: 'string',
    desc: 'La familia del payload — <code>story.context</code>, <code>skill.warning.raised</code>, <code>delivery.media_available</code>, <code>link.committed</code>, …',
    note: 'El <b>único</b> discriminador de parseo. Elige el schema del payload a partir de este campo — nunca del topic, de un nombre de archivo, del publicador ni de la forma del payload.',
  },
  {
    name: 'timestamp',
    required: true,
    type: 'string (date-time)',
    desc: 'El momento autoritativo del evento. Se recomienda precisión de microsegundos.',
    note: 'Vive <b>en el envelope, nunca dentro del payload</b> — <code>skill.warning.raised</code> prohíbe explícitamente un <code>timestamp</code> en el payload. No existe el campo <code>signature</code>; el schema lo rechaza.',
  },
  {
    name: 'originating_system',
    required: true,
    type: 'object',
    desc: 'Quién publicó este mensaje. <code>system_id</code> y <code>system_type</code> son obligatorios; <code>system_name</code>, <code>vendor</code> y <code>version</code>, opcionales. Objeto cerrado.',
    note: '<code>system_type</code> es un enum cerrado: <code>ncs</code>, <code>mos_device</code>, <code>graphics</code>, <code>automation</code>, <code>wire_service</code>, <code>ai_agent</code>, <code>compliance_engine</code>, <code>editorial_dashboard</code>, <code>archive</code>, <code>prompter</code>, <code>camera</code>, <code>audio</code>, <code>skill_worker</code>, <code>custom</code>. Antes se llamaba <code>source</code>, que ahora se rechaza de plano. Quien republica una Story la vuelve a sellar, así que una corrección se atribuye a quien corrige.',
  },
  {
    name: 'topic',
    required: true,
    type: 'string',
    desc: 'El topic en el que se publicó el mensaje. DEBE empezar por <code>som.</code>',
    note: 'Ese prefijo es toda la regla sobre topics. La estructura de topics es una decisión de cada despliegue — los ejemplos publicados usan formas como <code>som.story.context.&lt;story_id&gt;</code> — y un consumidor nunca deduce de él el tipo de payload.',
  },
  {
    name: 'modification_header',
    required: false,
    type: 'object',
    desc: 'En mensajes de tipo snapshot, como <code>story.context</code>: <code>story_version</code>, <code>modified_at</code>, <code>modified_by</code>, <code>change_summary</code>, <code>history</code>.',
  },
  {
    name: '_actors',
    required: false,
    type: 'object',
    desc: 'Mapa clave-valor de actores con claves cortas, para describir a un actor una sola vez y referenciarlo por su clave en el resto del mensaje.',
  },
  {
    name: '@context',
    required: false,
    type: 'string | object',
    desc: 'Contexto JSON-LD. Aplazado, pero permitido por compatibilidad futura.',
  },
  {
    name: 'extensions',
    required: false,
    type: 'object',
    desc: 'Campos de fabricante, con espacio de nombres de dominio invertido: cada clave debe coincidir con <code>com.{vendor}.</code>',
    note: 'Los consumidores DEBEN ignorar las extensions que no reconozcan y NO DEBEN rechazar un mensaje por llevarlas. Una clave sin el espacio de nombres <code>com.</code> no pasa la validación.',
  },
  {
    name: 'payload',
    required: true,
    type: 'object',
    desc: 'El payload tipado, validado contra el schema del <code>message_type</code> declarado.',
  },
];

/** `skill.warning.raised` — doce campos obligatorios, según skill-warning.schema.json 1.0. */
export const WARNING_FIELDS: FieldDoc[] = [
  { name: 'warning_id', required: true, type: 'string (UUIDv7)', desc: 'Identidad de esta advertencia.' },
  { name: 'skill_id', required: true, type: 'string', desc: 'Qué skill la declaró, con la forma <code>publisher/skill-name</code> — <code>smart-stories/hold-while-flagged</code>.' },
  { name: 'skill_version', required: true, type: 'string (semver)', desc: 'Versión del archivo de skill que se invocó (recall).' },
  { name: 'story_id', required: true, type: 'string', desc: 'La Story a la que se refiere la advertencia. Estable en todos los snapshots.' },
  {
    name: 'scope',
    required: true,
    type: 'string',
    desc: 'El nivel en que se dispara, escrito <code>{level}:{id}</code>: <code>link:{link_id}</code>, <code>asset:{asset_id}</code> o <code>story:{story_id}</code>.',
    note: 'Un hold específico de un destino tiene alcance <code>link:</code>; uno que afecta a toda la Story tiene alcance <code>story:</code>. Una aprobación solo cuenta en el mismo alcance en que se declaró el hold.',
  },
  {
    name: 'severity',
    required: true,
    type: 'enum',
    desc: '<code>hold</code> | <code>flag</code> | <code>inform</code>.',
    note: 'En minúsculas, para siempre — una excepción deliberada a los enums UPPER_SNAKE de SOM. <code>hold</code>: el executor DEBE retener la salida en los campos afectados. <code>flag</code>: marcar para revisión. <code>inform</code>: informativo.',
  },
  { name: 'rule_id', required: true, type: 'string', desc: 'Qué regla, o qué instancia configurada de la skill, la produjo.' },
  { name: 'non_overridable', required: true, type: 'boolean', desc: 'Si alguien puede saltársela con un clic. Un hold que se puede anular con un solo clic es justo la práctica manual que SOM sustituye.' },
  { name: 'affected_fields', required: true, type: 'string[]', desc: 'Las rutas de la Story a las que se refiere la advertencia — <code>editorial_gates[].status</code>, <code>headline</code>.' },
  { name: 'detail', required: true, type: 'string', desc: 'Motivo legible por humanos. En un hold debería decir qué lo levantaría; si no, acaba en una llamada telefónica.' },
  { name: 'blocks', required: true, type: 'string[]', desc: 'Las acciones retenidas, como <code>air:story-verdict-0412</code>. Vacío en las advertencias informativas.' },
  { name: 'skill_warning_ref', required: true, type: 'string', desc: 'Referencia inversa para correlacionar una advertencia con su resolución.' },
  {
    name: 'content_type',
    required: false,
    type: 'string',
    desc: 'Clave de renderizado gobernada (por ejemplo, <code>sync.ai.banner</code>), ampliable por fabricantes mediante <code>extensions</code>.',
  },
  {
    name: 'message_type',
    required: false,
    type: 'const',
    desc: '<code>"skill.warning.raised"</code> — la forma con sufijo, que puede viajar en el payload para el enrutamiento por topic.',
    note: 'Aquí se rechazan explícitamente dos campos: <code>timestamp</code> (pertenece al envelope) e <code>instance_ref</code> (retirado — las salidas se acotan a su nivel de disparo mediante <code>scope</code>).',
  },
];

/** Las siete familias de mensajes de SOM 1.0, en el orden en que las enumera la especificación. */
export const FAMILIES: Family[] = [
  {
    name: 'Envelope del mensaje',
    schema: 'envelope.schema.json',
    messageTypes: ['(todos los mensajes)'],
    publishedBy: 'todo publicador',
    purpose: 'El envoltorio cerrado que lleva cada mensaje. Su payload es polimórfico según message_type.',
  },
  {
    name: 'story.context',
    schema: 'story-context.schema.json',
    messageTypes: ['story.context'],
    publishedBy: 'el propietario de la Story',
    purpose: 'El estado completo de una Story en un momento dado — un snapshot, nunca un delta.',
  },
  {
    name: 'som.telling.*',
    schema: 'telling-event.schema.json',
    messageTypes: ['telling.started', 'telling.ended', 'telling.exposed'],
    publishedBy: 'el publicador de la exposición',
    purpose: 'Cuándo un Asset llegó a una audiencia. El estado «al aire» se deriva de estos eventos, nunca se guarda en el Asset.',
  },
  {
    name: 'som.link.*',
    schema: 'link-event.schema.json',
    messageTypes: ['link.committed', 'link.gate_changed', 'link.withdrawn'],
    publishedBy: 'el sistema que confirma el vínculo',
    purpose: 'Un Asset vinculado a un destino, con un gate de cumplimiento por destino. assets[].usage[] se mantiene exclusivamente a partir de estos eventos.',
  },
  {
    name: 'delivery.media_available',
    schema: 'delivery-media-available.schema.json',
    messageTypes: ['delivery.media_available'],
    publishedBy: 'el almacén de medios (MAM / TAMS)',
    purpose: 'Han llegado medios a un almacén — por TAMS Source o por un localizador no TAMS. Sin bytes, sin story_id.',
  },
  {
    name: 'som.system.audit',
    schema: 'system-audit.schema.json',
    messageTypes: ['system.audit'],
    publishedBy: 'cualquier actor de gobernanza',
    purpose: 'El rastro de gobernanza: CLEARED, SUPPRESSED, WITHHELD u OVERRIDDEN, sobre un link, un Asset o un Telling.',
  },
  {
    name: 'skill.warning.raised',
    schema: 'skill-warning.schema.json',
    messageTypes: ['skill.warning.raised'],
    publishedBy: 'un executor de skills',
    purpose: 'Lo que una skill declaró sobre una Story, publicado por el executor dentro de la herramienta que la invocó.',
  },
];
