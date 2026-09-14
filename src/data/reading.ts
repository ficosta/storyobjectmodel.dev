import { OFFICIAL_URL, SPEC_REPO_URL, repoFile } from './consortium';

export interface Reading {
  title: string;
  source: string;
  date: string;
  url: string;
  /** What this one adds that the others don't — the reason to click it. */
  why: string;
}

/**
 * Primary sources, official first. Where anything below disagrees with the
 * published schemas, the schemas are right.
 */
export const READING: Reading[] = [
  {
    title: 'storyobjectmodel.com',
    source: 'The official home of SOM',
    date: 'September 2026',
    url: OFFICIAL_URL,
    why: 'The standard’s own framing, the two IBC demonstrations, principles, FAQ, how to join, the live emulator, and the schemas served at their permanent URLs.',
  },
  {
    title: 'storyobjectmodel/som',
    source: 'GitHub — the specification repository',
    date: 'SOM 1.0 · 12 September 2026',
    url: SPEC_REPO_URL,
    why: 'The seven normative schemas, 18 worked examples and 20 must-reject cases, the validators, the skill library, and the conformance, compatibility and migration documents.',
  },
  {
    title: 'Introduction and principles',
    source: 'Jon Roberts, for the authors',
    date: 'September 2026',
    url: repoFile('spec/introduction.md'),
    why: 'Why the story never had a model when media and control did, the three nouns, and the six principles every future change has to pass.',
  },
  {
    title: 'Transforming newsrooms with agentic workflows',
    source: 'TVBEurope — Milan Varga, Octopus Newsroom',
    date: 'September 2026',
    url: 'https://www.tvbeurope.com/ibc/transforming-newsrooms-with-agentic-workflows',
    why: 'A participant’s account of the project and the provenance argument for why a broadcaster should care.',
  },
  {
    title: 'The next newsroom coordination problem',
    source: 'AP Workflow Solutions — Brian Hopman',
    date: '2026',
    url: 'https://workflow.ap.org/news/newsroom-coordination-problem/',
    why: 'Why MOS is not the thing being replaced, and where the line between SOM and Skills is hard to draw.',
  },
  {
    title: 'Solving the story context gap',
    source: 'TVBEurope — Ash Ellis, Moments Lab',
    date: 'September 2026',
    url: 'https://www.tvbeurope.com/ibc/solving-the-story-context-gap',
    why: 'What it means for a vendor to publish onto the bus rather than hand content between interfaces.',
  },
  {
    title: 'Writing an open standard for story context',
    source: 'Octopus Newsroom — interview with Milan Varga',
    date: '2026',
    url: 'https://www.octopus-news.com/writing-an-open-standard-for-story-context-an-interview-with-milan-varga/',
    why: 'The origin story: the meaning of a story was never written down in a form that could move.',
  },
  {
    title: 'The Smart Stories Project at IBC Accelerator',
    source: 'Trint — Tessa Kaday',
    date: 'August 2026',
    url: 'https://trint.com/blog/smart-stories-project-at-ibc-accelerator-2026',
    why: 'The short version, written before the IBC demonstrations.',
  },
  {
    title: 'Incubator 2026: SMART STORIES — the agentic production ecosystem',
    source: 'IBC Accelerator',
    date: '2026',
    url: 'https://show.ibc.org/accelerator-project-incubator-2026-smart-stories-agentic-production-ecosystem',
    why: 'The Accelerator project page, as the programme records it.',
  },
];

export interface Principle {
  title: string;
  body: string;
}

/** The six working principles from spec/introduction.md, summarised. */
export const PRINCIPLES: Principle[] = [
  {
    title: 'Single-story scope',
    body: 'The standard coordinates within one story. Relationships to other stories travel as references, and the scope stops there.',
  },
  {
    title: 'Messages, not organisations',
    body: 'SOM describes what travels on the bus. It has no opinion about your desks, roles or tools — two very different workflows can speak the same story.',
  },
  {
    title: 'Publisher-asserted state',
    body: 'A story context says what its owner is willing to put their name to. Nothing in it is a guess inferred across sources.',
  },
  {
    title: 'Coordination, not consumption',
    body: 'A field belongs if another system needs it to act correctly. SOM does not carry the content, and it is not a delivery format.',
  },
  {
    title: 'Default no, justify yes',
    body: 'A field earns its place by blocking a real integration without it. 1.0 withdrew three proposed fields for exactly that reason.',
  },
  {
    title: 'Vocabulary growth governed',
    body: 'Structure can be permissive; the words that carry meaning cannot. Extension has a defined shape, so vendor and newsroom terms share a message on equal footing.',
  },
];

/** How the model behaves, from storyobjectmodel.com/principles.html, summarised. */
export const BEHAVIOURS: Principle[] = [
  {
    title: 'Nothing sits in charge',
    body: 'No orchestrator, no central application. Each tool reads the story and decides for itself.',
  },
  {
    title: 'Skills declare, executors act',
    body: 'A skill states what is true against a rule its newsroom wrote. Only the tool that owns the executor acts — and silence is a valid outcome.',
  },
  {
    title: 'One writer mints',
    body: 'The publisher’s story management system owns the story and its sequence. Never the wire.',
  },
  {
    title: 'Full republish, never a delta',
    body: 'A tool switched on halfway through the night reads one object and knows everything.',
  },
  {
    title: 'Binding at the editorial act',
    body: 'Media becomes part of a story when a person decides it is — never simply because it landed.',
  },
  {
    title: 'A transform never lifts a hold',
    body: 'Cutting, cropping or re-versioning an asset cannot launder its compliance position.',
  },
  {
    title: 'Reading leaves no trace',
    body: 'A tool proves it read something by publishing in its turn — which is why the audit trail falls out of how writes work.',
  },
];
