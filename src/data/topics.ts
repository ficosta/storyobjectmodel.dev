export type TopicStatus = 'live' | 'mock' | 'planned';
export type TopicLayer = 'core' | 'distribution';

export interface Topic {
  name: string;
  layer: TopicLayer;
  messageTypes: string[];
  producer: string;
  consumer: string;
  status: TopicStatus;
  purpose: string;
}

export const STATUS_LABEL: Record<TopicStatus, string> = {
  live: 'live',
  mock: 'mock producer',
  planned: 'schema ready',
};

export const TOPICS: Topic[] = [
  {
    name: 'som.story.context',
    layer: 'core',
    messageTypes: ['story.context'],
    producer: 'NRCS / AP / test producer',
    consumer: 'Executor, dashboard',
    status: 'live',
    purpose: 'Inbound story snapshots from the newsroom. Republished in full on every change.',
  },
  {
    name: 'som.skills.staging',
    layer: 'core',
    messageTypes: ['skill.warning.raised', 'skill.suggestion.created'],
    producer: 'Executor',
    consumer: 'Dashboard (pending lane)',
    status: 'live',
    purpose: 'Skill outputs awaiting a human decision. The executor can publish nowhere else.',
  },
  {
    name: 'som.skills.events',
    layer: 'core',
    messageTypes: ['approved skill outputs'],
    producer: 'Approval gate',
    consumer: 'Downstream production systems',
    status: 'live',
    purpose: 'The production bus. Everything here has been approved by a person.',
  },
  {
    name: 'som.skills.rejected',
    layer: 'core',
    messageTypes: ['rejected skill outputs'],
    producer: 'Approval gate',
    consumer: 'Audit systems',
    status: 'live',
    purpose: 'Rejected outputs, kept for audit. A reject is a recorded non-action, not a deletion.',
  },
  {
    name: 'som.skills.runs',
    layer: 'core',
    messageTypes: ['skill.run.completed'],
    producer: 'Executor',
    consumer: 'Dashboard (audit)',
    status: 'live',
    purpose: 'Execution records: latency, what was read, what was emitted. One per skill per story version.',
  },
  {
    name: 'som.delivery.media_available',
    layer: 'distribution',
    messageTypes: ['delivery.media_available'],
    producer: 'MAM / TAMS store',
    consumer: 'Media coordinator',
    status: 'mock',
    purpose: 'The availability handshake: essence has arrived in, or is growing inside, a store.',
  },
  {
    name: 'som.link.committed · .gate_changed · .withdrawn',
    layer: 'distribution',
    messageTypes: ['link.committed', 'link.gate_changed', 'link.withdrawn'],
    producer: 'Distribution participants',
    consumer: 'Maintains assets[].usage[]',
    status: 'planned',
    purpose: 'Asset-to-destination commitments, with a compliance gate evaluated per destination.',
  },
  {
    name: 'som.telling.started · .ended · .exposed',
    layer: 'distribution',
    messageTypes: ['telling.started', 'telling.ended', 'telling.exposed'],
    producer: 'Playout / distribution',
    consumer: 'Derives on-air state',
    status: 'planned',
    purpose: 'On-air exposure events. On-air state is derived from these, never stored on the asset.',
  },
  {
    name: 'som.system.audit',
    layer: 'distribution',
    messageTypes: ['system.audit'],
    producer: 'Coordinator, approval gate',
    consumer: 'Audit / dashboard',
    status: 'mock',
    purpose: 'The governance trail: CLEARED for approvals, WITHHELD for rejections and safe-state stops.',
  },
];

export interface RuleType {
  type: string;
  config: string;
  fires: string;
  subs: string;
}

