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

/** The SOM envelope — the outer wrapper every message shares. It is a closed
 *  object: unknown top-level fields fail validation. */
export const ENVELOPE_FIELDS: FieldDoc[] = [
  {
    name: 'som_version',
    required: true,
    type: 'string',
    desc: 'The <b>schema pack version</b> the payload conforms to — <code>"0.3.2"</code> on the current pack.',
    note: 'Informative only. Never branch on it — <code>message_type</code> is what identifies the payload family. Traffic recorded before 12 Aug 2026 reads <code>0.2.0</code>, the retired SOM-048 wire freeze.',
  },
  {
    name: 'message_id',
    required: true,
    type: 'string (UUID, v7 recommended)',
    desc: 'Unique per message. A republished story version gets a fresh <code>message_id</code> every time.',
  },
  {
    name: 'correlation_id',
    required: true,
    type: 'string (UUID, v7 recommended)',
    desc: 'Links every message about the same story lifecycle. Thread it end-to-end.',
    note: 'Skill outputs echo the inbound envelope’s correlation id, and republished story versions keep it. Follow one id through the bus and you have the whole chain.',
  },
  {
    name: 'causation_id',
    required: false,
    type: 'string (UUID)',
    desc: 'The message that directly caused this one. On an approval republish it points at the staged message.',
  },
  {
    name: 'message_type',
    required: true,
    type: 'string',
    desc: 'The payload family — <code>story.context</code>, <code>skill.warning.raised</code>, <code>delivery.media_available</code>, …',
    note: 'Names are <b>suffixed</b> on the wire: <code>skill.warning.raised</code>, not <code>skill.warning</code>.',
  },
  {
    name: 'timestamp',
    required: true,
    type: 'string (ISO 8601)',
    desc: 'When the message was produced.',
    note: 'Lives <b>here, on the envelope — never inside the payload</b> (decision #18). There is no <code>signature</code> field; it was removed in the same decision.',
  },
  {
    name: 'originating_system',
    required: true,
    type: 'object',
    desc: 'Who produced the message. <code>system_id</code> + <code>system_type</code> required; <code>system_name</code>, <code>vendor</code>, <code>version</code> optional.',
    note: 'Renamed from <code>source</code> at v0.3, and the legacy field is hard-rejected. The newsroom system value is <code>ncs</code> — there is no <code>newsroom</code> value in the enum.',
  },
  {
    name: 'topic',
    required: true,
    type: 'string',
    desc: 'The topic the message was published to. All topic names carry the <code>som.</code> prefix.',
  },
  {
    name: 'modification_header',
    required: false,
    type: 'object',
    desc: 'On snapshot-style messages such as <code>story.context</code>: <code>story_version</code>, <code>modified_at</code> / <code>modified_by</code>, <code>change_summary</code>, <code>history</code>.',
  },
  {
    name: '_actors',
    required: false,
    type: 'object',
    desc: 'Key-value map of short-key actor lookups, so an actor is described once and referenced by key everywhere else.',
  },
  {
    name: '@context',
    required: false,
    type: 'string | object',
    desc: 'JSON-LD context. Deferred in v0.3, permitted for forward compatibility.',
  },
  {
    name: 'extensions',
    required: false,
    type: 'object',
    desc: 'Vendor fields, reverse-domain namespaced: <code>com.{vendor}.*</code>.',
    note: 'The <i>designed</i> escape hatch, not a workaround. Consumers MUST silently ignore keys they don’t recognise. Anything that graduates into the spec drops its vendor prefix on promotion.',
  },
  {
    name: 'payload',
    required: true,
    type: 'object',
    desc: 'The typed payload — this is the part the JSON Schemas validate.',
    note: 'Skill rules address fields inside it by dot-notation path (<code>lifecycle.phase</code>), relative to the payload root.',
  },
];

/** `skill.warning.raised` — the normative 12-field payload from Skills
 *  Integration Spec §4.4.2. */
export const WARNING_FIELDS: FieldDoc[] = [
  { name: 'warning_id', required: true, type: 'string (UUIDv7)', desc: 'Identity of this warning. One warning, one pending row, one approve/reject.' },
  { name: 'skill_id', required: true, type: 'string', desc: 'Which skill raised it, in <code>vendor/skill-name</code> form.' },
  { name: 'skill_version', required: true, type: 'string (semver)', desc: 'Version of the skill definition that fired.' },
  { name: 'story_id', required: true, type: 'string', desc: 'The story the warning is about. Stable across every republished version.' },
  { name: 'scope', required: true, type: 'string', desc: 'What the warning covers.' },
  {
    name: 'severity',
    required: true,
    type: 'enum',
    desc: '<code>hold</code> | <code>flag</code> | <code>inform</code>.',
    note: 'Lower-case — one of only two deliberate exceptions to SOM’s UPPER_SNAKE enum convention. The other is <code>x-</code> / <code>com.{vendor}</code> extension values.',
  },
  { name: 'rule_id', required: true, type: 'string', desc: 'Which rule inside the skill matched.' },
  { name: 'non_overridable', required: true, type: 'boolean', desc: 'Whether an editor may override this warning at all.' },
  { name: 'affected_fields', required: true, type: 'string[]', desc: 'The payload paths the warning is about — what an editor should go and look at.' },
  { name: 'detail', required: true, type: 'string', desc: 'Human-readable reason, rendered from the rule’s <code>detail_template</code> with <code>{placeholder}</code> substitutions.' },
  { name: 'blocks', required: true, type: 'string[]', desc: 'What downstream actions this warning blocks. Empty for advisory warnings.' },
  { name: 'skill_warning_ref', required: true, type: 'string', desc: 'Back-reference used to correlate a warning with its resolution.' },
  {
    name: 'instance_ref',
    required: false,
    type: 'string',
    desc: 'Binds the warning to one <code>instances[].instance_id</code> — a single surface of the story (linear, web, social).',
    note: 'Singular by design. If the same warning applies to two instances, emit two warnings with two ids. Omit it entirely for story-wide warnings.',
  },
];
