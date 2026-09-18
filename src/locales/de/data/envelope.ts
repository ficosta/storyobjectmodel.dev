import type { FieldDoc, Family } from '../../../data/envelope';

export type { FieldDoc, Family } from '../../../data/envelope';
export { SYSTEM_TYPES } from '../../../data/envelope';

/** The SOM 1.0 envelope — the outer wrapper every message shares. It is a
 *  closed object: unknown top-level fields fail validation. */
export const ENVELOPE_FIELDS: FieldDoc[] = [
  {
    name: 'som_version',
    required: true,
    type: 'string (semver)',
    desc: 'Die <b>Version des Schema-Pakets</b>, der das Payload entspricht — <code>"1.0.0"</code> für SOM 1.0.',
    note: 'Rein informativ: Consumer DÜRFEN NICHT danach verzweigen. <code>"0.3.2"</code> ist <b>nicht</b> SOM 1.0 — drei Felder wurden vor der Ratifizierung zurückgezogen —, ein Consumer darf es also nicht als konform behandeln.',
  },
  {
    name: 'message_id',
    required: true,
    type: 'string (UUID)',
    desc: 'Eindeutig pro Nachricht. Empfohlen ist UUIDv7, weil sie zeitlich sortiert. Jede erneute Veröffentlichung einer Story bekommt eine neue.',
    note: 'Das Schema sagt <code>format: uuid</code>, und die meisten Validatoren ignorieren <code>format</code>, solange man es ihnen nicht anders sagt. Konformität mit SOM 1.0 verlangt Format-Assertion.',
  },
  {
    name: 'correlation_id',
    required: true,
    type: 'string (UUID)',
    desc: 'Verbindet alle Nachrichten zum Lebenszyklus einer Story. Reichen Sie sie durchgängig weiter — sie ist der natürliche Partitionsschlüssel.',
  },
  {
    name: 'causation_id',
    required: false,
    type: 'string (UUID)',
    desc: 'Die Nachricht, die diese direkt ausgelöst hat — eine Skill-Warnung verweist auf den Snapshot, der die Auswertung angestoßen hat.',
  },
  {
    name: 'message_type',
    required: true,
    type: 'string',
    desc: 'Die Payload-Familie — <code>story.context</code>, <code>skill.warning.raised</code>, <code>delivery.media_available</code>, <code>link.committed</code>, …',
    note: 'Der <b>einzige</b> Diskriminator beim Parsen. Wählen Sie das Payload-Schema anhand dieses Felds — niemals anhand des Topics, eines Dateinamens, des Publishers oder der Form des Payloads.',
  },
  {
    name: 'timestamp',
    required: true,
    type: 'string (date-time)',
    desc: 'Der maßgebliche Zeitpunkt des Ereignisses. Mikrosekundengenauigkeit wird empfohlen.',
    note: 'Steht <b>im Envelope, niemals im Payload</b> — <code>skill.warning.raised</code> verbietet ausdrücklich einen <code>timestamp</code> im Payload. Ein Feld <code>signature</code> gibt es nicht; das Schema weist es zurück.',
  },
  {
    name: 'originating_system',
    required: true,
    type: 'object',
    desc: 'Wer diese Nachricht veröffentlicht hat. <code>system_id</code> und <code>system_type</code> sind Pflicht; <code>system_name</code>, <code>vendor</code>, <code>version</code> optional. Geschlossenes Objekt.',
    note: '<code>system_type</code> ist ein geschlossenes Enum: <code>ncs</code>, <code>mos_device</code>, <code>graphics</code>, <code>automation</code>, <code>wire_service</code>, <code>ai_agent</code>, <code>compliance_engine</code>, <code>editorial_dashboard</code>, <code>archive</code>, <code>prompter</code>, <code>camera</code>, <code>audio</code>, <code>skill_worker</code>, <code>custom</code>. Umbenannt von <code>source</code>, das nun hart abgewiesen wird. Wer eine Story erneut veröffentlicht, stempelt sie neu — eine Korrektur wird also dem Korrigierenden zugeschrieben.',
  },
  {
    name: 'topic',
    required: true,
    type: 'string',
    desc: 'Das Topic, auf dem die Nachricht veröffentlicht wurde. Es MUSS mit <code>som.</code> beginnen.',
    note: 'Dieses Präfix ist die gesamte Topic-Regel. Die Topic-Struktur ist eine Entscheidung des Deployments — die veröffentlichten Beispiele nutzen Formen wie <code>som.story.context.&lt;story_id&gt;</code> —, und ein Consumer leitet den Payload-Typ nie daraus ab.',
  },
  {
    name: 'modification_header',
    required: false,
    type: 'object',
    desc: 'Bei Snapshot-Nachrichten wie <code>story.context</code>: <code>story_version</code>, <code>modified_at</code>, <code>modified_by</code>, <code>change_summary</code>, <code>history</code>.',
  },
  {
    name: '_actors',
    required: false,
    type: 'object',
    desc: 'Key-Value-Map mit Kurzschlüsseln für Akteure, sodass ein Akteur einmal beschrieben und anderswo per Schlüssel referenziert wird.',
  },
  {
    name: '@context',
    required: false,
    type: 'string | object',
    desc: 'JSON-LD-Kontext. Zurückgestellt, aber aus Gründen der Vorwärtskompatibilität erlaubt.',
  },
  {
    name: 'extensions',
    required: false,
    type: 'object',
    desc: 'Herstellerfelder mit Reverse-Domain-Namespace: Jeder Schlüssel muss auf <code>com.{vendor}.</code> passen.',
    note: 'Consumer MÜSSEN extensions ignorieren, die sie nicht kennen, und DÜRFEN eine Nachricht NICHT deshalb abweisen. Ein Schlüssel ohne den Namespace <code>com.</code> fällt bei der Validierung durch.',
  },
  {
    name: 'payload',
    required: true,
    type: 'object',
    desc: 'Das typisierte Payload, validiert gegen das Schema des angegebenen <code>message_type</code>.',
  },
];

