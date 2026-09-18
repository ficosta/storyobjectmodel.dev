import type { Principle, Reading } from '../../../data/reading';
import { OFFICIAL_URL, SPEC_REPO_URL, repoFile } from '../../../data/consortium';

export type { Principle, Reading } from '../../../data/reading';

/**
 * Primärquellen, die offiziellen zuerst. Wo etwas hier von den veröffentlichten
 * Schemas abweicht, haben die Schemas recht.
 */
export const READING: Reading[] = [
  {
    title: 'storyobjectmodel.com',
    source: 'Die offizielle Heimat von SOM',
    date: 'September 2026',
    url: OFFICIAL_URL,
    why: 'Die Sicht des Standards auf sich selbst, die beiden IBC-Demonstrationen, Prinzipien, FAQ, wie man mitmacht, der Live-Emulator und die Schemas unter ihren dauerhaften URLs.',
  },
  {
    title: 'storyobjectmodel/som',
    source: 'GitHub – das Spezifikations-Repository',
    date: 'SOM 1.0 · 12. September 2026',
    url: SPEC_REPO_URL,
    why: 'Die sieben normativen Schemas, 18 ausgearbeitete Beispiele und 20 Fälle, die abgelehnt werden müssen, die Validatoren, die Skill-Bibliothek sowie die Dokumente zu Konformität, Kompatibilität und Migration.',
  },
  {
    title: 'Introduction and principles',
    source: 'Jon Roberts, für die Autoren',
    date: 'September 2026',
    url: repoFile('spec/introduction.md'),
    why: 'Warum die Story nie ein Modell hatte, Medien und Steuerung aber schon, die drei Substantive und die sechs Prinzipien, die jede künftige Änderung bestehen muss.',
  },
  {
    title: 'Transforming newsrooms with agentic workflows',
    source: 'TVBEurope – Milan Varga, Octopus Newsroom',
    date: 'September 2026',
    url: 'https://www.tvbeurope.com/ibc/transforming-newsrooms-with-agentic-workflows',
    why: 'Der Bericht eines Beteiligten über das Projekt und das Provenienz-Argument, warum sich ein Sender dafür interessieren sollte.',
  },
  {
    title: 'The next newsroom coordination problem',
    source: 'AP Workflow Solutions – Brian Hopman',
    date: '2026',
    url: 'https://workflow.ap.org/news/newsroom-coordination-problem/',
    why: 'Warum MOS nicht das ist, was ersetzt wird, und wo sich die Grenze zwischen SOM und Skills schwer ziehen lässt.',
  },
  {
    title: 'Solving the story context gap',
    source: 'TVBEurope – Ash Ellis, Moments Lab',
    date: 'September 2026',
    url: 'https://www.tvbeurope.com/ibc/solving-the-story-context-gap',
    why: 'Was es für einen Hersteller bedeutet, auf den Bus zu veröffentlichen, statt Inhalte zwischen Schnittstellen weiterzureichen.',
  },
  {
    title: 'Writing an open standard for story context',
    source: 'Octopus Newsroom – Interview mit Milan Varga',
    date: '2026',
    url: 'https://www.octopus-news.com/writing-an-open-standard-for-story-context-an-interview-with-milan-varga/',
    why: 'Die Entstehungsgeschichte: Die Bedeutung einer Story wurde nie in einer Form aufgeschrieben, die sich weitergeben ließ.',
  },
  {
    title: 'The Smart Stories Project at IBC Accelerator',
    source: 'Trint – Tessa Kaday',
    date: 'August 2026',
    url: 'https://trint.com/blog/smart-stories-project-at-ibc-accelerator-2026',
    why: 'Die Kurzfassung, geschrieben vor den IBC-Demonstrationen.',
  },
  {
    title: 'Incubator 2026: SMART STORIES — the agentic production ecosystem',
    source: 'IBC Accelerator',
    date: '2026',
    url: 'https://show.ibc.org/accelerator-project-incubator-2026-smart-stories-agentic-production-ecosystem',
    why: 'Die Projektseite des Accelerators, so wie das Programm sie festhält.',
  },
];

/** Die sechs Arbeitsprinzipien aus spec/introduction.md, zusammengefasst. */
export const PRINCIPLES: Principle[] = [
  {
    title: 'Eine Story als Rahmen',
    body: 'Der Standard koordiniert innerhalb einer Story. Beziehungen zu anderen Storys laufen als Referenzen, und dort endet der Rahmen.',
  },
  {
    title: 'Nachrichten, nicht Organisationen',
    body: 'SOM beschreibt, was über den Bus läuft. Zu Ihren Desks, Rollen oder Tools hat es keine Meinung – zwei sehr verschiedene Workflows können dieselbe Story sprechen.',
  },
  {
    title: 'Vom Publisher verbürgter Zustand',
    body: 'Ein Story-Kontext sagt, wofür sein Eigentümer mit seinem Namen einsteht. Nichts darin ist eine aus mehreren Quellen erschlossene Vermutung.',
  },
  {
    title: 'Koordination, nicht Konsum',
    body: 'Ein Feld gehört hinein, wenn ein anderes System es braucht, um richtig zu handeln. SOM transportiert nicht die Inhalte und ist kein Auslieferungsformat.',
  },
  {
    title: 'Standardmäßig nein, ja nur mit Begründung',
    body: 'Ein Feld verdient seinen Platz, wenn ohne es eine echte Integration scheitert. 1.0 hat aus genau diesem Grund drei vorgeschlagene Felder zurückgezogen.',
  },
  {
    title: 'Geregeltes Vokabularwachstum',
    body: 'Die Struktur darf großzügig sein, die bedeutungstragenden Wörter nicht. Erweiterungen haben eine festgelegte Form, sodass Begriffe von Herstellern und Redaktionen gleichberechtigt in einer Nachricht stehen.',
  },
];

/** Wie sich das Modell verhält, nach storyobjectmodel.com/principles.html, zusammengefasst. */
export const BEHAVIOURS: Principle[] = [
  {
    title: 'Niemand hat das Sagen',
    body: 'Kein Orchestrator, keine zentrale Anwendung. Jedes Tool liest die Story und entscheidet selbst.',
  },
  {
    title: 'Skills deklarieren, Executors handeln',
    body: 'Ein Skill stellt fest, was gemessen an einer Regel seiner Redaktion wahr ist. Nur das Tool, dem der Executor gehört, handelt – und Schweigen ist ein gültiges Ergebnis.',
  },
  {
    title: 'Ein Schreiber legt an',
    body: 'Das Story-Management-System des Publishers besitzt die Story und ihre Sequenz. Niemals die Agentur.',
  },
  {
    title: 'Immer vollständig, nie ein Delta',
    body: 'Ein Tool, das mitten in der Nacht eingeschaltet wird, liest ein Objekt und weiß alles.',
  },
  {
    title: 'Bindung beim redaktionellen Akt',
    body: 'Medien werden Teil einer Story, wenn ein Mensch das entscheidet – nie einfach deshalb, weil sie eingetroffen sind.',
  },
  {
    title: 'Eine Transformation hebt keinen Hold auf',
    body: 'Schneiden, Zuschneiden oder Neuversionieren eines Assets kann seinen Compliance-Status nicht reinwaschen.',
  },
  {
    title: 'Lesen hinterlässt keine Spur',
    body: 'Ein Tool beweist, dass es etwas gelesen hat, indem es seinerseits veröffentlicht – deshalb ergibt sich der Audit-Trail von selbst aus der Art, wie Schreibvorgänge funktionieren.',
  },
];
