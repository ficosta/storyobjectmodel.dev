export interface FieldDoc {
  /** Field name as it appears on the wire. */
  name: string;
  required: boolean;
  type: string;
  /** Short description. May contain inline <code> markup. */
  desc: string;
  /** Optional gotcha / nuance shown in a dimmer paragraph. */
  note?: string;
}

/** `originating_system.system_type`, the closed enum in envelope.schema.json 1.0. */
export const SYSTEM_TYPES: string[] = [
  'ncs',
  'mos_device',
  'graphics',
  'automation',
  'wire_service',
  'ai_agent',
  'compliance_engine',
  'editorial_dashboard',
  'archive',
  'prompter',
  'camera',
  'audio',
  'skill_worker',
  'custom',
];

/** The SOM 1.0 envelope — the outer wrapper every message shares. It is a
 *  closed object: unknown top-level fields fail validation. */
export const ENVELOPE_FIELDS: FieldDoc[] = [
  {
    name: 'som_version',
    required: true,
    type: 'string (semver)',
    desc: 'The <b>schema pack version</b> the payload conforms to — <code>"1.0.0"</code> for SOM 1.0.',
    note: 'Informative only: consumers MUST NOT branch on it. <code>"0.3.2"</code> is <b>not</b> SOM 1.0 — three fields were withdrawn before ratification — so a consumer must not treat it as conformant.',
  },
  {
    name: 'message_id',
    required: true,
    type: 'string (UUID)',
    desc: 'Unique per message. UUIDv7 is recommended, because it sorts by time. Every republish of a story gets a fresh one.',
    note: 'The schema says <code>format: uuid</code>, and most validators ignore <code>format</code> unless told otherwise. SOM 1.0 conformance requires format assertion.',
  },
  {
    name: 'correlation_id',
    required: true,
    type: 'string (UUID)',
    desc: 'Links every message about one story lifecycle. Thread it end to end — it is the natural partition key.',
  },
  {
    name: 'causation_id',
    required: false,
    type: 'string (UUID)',
    desc: 'The message that directly caused this one — a skill warning points at the snapshot that triggered evaluation.',
  },
  {
    name: 'message_type',
    required: true,
    type: 'string',
    desc: 'The payload family — <code>story.context</code>, <code>skill.warning.raised</code>, <code>delivery.media_available</code>, <code>link.committed</code>, …',
    note: 'The <b>only</b> parsing discriminator. Select the payload schema from this field — never from the topic, a filename, the publisher or the payload shape.',
  },
  {
    name: 'timestamp',
    required: true,
    type: 'string (date-time)',
    desc: 'The authoritative time of the event. Microsecond precision recommended.',
    note: 'Lives <b>on the envelope, never inside the payload</b> — <code>skill.warning.raised</code> explicitly forbids a payload <code>timestamp</code>. There is no <code>signature</code> field; the schema rejects it.',
  },
  {
    name: 'originating_system',
    required: true,
    type: 'object',
    desc: 'Who published this message. <code>system_id</code> and <code>system_type</code> required; <code>system_name</code>, <code>vendor</code>, <code>version</code> optional. Closed object.',
    note: '<code>system_type</code> is a closed enum: <code>ncs</code>, <code>mos_device</code>, <code>graphics</code>, <code>automation</code>, <code>wire_service</code>, <code>ai_agent</code>, <code>compliance_engine</code>, <code>editorial_dashboard</code>, <code>archive</code>, <code>prompter</code>, <code>camera</code>, <code>audio</code>, <code>skill_worker</code>, <code>custom</code>. Renamed from <code>source</code>, which is now hard-rejected. Whoever republishes a story re-stamps it, so a correction is attributed to the corrector.',
  },
  {
    name: 'topic',
    required: true,
    type: 'string',
    desc: 'The topic the message was published to. It MUST begin with <code>som.</code>',
    note: 'That prefix is the whole of the topic rule. Topic layout is a deployment choice — the published examples use forms such as <code>som.story.context.&lt;story_id&gt;</code> — and a consumer never infers the payload type from it.',
  },
  {
    name: 'modification_header',
    required: false,
    type: 'object',
    desc: 'On snapshot-style messages such as <code>story.context</code>: <code>story_version</code>, <code>modified_at</code>, <code>modified_by</code>, <code>change_summary</code>, <code>history</code>.',
  },
  {
    name: '_actors',
    required: false,
    type: 'object',
    desc: 'Key-value map of short-key actor lookups, so an actor is described once and referenced by key elsewhere.',
  },
  {
    name: '@context',
    required: false,
    type: 'string | object',
    desc: 'JSON-LD context. Deferred, but permitted for forward compatibility.',
  },
  {
    name: 'extensions',
    required: false,
    type: 'object',
    desc: 'Vendor fields, reverse-domain namespaced: every key must match <code>com.{vendor}.</code>',
    note: 'Consumers MUST ignore extensions they do not recognise and MUST NOT reject a message for carrying them. A key without the <code>com.</code> namespace fails validation.',
  },
  {
    name: 'payload',
    required: true,
    type: 'object',
    desc: 'The typed payload, validated against the schema for the declared <code>message_type</code>.',
  },
];