/** `skill.warning.raised` — twelve required fields, per skill-warning.schema.json 1.0. */
export const WARNING_FIELDS: FieldDoc[] = [
  { name: 'warning_id', required: true, type: 'string (UUIDv7)', desc: 'Identität dieser Warnung.' },
  { name: 'skill_id', required: true, type: 'string', desc: 'Welcher Skill sie deklariert hat, in der Form <code>publisher/skill-name</code> — <code>smart-stories/hold-while-flagged</code>.' },
  { name: 'skill_version', required: true, type: 'string (semver)', desc: 'Version der Skill-Datei, die per Recall geladen wurde.' },
  { name: 'story_id', required: true, type: 'string', desc: 'Die Story, um die es in der Warnung geht. Über alle Snapshots hinweg stabil.' },
  {
    name: 'scope',
    required: true,
    type: 'string',
    desc: 'Die auslösende Ebene, geschrieben als <code>{level}:{id}</code>: <code>link:{link_id}</code>, <code>asset:{asset_id}</code> oder <code>story:{story_id}</code>.',
    note: 'Ein Hold für ein bestimmtes Ziel hat den Scope <code>link:</code>; ein Story-weiter den Scope <code>story:</code>. Eine Freigabe zählt nur für den Scope, auf dem der Hold deklariert wurde.',
  },
  {
    name: 'severity',
    required: true,
    type: 'enum',
    desc: '<code>hold</code> | <code>flag</code> | <code>inform</code>.',
    note: 'Dauerhaft kleingeschrieben — eine bewusste Ausnahme von den UPPER_SNAKE-Enums in SOM. <code>hold</code>: Der Executor MUSS die Ausgabe der betroffenen Felder zurückhalten. <code>flag</code>: zur Prüfung markieren. <code>inform</code>: Hinweis.',
  },
  { name: 'rule_id', required: true, type: 'string', desc: 'Welche Regel oder welche konfigurierte Instanz des Skills sie erzeugt hat.' },
  { name: 'non_overridable', required: true, type: 'boolean', desc: 'Ob jemand sie wegklicken darf. Ein Hold, den man mit einem Klick übergehen kann, ist genau die manuelle Praxis, die SOM ersetzt.' },
  { name: 'affected_fields', required: true, type: 'string[]', desc: 'Die Story-Pfade, um die es in der Warnung geht — <code>editorial_gates[].status</code>, <code>headline</code>.' },
  { name: 'detail', required: true, type: 'string', desc: 'Begründung für Menschen. Bei einem Hold sollte sie sagen, was ihn aufheben würde — sonst folgt ein Anruf.' },
  { name: 'blocks', required: true, type: 'string[]', desc: 'Die zurückgehaltenen Aktionen, etwa <code>air:story-verdict-0412</code>. Leer bei reinen Hinweisen.' },
  { name: 'skill_warning_ref', required: true, type: 'string', desc: 'Rückverweis, mit dem eine Warnung ihrer Auflösung zugeordnet wird.' },
  {
    name: 'content_type',
    required: false,
    type: 'string',
    desc: 'Geregelter Render-Schlüssel (zum Beispiel <code>sync.ai.banner</code>), herstellerseitig erweiterbar über <code>extensions</code>.',
  },
  {
    name: 'message_type',
    required: false,
    type: 'const',
    desc: '<code>"skill.warning.raised"</code> — die Form mit Suffix, die für das Topic-Routing im Payload mitfahren darf.',
    note: 'Zwei Felder werden hier ausdrücklich abgewiesen: <code>timestamp</code> (gehört in den Envelope) und <code>instance_ref</code> (ausgemustert — Ausgaben erhalten ihren Scope über <code>scope</code> auf ihrer auslösenden Ebene).',
  },
];