/** The seven built-in rule types the reference executor interprets. */
export const RULE_TYPES: RuleType[] = [
  {
    type: 'term_match',
    config: 'field, terms[], case_sensitive?',
    fires: 'the field’s text contains one of the terms (once per term)',
    subs: '{term} {field} {value}',
  },
  {
    type: 'phase_with_missing_field',
    config: 'phase, field, phase_field?',
    fires: 'the story is in phase AND field is empty',
    subs: '{phase} {field}',
  },
  {
    type: 'field_value_in',
    config: 'field, values[]',
    fires: 'the field equals one of values',
    subs: '{value} {field}',
  },
  {
    type: 'field_present',
    config: 'field',
    fires: 'the field exists and is non-empty',
    subs: '{field}',
  },
  {
    type: 'field_absent',
    config: 'field',
    fires: 'the field is missing or empty',
    subs: '{field}',
  },
  {
    type: 'field_regex',
    config: 'field, pattern, case_sensitive?',
    fires: 'the field matches the regex',
    subs: '{match} {field} {value}',
  },
  {
    type: 'field_changed',
    config: 'field, to?, from?',
    fires: 'the value differs from the previous story version — optionally only for a given transition',
    subs: '{field} {item} {from} {to}',
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: 'Is SOM tied to Kafka?',
    a: 'No. SOM is transport-agnostic — it defines envelopes, payloads and topic <em>names</em>, not a broker. The reference starter uses Kafka, so “topic” means a Kafka topic there, but nothing in the message contracts depends on it.',
  },
  {
    q: 'Do I have to run the reference implementation?',
    a: 'No. Anything that speaks the bus and JSON can join. The reference starter is a .NET process that bundles an executor, a dashboard and a simulator — useful for learning the loop and testing against, but the contract is the schema, not the code.',
  },
  {
    q: 'Are skills AI?',
    a: 'They don’t have to be — in the reference executor most are pure rule evaluation over a JSON snapshot, with no model involved. What makes something a skill is the shape: a declared <b>advert</b>, deterministic recall, and outputs that go through the approval gate. AI-backed skills plug in identically, and an LLM review pass is offered as one of the three skill-validation layers.',
  },
  {
    q: 'What stops a bad automation reaching air?',
    a: 'The staging topic. An executor <em>cannot</em> publish to the production bus — it writes to <code>som.skills.staging</code> and a human approves or rejects. Approval republishes the payload in a fresh attributed envelope with the reviewer stamped into <code>extensions</code>, and both outcomes are recorded on <code>som.system.audit</code>.',
  },
  {
    q: 'How do I add a field the spec doesn’t have?',
    a: 'Put it under <code>payload.extensions["com.{yourvendor}.{field}"]</code>. Consumers that don’t recognise it must ignore it silently. This is the designed escape hatch — the reference implementation uses it itself for <code>com.ibc-poc.capture_complete</code>. Anything that later graduates into the spec drops its vendor prefix on promotion.',
  },
  {
    q: 'Why full snapshots instead of deltas?',
    a: 'Because consumers join late, restart, and miss messages. A full republish on every change means a consumer needs no history to be correct — keep the latest version per <code>story_id</code> and you are in sync. It also makes change detection cheap: skills compare the new snapshot with the previous one they saw.',
  },
  {
    q: 'How does a media arrival find its story?',
    a: 'It doesn’t carry one. <code>delivery.media_available</code> deliberately has no <code>story_id</code> — you resolve <code>asset_id → Asset → Story</code> from <code>story.context</code>. A cold consumer replays the story topic, or holds the arrival briefly, or after a bounded wait treats it as unmatched and records the non-action.',
  },
  {
    q: 'What is a “Telling”?',
    a: 'An on-air exposure event. On-air state is <em>derived</em> from Tellings and never stored on the asset itself — the same asset can be on air in one place and not another. Together with Links (asset-to-destination commitments with a per-destination compliance gate), it forms the distribution layer.',
  },
  {
    q: 'Is this production-ready?',
    a: 'Parts of it. The core skill loop and the delivery + audit halves of the distribution layer run live in the reference implementation. <code>som.link.*</code> and <code>som.telling.*</code> have ratified schemas but are a later build. The contract is stable regardless of implementation status — integrate against the schema.',
  },
];
