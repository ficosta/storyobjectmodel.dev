import type { Demo } from '../../../data/consortium';

export {
  OFFICIAL_URL,
  SPEC_REPO_URL,
  SCHEMA_BASE_URL,
  EMULATOR_URL,
  DEMOS_URL,
  INVOLVED_FORM_URL,
  CONTACT_EMAIL,
  AGENTSKILLS_URL,
  repoFile,
  repoDir,
  CHAMPION_MARKS,
  AUTHORS,
  CHAMPIONS,
  PARTICIPANTS,
  IBC_PROJECT_URL,
} from '../../../data/consortium';
export type { Demo } from '../../../data/consortium';

/** Die zwei IBC-2026-Szenarien, wie storyobjectmodel.com sie beschreibt. */
export const DEMOS: Demo[] = [
  {
    title: 'Der Hurrikan',
    anchor: 'demo-1',
    summary:
      'Agenturmeldungen und ein Wetterdaten-Feed auf dem Bus, dazu Transkription und Media Intelligence, die die Story lesen. Zwei Clips treffen ein – einer mit Echtheitsnachweis, einer ohne –, und das Gate behandelt sie unterschiedlich, nachvollziehbar dokumentiert. Der Sturm wird an der Quelle neu eingestuft, eine Journalistin bestätigt es, und jedes Tool, das von der alten Kategorie abhing, sieht die Änderung gleichzeitig. Eine unbestätigte Behauptung aus nur einer Quelle bleibt zurückgehalten, während der Rest der Seite live geht.',
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
    title: 'Die Ankündigung des Premierministers',
    anchor: 'demo-2',
    summary:
      'Eine Ankündigung, deren Ausgang erst feststeht, wenn sie gemacht wird. Die Story geht mit einer erwarteten Prämisse und zwei vorbereiteten Skript-Sätzen auf den Bus. Tools, die sie lesen, halten Social-Media-Entwürfe zurück, schlagen eine Live-Einheit vor, transkribieren den Feed und schlagen die Aussage vor, sobald sie gesprochen ist – und nichts ändert sich, bis eine Journalistin freigibt. Diese eine Freigabe schneidet den Clip, übernimmt die passenden Skripte, unterdrückt die anderen mit dokumentierter Begründung und gibt die zurückgehaltenen Posts frei.',
    vendors: ['Reuters', 'Octopus', 'LiveU', 'Fonn Group (Mimir)', 'Trint', 'HyperContent AI', 'Amazon Web Services'],
  },
];