/** The seven message families of SOM 1.0, in the order the specification lists them. */
export const FAMILIES: Family[] = [
  {
    name: 'Nachrichten-Envelope',
    schema: 'envelope.schema.json',
    messageTypes: ['(jede Nachricht)'],
    publishedBy: 'jeder Publisher',
    purpose: 'Die geschlossene Hülle, die jede Nachricht trägt. Ihr Payload ist polymorph über message_type.',
  },
  {
    name: 'story.context',
    schema: 'story-context.schema.json',
    messageTypes: ['story.context'],
    publishedBy: 'der Eigentümer der Story',
    purpose: 'Der vollständige Zustand einer Story zu einem Zeitpunkt — ein Snapshot, niemals ein Delta.',
  },
  {
    name: 'som.telling.*',
    schema: 'telling-event.schema.json',
    messageTypes: ['telling.started', 'telling.ended', 'telling.exposed'],
    publishedBy: 'der Exposure-Publisher',
    purpose: 'Wann ein Asset auf ein Publikum traf. Der On-Air-Zustand wird daraus abgeleitet, nie am Asset gespeichert.',
  },
  {
    name: 'som.link.*',
    schema: 'link-event.schema.json',
    messageTypes: ['link.committed', 'link.gate_changed', 'link.withdrawn'],
    publishedBy: 'das festschreibende System',
    purpose: 'Ein Asset, das einem Ziel zugesagt ist, mit einem Compliance-Gate pro Ziel. assets[].usage[] wird allein aus diesen Events gepflegt.',
  },
  {
    name: 'delivery.media_available',
    schema: 'delivery-media-available.schema.json',
    messageTypes: ['delivery.media_available'],
    publishedBy: 'der Medienspeicher (MAM / TAMS)',
    purpose: 'Medien sind in einem Speicher eingetroffen — per TAMS Source oder per Nicht-TAMS-Locator. Keine Bytes, keine story_id.',
  },
  {
    name: 'som.system.audit',
    schema: 'system-audit.schema.json',
    messageTypes: ['system.audit'],
    publishedBy: 'jeder Governance-Akteur',
    purpose: 'Die Governance-Spur: CLEARED, SUPPRESSED, WITHHELD oder OVERRIDDEN, bezogen auf einen Link, ein Asset oder ein Telling.',
  },
  {
    name: 'skill.warning.raised',
    schema: 'skill-warning.schema.json',
    messageTypes: ['skill.warning.raised'],
    publishedBy: 'ein Skills-Executor',
    purpose: 'Was ein Skill über eine Story deklariert hat, veröffentlicht vom Executor in dem Tool, das ihn per Recall geladen hat.',
  },
];
