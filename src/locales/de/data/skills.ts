/**
 * German prose for the SOM skill library (som-skill-library). Identifiers,
 * categories, severities and targets are unchanged from the English module.
 */
import type { LibrarySkill } from '../../../data/skills';

export type { SkillCategory, Severity, LibrarySkill } from '../../../data/skills';
export { LIBRARY_VERSION, CATEGORY_X } from '../../../data/skills';

export const LIBRARY: LibrarySkill[] = [
  {
    name: 'raise-flag-on-match',
    category: 'compliance',
    severities: ['flag', 'inform'],
    declares: 'Ein benanntes Flag an einer Story, wenn ein konfiguriertes Feld auf einen konfigurierten Wert passt — schon beim Anlegen, bevor überhaupt Medien existieren.',
    targets: ['planning', 'rundown', 'mam', 'graphics', 'discovery'],
  },
  {
    name: 'hold-while-flagged',
    category: 'compliance',
    severities: ['hold'],
    declares: 'Eine benannte Aktion, die zurückgehalten wird, solange ein Flag eines konfigurierten Typs besteht — aufgehoben nur durch eine Freigabe gleicher oder höherer Autorität auf demselben Scope.',
    targets: ['mam', 'playout', 'rundown', 'cms', 'compliance_hub'],
  },
  {
    name: 'gate-by-scope',
    category: 'compliance',
    severities: ['hold', 'inform'],
    declares: 'Ob das Gate eines Zielpfads ein bestimmtes Telling gerade jetzt zulässt. Immer mit Scope auf dem Link.',
    targets: ['cms', 'playout', 'rundown', 'mam', 'distribution'],
  },
  {
    name: 'record-provenance-on-ingest',
    category: 'compliance',
    severities: ['inform'],
    declares: 'Dass die Herkunft einer Quelle erfasst wird, sobald sie in eine Story gelangt — auch eine fehlende C2PA-Kette, erfasst als fehlend.',
    targets: ['mam', 'ingest', 'verification', 'discovery', 'archive'],
  },
  {
    name: 'flag-on-mismatch',
    category: 'editorial',
    severities: ['flag', 'inform'],
    declares: 'Eine Abweichung, wenn ein gebundenes Asset oder Rundown-Element einen Wert trägt, den die Story nicht mehr hat — mit Nennung beider Werte.',
    targets: ['rundown', 'graphics', 'cms', 'playout'],
  },
  {
    name: 'apply-clearance',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Welche Version aus einem vorbereiteten Versionssatz eine Freigabe aktuell macht und welche sie ablöst.',
    targets: ['playout', 'rundown', 'mam', 'cms', 'graphics'],
  },
  {
    name: 'enrich-on-condition',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Dass eine benannte Anreicherung für ein Asset angebracht ist, solange eine konfigurierte Bedingung gilt. Die Anreicherung selbst führt er nie aus.',
    targets: ['mam', 'verification', 'multimodal', 'transcription', 'ingest'],
  },
  {
    name: 'match-and-propose',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Eine Kandidaten-Story für einen losen Clip, ab einer hausintern festgelegten Konfidenz. Die Bestätigung ist ein menschlicher Akt, der anderswo erfasst wird.',
    targets: ['multimodal', 'mam', 'discovery', 'ingest', 'rundown'],
  },
  {
    name: 'select-provider-by-context',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Welchen Anbieter die Richtlinie des Hauses für eine Fähigkeit ergibt, gegeben den Story-Kontext. Er weist nie zu und ruft nie auf.',
    targets: ['transcription', 'verification'],
  },
  {
    name: 'surface-on-context-match',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Ein Element aus einer beobachteten Quelle, das zur laufenden Story passt, samt Herkunft. Additiv, abseits des kritischen Pfads.',
    targets: ['transcription', 'verification', 'discovery', 'markets_data', 'mam', 'planning'],
  },
  {
    name: 'declare-context-on-commit',
    category: 'workflow',
    severities: ['inform'],
    declares: 'Den Story-Kontext, der auf einem Link gilt, wenn ein Asset einem Ziel zugesagt wird.',
    targets: ['playout', 'mam', 'graphics'],
    proposed: true,
  },
];

/** The frontmatter values every library skill guarantees. */
export const GUARANTEES: { field: string; value: string; meaning: string }[] = [
  {
    field: 'auto_change_content',
    value: 'false',
    meaning: 'Der einzige zulässige Wert. Zurückgehalten wird eine Aktion, niemals der Inhalt — ein Executor, der editiert, um freizugeben, hat das Modell gebrochen.',
  },
  {
    field: 'fail_closed',
    value: 'true',
    meaning: 'Ein unlesbarer Wert gilt so, als ob die Bedingung zutrifft — mit der lautesten Severity, die der Skill hat. Schweigen bei einer unlesbaren Einschränkung ist nie erlaubt.',
  },
  {
    field: 'output_messages',
    value: '["skill.warning.raised"]',
    meaning: 'Ein Skill hat genau einen Weg, etwas zu sagen. Er schreibt nie Story-Zustand.',
  },
  {
    field: 'depends',
    value: '[]',
    meaning: 'Verkettung geschieht über den Bus, nicht über deklarierte Abhängigkeiten. Ein Hold bezieht sich per advert auf den Flag-Zustand — gleich, wer das Flag gesetzt hat.',
  },
];
