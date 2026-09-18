import type { Faq } from '../../../data/faq';

export type { Faq } from '../../../data/faq';

/**
 * Die Fragen, die beim ersten Kontakt mit dem Modell kommen. Die Antworten folgen
 * der FAQ des Standards auf storyobjectmodel.com/faq.html und der Konformitätserklärung
 * im Spezifikations-Repository.
 */
export const FAQS: Faq[] = [
  {
    q: 'Handelt irgendetwas von selbst?',
    a: 'Nein. Ein Skill <em>deklariert</em>, was über eine Story wahr ist; das Tool, dem der Executor gehört, entscheidet, was daraus folgt; ein Mensch gibt alles frei, was ein Publikum erreicht. Eine Freigabe gilt für eine bestimmte Fassung des Textes – eine Überarbeitung öffnet das Gate also wieder, statt die Freigabe zu erben. Lässt sich eine Regel nicht auswerten, bleibt die Ausgabe, die sie schützt, zurückgehalten, und ein Mensch entscheidet.',
  },
  {
    q: 'Geht es darum, Journalisten zu ersetzen?',
    a: 'Es geht darum, ihr Urteil festzuhalten. Die Entscheidungen, die eine Story prägen, gibt es längst – in einem Chat-Verlauf, einem Rebriefing, im Kopf von jemandem – und mit der nächsten Schicht sind sie verschwunden. Werden sie in die Story geschrieben, ist jede Entscheidung dokumentiert und der Person zugeordnet, die sie getroffen hat. Der Mensch trägt keinen Zustand mehr zwischen Systemen hin und her, sondern trifft die Entscheidung.',
  },
  {
    q: 'Was hindert zwei Systeme daran, widersprüchliche Fassungen derselben Story zu schreiben?',
    a: 'Ein einziger Schreiber. Das Story-Management-System des Publishers legt die Story an und besitzt ihre <code>sequence_number</code> – niemals die Agentur, nicht einmal bei einem Flash. Alle anderen tragen über ihre eigene Nachrichtenfamilie bei. Wo Skills sich widersprechen, verbinden sich Gates per <b>Konjunktion</b> (ein einziger Hold heißt: zurückgehalten), Compliance ist fail-closed, und eine Transformation hebt niemals einen Hold auf.',
  },
  {
    q: 'Wer betreibt den Bus, und was passiert, wenn er ausfällt?',
    a: 'Jede Redaktion betreibt ihren eigenen, wie jede andere Messaging-Infrastruktur im Haus. Fällt er aus, arbeiten die Tools eigenständig weiter wie heute und gleichen sich nach dem Wiederverbinden ab – nichts hängt am Bus, um auf Sendung zu bleiben. Weil die Story immer vollständig neu veröffentlicht wird, liest ein zurückkehrendes Tool ein einziges Objekt und ist auf dem aktuellen Stand.',
  },
  {
    q: 'Ist SOM an Kafka oder an einen bestimmten Broker gebunden?',
    a: 'Nein. SOM definiert ein Envelope und sieben Payload-Familien, die über einen gewöhnlichen Publish/Subscribe-Bus laufen. Die einzige Topic-Regel: Ein Topic beginnt mit <code>som.</code> – und ein Consumer leitet den Payload-Typ ohnehin nie aus dem Topic ab; <code>message_type</code> ist das einzige Unterscheidungsmerkmal.',
  },
  {
    q: 'Warum nicht einfach ein Modell auf die vorhandenen Systeme ansetzen?',
    a: 'Eine Retrieval-Abfrage beantwortet eine einzelne Frage für ein einzelnes Tool, und niemand sonst sieht die Antwort. Eine Produktion braucht das Gegenteil: einen Zustand, den jedes Tool identisch liest, Gates, die auch dann noch halten, wenn die Arbeit von einem Hersteller zum nächsten wechselt, und eine zugeordnete Aufzeichnung jeder Entscheidung. Die Position des Standards: Modelle sind Consumer von SOM, kein Ersatz dafür.',
  },
  {
    q: 'Laufen Medien über den Bus?',
    a: 'Niemals. Assets sind Referenzen. An der TAMS-Schnittstelle verweist eine Story auf eine Source-URI und einen Zeitbereich; ein MAM oder jeder andere Speicher wird auf dieselbe Weise über einen <code>locator</code> adressiert. Medien werden beim redaktionellen Akt an eine Story gebunden, niemals beim Ingest.',
  },
  {
    q: 'Was wird aus den Systemen, die wir schon betreiben?',
    a: 'Sie bleiben. SOM ist kein MAM, kein Rundown und kein Produkt und ersetzt nichts. MOS funktioniert weiter, mit einer Bridge, die es klüger macht, und was Sie mit Agents gebaut haben, bleibt Ihres. Ein einziges System genügt für den Anfang.',
  },
  {
    q: 'Wie füge ich ein Feld hinzu, das die Spezifikation nicht vorsieht?',
    a: 'Legen Sie es unter <code>extensions["com.{vendor}.{field}"]</code> ab. Consumer MÜSSEN Extension-Schlüssel ignorieren, die sie nicht kennen, und DÜRFEN die Nachricht deswegen NICHT zurückweisen. Herstellereigene Enum-Werte verwenden stattdessen das Präfix <code>x-</code> – <code>x-graphics_pack</code>.',
  },
  {
    q: 'Warum vollständige Snapshots statt Deltas?',
    a: 'Weil Consumer spät dazukommen, neu starten und Nachrichten verpassen. Eine <code>story.context</code>-Nachricht ist der vollständige Zustand der Story, Weglassen bedeutet also <em>nicht vorhanden</em>, nicht <em>unverändert</em>. Ein Schreiber, der nur seine eigenen Felder sendet, löscht stillschweigend die Arbeit aller anderen – die Konformitätserklärung nennt das den folgenschwersten Fehler, den eine Implementierung machen kann.',
  },
  {
    q: 'Wie ändert sich der Standard, und wer entscheidet?',
    a: 'Öffentlich. Jede Änderung kommt als Pull Request an <code>storyobjectmodel/som</code>, und jeder darf einen eröffnen. Innerhalb von 1.x werden nur additive Änderungen veröffentlicht; Entfernen oder Umbenennen wartet auf 2.0, und ein als veraltet markiertes Feld funktioniert bis dahin weiter. Was noch nicht geklärt ist, steht im Open Register.',
  },
  {
    q: 'Wem gehört er?',
    a: 'Niemandem. Der Standard ist offen und herrenlos. Schemas, Beispiele, Tools und Skills stehen unter Apache 2.0; der Spezifikationstext unter CC BY 4.0. Es gibt keine Gebühr und nichts zu unterschreiben.',
  },
  {
    q: 'Was ist Story Archaeology?',
    a: 'Die Methode, aus der das Modell hervorging. Man nimmt eine echte Story nach der Ausstrahlung und verfolgt, wie ihr Kontext tatsächlich wanderte, Station für Station, zwischen Menschen und Systemen – wo Wissen entstand, wo es verloren ging und wer es von Hand weitertrug. Story, Asset und Telling wurden aus diesen Sitzungen abgeschrieben, nicht erfunden.',
  },
];
