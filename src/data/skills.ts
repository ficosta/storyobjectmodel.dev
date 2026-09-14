/**
 * The SOM skill library, som-skill-library 0.2.2, as published under skills/
 * in github.com/storyobjectmodel/som. Every skill is lifecycle: draft,
 * origin: reference. The library versions separately from the standard.
 */

export const LIBRARY_VERSION = '0.2.2';

export type SkillCategory = 'compliance' | 'editorial' | 'workflow';
export type Severity = 'hold' | 'flag' | 'inform';

export interface LibrarySkill {
  name: string;
  category: SkillCategory;
  severities: Severity[];
  /** One line, in plain words, of what the skill declares. */
  declares: string;
  targets: string[];
  proposed?: boolean;
}

/** Category decides the X axis of precedence: compliance 1, editorial 2, workflow 3. */
export const CATEGORY_X: Record<SkillCategory, number> = { compliance: 1, editorial: 2, workflow: 3 };

export const LIBRARY: LibrarySkill[] = [
  {
    name: 'raise-flag-on-match',
    category: 'compliance',
    severities: ['flag', 'inform'],
    declares: 'A named flag on a story when a configured field matches a configured value — at mint, even before any media exists.',
    targets: ['planning', 'rundown', 'mam', 'graphics', 'discovery'],
  },
  {
    name: 'hold-while-flagged',
    category: 'compliance',
    severities: ['hold'],
    declares: 'A named action withheld while a flag of a configured type stands, released only by a clearance of equal or higher authority on the same scope.',
    targets: ['mam', 'playout', 'rundown', 'cms', 'compliance_hub'],
  },
  {
    name: 'gate-by-scope',
    category: 'compliance',
    severities: ['hold', 'inform'],
    declares: 'Whether one destination path’s gate permits one telling right now. Always link-scoped.',
    targets: ['cms', 'playout', 'rundown', 'mam', 'distribution'],
  },
  {
    name: 'record-provenance-on-ingest',
    category: 'compliance',
    severities: ['inform'],
    declares: 'That a source’s provenance is recorded as it enters a story — including an absent C2PA chain, recorded as absent.',
    targets: ['mam', 'ingest', 'verification', 'discovery', 'archive'],
  },
  {
    name: 'flag-on-mismatch',
    category: 'editorial',
    severities: ['flag', 'inform'],
    declares: 'A mismatch when a bound asset or rundown item carries a value the story no longer holds — naming both values.',
    targets: ['rundown', 'graphics', 'cms', 'playout'],
  },
  {
    name: 'apply-clearance',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Which member of a prepared version set a clearance makes current, and which members it supersedes.',
    targets: ['playout', 'rundown', 'mam', 'cms', 'graphics'],
  },
  {
    name: 'enrich-on-condition',
    category: 'workflow',
    severities: ['inform'],
    declares: 'That a named enrichment is warranted for an asset while a configured condition holds. It never runs the enrichment.',
    targets: ['mam', 'verification', 'multimodal', 'transcription', 'ingest'],
  },
  {
    name: 'match-and-propose',
    category: 'workflow',
    severities: ['inform'],
    declares: 'A candidate story for a loose clip, at or above a house-set confidence. Confirmation is a human act recorded elsewhere.',
    targets: ['multimodal', 'mam', 'discovery', 'ingest', 'rundown'],
  },
  {
    name: 'select-provider-by-context',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Which provider the house’s policy resolves for a capability, given the story context. It never assigns or invokes.',
    targets: ['transcription', 'verification'],
  },
  {
    name: 'surface-on-context-match',
    category: 'workflow',
    severities: ['inform'],
    declares: 'An item from a monitored source that matches the running story, with its provenance. Additive, off the critical path.',
    targets: ['transcription', 'verification', 'discovery', 'markets_data', 'mam', 'planning'],
  },
  {
    name: 'declare-context-on-commit',
    category: 'workflow',
    severities: ['inform'],
    declares: 'The story context that applies on a link when an asset is committed to a destination.',
    targets: ['playout', 'mam', 'graphics'],
    proposed: true,
  },
];

/** The frontmatter values every library skill guarantees. */
export const GUARANTEES: { field: string; value: string; meaning: string }[] = [
  {
    field: 'auto_change_content',
    value: 'false',
    meaning: 'The only permitted value. What is withheld is an action, never the content — an executor that edits to release has broken the model.',
  },
  {
    field: 'fail_closed',
    value: 'true',
    meaning: 'An unreadable value is treated as the condition holding, at the loudest severity the skill has. Silence on an unreadable restriction is never allowed.',
  },
  {
    field: 'output_messages',
    value: '["skill.warning.raised"]',
    meaning: 'A skill has one way to say anything. It never writes story state.',
  },
  {
    field: 'depends',
    value: '[]',
    meaning: 'Chaining happens over the bus, not through declared dependencies. A hold advertises against flag state, whoever raised the flag.',
  },
];
