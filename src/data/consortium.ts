/**
 * Who made SOM 1.0, as the standard records it.
 *
 * Sources: storyobjectmodel.com (credits) and CONTRIBUTORS.md in
 * github.com/storyobjectmodel/som. Where the IBC project page and those two
 * disagree, the standard's own record wins.
 */

/** The official home of the standard. This site is a guide to it, not it. */
export const OFFICIAL_URL = 'https://storyobjectmodel.com';
export const SPEC_REPO_URL = 'https://github.com/storyobjectmodel/som';
export const SCHEMA_BASE_URL = 'https://storyobjectmodel.com/schema/1.0';
export const EMULATOR_URL = 'https://storyobjectmodel.com/emulator/';
export const DEMOS_URL = 'https://storyobjectmodel.com/demos.html';
export const INVOLVED_FORM_URL = 'https://tally.so/r/aQRBDX';
export const CONTACT_EMAIL = 'hello@storyobjectmodel.com';
export const AGENTSKILLS_URL = 'https://agentskills.io';

export const repoFile = (path: string): string => `${SPEC_REPO_URL}/blob/main/${path}`;
export const repoDir = (path: string): string => `${SPEC_REPO_URL}/tree/main/${path}`;

/** A few of the champion organisations, shown as marks in the credit row. */
export const CHAMPION_MARKS: { name: string; logo: string; height: number }[] = [
  { name: 'Associated Press', logo: '/logos/ap.svg', height: 42 },
  { name: 'NBCUniversal', logo: '/logos/nbcu.svg', height: 22 },
  { name: 'ITN', logo: '/logos/itn.svg', height: 40 },
  { name: 'BBC', logo: '/logos/bbc.svg', height: 26 },
];

export const AUTHORS: string[] = ['Jon Roberts', 'Morag McIntosh', 'Alex Bassett', 'John Boucklos'];

/** Fourteen champions, in the order CONTRIBUTORS.md lists them. */
export const CHAMPIONS: string[] = [
  'ITN',
  'NBCUniversal',
  'Associated Press',
  'Channel 4',
  'Al Jazeera',
  'The Washington Post',
  'ITV',
  'BBC',
  'Sky',
  'EBU',
  'SMPTE',
  'Reuters',
  'Scripps',
  'GC-SC (Global Creative & Security Community)',
];

/** Seventeen participants who integrated against the model and took part in the IBC demonstrations. */
export const PARTICIPANTS: string[] = [
  'Shure',
  'EVS',
  'Cuez',
  'Moments Lab',
  'Perspective Media Group',
  'Google Cloud',
  'Trint',
  'Cognizant',
  'Amazon Web Services',
  'Electric Sheep',
  'Nuvelics',
  'Octopus',
  'Fonn Group',
  'The Weather Company',
  'HyperContent AI',
  'LiveU',
  'Vizrt',
];

export const IBC_PROJECT_URL =
  'https://show.ibc.org/accelerator-project-incubator-2026-smart-stories-agentic-production-ecosystem';

export interface Demo {
  title: string;
  anchor: string;
  summary: string;
  vendors: string[];
}

/** The two IBC 2026 scenarios, as storyobjectmodel.com describes them. */
export const DEMOS: Demo[] = [
  {
    title: 'The hurricane',
    anchor: 'demo-1',
    summary:
      'Wire copy and a weather data feed on the bus, with transcription and media intelligence reading the story. Two clips arrive — one with authenticity credentials, one without — and the gate treats them differently, on the record. The storm is reclassified at source, a journalist confirms it, and every tool that depended on the old category sees the change together. An unconfirmed single-source claim stays held while the rest of the page goes live.',
    vendors: [
      'AP',
      'The Weather Company',
      'Trint',
      'Moments Lab',
      'Cuez',
      'Vizrt',
      'HyperContent AI',
      'Shure',
      'Amazon Web Services',
    ],
  },
  {
    title: 'The Prime Minister announcement',
    anchor: 'demo-2',
    summary:
      'An announcement whose outcome is unknown until it is made. The story goes on the bus with an expected premise and two prepared script sets. Tools reading it hold draft social posts, suggest a live unit, transcribe the feed and propose the claim as it is spoken — and nothing changes until a journalist approves. That one approval cuts the clip, commits the matching scripts, suppresses the others with a recorded reason, and releases the held posts.',
    vendors: ['Reuters', 'Octopus', 'LiveU', 'Fonn Group (Mimir)', 'Trint', 'HyperContent AI', 'Amazon Web Services'],
  },
];