/** `skill.warning.raised` — twelve required fields, per skill-warning.schema.json 1.0. */
export const WARNING_FIELDS: FieldDoc[] = [
  { name: 'warning_id', required: true, type: 'string (UUIDv7)', desc: 'Identity of this warning.' },
  { name: 'skill_id', required: true, type: 'string', desc: 'Which skill declared it, in <code>publisher/skill-name</code> form — <code>smart-stories/hold-while-flagged</code>.' },
  { name: 'skill_version', required: true, type: 'string (semver)', desc: 'Version of the skill file that was recalled.' },
  { name: 'story_id', required: true, type: 'string', desc: 'The story the warning is about. Stable across every snapshot.' },
  {
    name: 'scope',
    required: true,
    type: 'string',
    desc: 'The firing level, written <code>{level}:{id}</code>: <code>link:{link_id}</code>, <code>asset:{asset_id}</code> or <code>story:{story_id}</code>.',
    note: 'A destination-specific hold is <code>link:</code>-scoped; a story-wide one is <code>story:</code>-scoped. A clearance only counts against the scope the hold was declared at.',
  },
  {
    name: 'severity',
    required: true,
    type: 'enum',
    desc: '<code>hold</code> | <code>flag</code> | <code>inform</code>.',
    note: 'Lower-case, permanently — a deliberate carve-out from SOM’s UPPER_SNAKE enums. <code>hold</code>: the executor MUST withhold output on the affected fields. <code>flag</code>: mark for review. <code>inform</code>: advisory.',
  },
  { name: 'rule_id', required: true, type: 'string', desc: 'Which rule, or which configured instance of the skill, produced it.' },
  { name: 'non_overridable', required: true, type: 'boolean', desc: 'Whether anyone may click past it. A hold that can be overridden with one click is the manual practice SOM replaces.' },
  { name: 'affected_fields', required: true, type: 'string[]', desc: 'The story paths the warning is about — <code>editorial_gates[].status</code>, <code>headline</code>.' },
  { name: 'detail', required: true, type: 'string', desc: 'Human-readable reason. For a hold it should say what would clear it, or it produces a phone call.' },
  { name: 'blocks', required: true, type: 'string[]', desc: 'The actions withheld, such as <code>air:story-verdict-0412</code>. Empty for advisory warnings.' },
  { name: 'skill_warning_ref', required: true, type: 'string', desc: 'Back-reference used to correlate a warning with its resolution.' },
  {
    name: 'content_type',
    required: false,
    type: 'string',
    desc: 'Governed render key (for example <code>sync.ai.banner</code>), vendor-extended through <code>extensions</code>.',
  },
  {
    name: 'message_type',
    required: false,
    type: 'const',
    desc: '<code>"skill.warning.raised"</code> — the suffixed form, which may ride in the payload for topic routing.',
    note: 'Two fields are explicitly rejected here: <code>timestamp</code> (it belongs on the envelope) and <code>instance_ref</code> (retired — outputs scope to their firing level through <code>scope</code>).',
  },
];

export interface Family {
  /** How the family is named in the standard. */
  name: string;
  schema: string;
  messageTypes: string[];
  publishedBy: string;
  purpose: string;
}

/** The seven message families of SOM 1.0, in the order the specification lists them. */
export const FAMILIES: Family[] = [
  {
    name: 'Message envelope',
    schema: 'envelope.schema.json',
    messageTypes: ['(every message)'],
    publishedBy: 'every publisher',
    purpose: 'The closed wrapper every message carries. Its payload is polymorphic on message_type.',
  },
  {
    name: 'story.context',
    schema: 'story-context.schema.json',
    messageTypes: ['story.context'],
    publishedBy: 'the story owner',
    purpose: 'The complete state of one story at a moment in time — a snapshot, never a delta.',
  },
  {
    name: 'som.telling.*',
    schema: 'telling-event.schema.json',
    messageTypes: ['telling.started', 'telling.ended', 'telling.exposed'],
    publishedBy: 'the exposure publisher',
    purpose: 'When an asset met an audience. On-air state is derived from these, never stored on the asset.',
  },
  {
    name: 'som.link.*',
    schema: 'link-event.schema.json',
    messageTypes: ['link.committed', 'link.gate_changed', 'link.withdrawn'],
    publishedBy: 'the committing system',
    purpose: 'An asset committed to a destination, with a compliance gate per destination. assets[].usage[] is maintained from these alone.',
  },
  {
    name: 'delivery.media_available',
    schema: 'delivery-media-available.schema.json',
    messageTypes: ['delivery.media_available'],
    publishedBy: 'the media store (MAM / TAMS)',
    purpose: 'Media has arrived in a store — by TAMS Source or by a non-TAMS locator. No bytes, no story_id.',
  },
  {
    name: 'som.system.audit',
    schema: 'system-audit.schema.json',
    messageTypes: ['system.audit'],
    publishedBy: 'any governance actor',
    purpose: 'The governance trail: CLEARED, SUPPRESSED, WITHHELD or OVERRIDDEN, against a link, asset or telling.',
  },
  {
    name: 'skill.warning.raised',
    schema: 'skill-warning.schema.json',
    messageTypes: ['skill.warning.raised'],
    publishedBy: 'a skills executor',
    purpose: 'What a skill declared about a story, published by the executor inside the tool that recalled it.',
  },
];
