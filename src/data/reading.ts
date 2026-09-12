export interface Reading {
  title: string;
  source: string;
  date: string;
  url: string;
  /** What this one adds that the others don't — the reason to click it. */
  why: string;
}

/**
 * Primary sources on SOM and the SMART STORIES project. Ordered roughly by how
 * much ground each covers for someone arriving cold.
 */
export const READING: Reading[] = [
  {
    title: 'Transforming newsrooms with agentic workflows',
    source: 'TVBEurope — Milan Varga, Octopus Newsroom',
    date: 'September 2026',
    url: 'https://www.tvbeurope.com/ibc/transforming-newsrooms-with-agentic-workflows',
    why: 'The fullest public account of the project: the four ideas SOM rests on, the five deliverables, and the provenance argument for why a broadcaster should care.',
  },
  {
    title: 'The next newsroom coordination problem',
    source: 'AP Workflow Solutions — Brian Hopman',
    date: '2026',
    url: 'https://workflow.ap.org/news/newsroom-coordination-problem/',
    why: 'Why MOS is not the thing being replaced, what a Story Agent is for, and the honest version of the hard part: where the line between SOM and Skills belongs.',
  },
  {
    title: 'Solving the story context gap',
    source: 'TVBEurope — Ash Ellis, Moments Lab',
    date: 'September 2026',
    url: 'https://www.tvbeurope.com/ibc/solving-the-story-context-gap',
    why: 'A participant’s view of building against the standard, and what it means to publish content onto the SOM bus rather than hand it between interfaces.',
  },
  {
    title: 'Writing an open standard for story context',
    source: 'Octopus Newsroom — interview with Milan Varga',
    date: '2026',
    url: 'https://www.octopus-news.com/writing-an-open-standard-for-story-context-an-interview-with-milan-varga/',
    why: 'The origin story, and the sentence the whole project turns on: the meaning of the story was never written down in a form that could move.',
  },
  {
    title: 'The Smart Stories Project at IBC Accelerator',
    source: 'Trint — Tessa Kaday',
    date: 'August 2026',
    url: 'https://trint.com/blog/smart-stories-project-at-ibc-accelerator-2026',
    why: 'The short version, and the cleanest one-line framing of the ambition: do for the agentic era what MOS did for newsrooms in the 1990s.',
  },
  {
    title: 'Incubator 2026: SMART STORIES — the agentic production ecosystem',
    source: 'IBC Accelerator',
    date: '2026',
    url: 'https://show.ibc.org/accelerator-project-incubator-2026-smart-stories-agentic-production-ecosystem',
    why: 'The project page itself: the full champion and participant roster, and the deliverables as the programme records them.',
  },
];

/** The four ideas the standard rests on, as the project states them. */
export const FOUNDATIONS: { title: string; body: string }[] = [
  {
    title: 'A shared story structure',
    body: 'It carries editorial context and interprets none of it. The structure travels; the judgement does not.',
  },
  {
    title: 'A story agent',
    body: 'One per story, following it across every tool it touches, from tip-off through distribution, tracking what changed and recording it.',
  },
  {
    title: 'Decentralised intelligence',
    body: 'Processing stays inside each vendor’s own software. There is no central engine that has to understand everything.',
  },
  {
    title: 'A Skills reference architecture',
    body: 'A newsroom writes its editorial rules once, as portable configurations that agents in different systems can read.',
  },
];

/** What the development phase produces. */
export const DELIVERABLES: string[] = [
  'The specification',
  'The Skills reference architecture',
  'A reference implementation',
  'A three-tier integration guide',
  'A live multi-vendor demonstration at IBC2026',
];
