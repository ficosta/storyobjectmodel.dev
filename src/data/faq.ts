export interface Faq {
  q: string;
  a: string;
}

/**
 * The questions people ask on first meeting the model. The answers follow the
 * standard's own FAQ at storyobjectmodel.com/faq.html and the conformance
 * statement in the specification repository.
 */
export const FAQS: Faq[] = [
  {
    q: 'Does anything act on its own?',
    a: 'No. A skill <em>declares</em> what is true about a story; the tool that owns the executor decides what to do about it; a person approves anything that reaches an audience. A clearance is granted to a specific version of the words, so a rewrite reopens the gate rather than inheriting the approval. If a rule cannot be evaluated, the output it guards stays held and a person decides.',
  },
  {
    q: 'Is this about replacing journalists?',
    a: 'It is about capturing their judgement. The decisions that shape a story already exist — in a chat thread, a rebrief, somebody’s head — and they are gone by the next shift. Writing them into the story puts each call on the record, attributed to whoever made it. The person moves from carrying state between systems to making the call.',
  },
  {
    q: 'What stops two systems writing conflicting versions of the same story?',
    a: 'One writer. The publisher’s story management system mints the story and owns its <code>sequence_number</code> — never the wire, not even on a flash. Everything else contributes through its own message family. Where skills disagree, gates combine by <b>conjunction</b> (any one hold means held), compliance fails closed, and a transform never lifts a hold.',
  },
  {
    q: 'Who runs the bus, and what happens when it breaks?',
    a: 'Each newsroom runs its own, like any other message infrastructure in the building. When it is down, tools keep working standalone as they do today and reconcile on reconnect — nothing depends on the bus to stay on air. Because the story republishes in full, a tool that comes back reads one object and is current.',
  },
  {
    q: 'Is SOM tied to Kafka, or to any broker?',
    a: 'No. SOM defines an envelope and seven payload families carried on an ordinary publish/subscribe bus. The only topic rule is that a topic begins with <code>som.</code> — and a consumer never infers the payload type from the topic anyway; <code>message_type</code> is the only discriminator.',
  },
  {
    q: 'Why not point a model at the systems we already have?',
    a: 'A retrieval query answers a single question for a single tool, and nobody else sees the answer. A production needs the opposite: one state every tool reads identically, gates that still hold when work crosses from one vendor to another, and an attributed record of each decision. The standard’s position is that models are consumers of SOM, not a substitute for it.',
  },
  {
    q: 'Does media travel on the bus?',
    a: 'Never. Assets are references. At the TAMS junction a story points at a Source URI and a time range; a MAM or any other store is addressed the same way through a <code>locator</code>. Binding media to a story happens at the editorial act, never at ingest.',
  },
  {
    q: 'What happens to the systems we already run?',
    a: 'They stay. SOM is not a MAM, a rundown or a product and replaces nothing. MOS keeps working, with a bridge that makes it smarter, and what you have built with agents stays yours. One system is enough to start.',
  },
  {
    q: 'How do I add a field the spec doesn’t have?',
    a: 'Put it under <code>extensions["com.{vendor}.{field}"]</code>. Consumers MUST ignore extension keys they don’t recognise and MUST NOT reject the message for them. Vendor enum values use the <code>x-</code> prefix instead — <code>x-graphics_pack</code>.',
  },
  {
    q: 'Why full snapshots instead of deltas?',
    a: 'Because consumers join late, restart and miss messages. A <code>story.context</code> message is the complete state of the story, so omission means <em>absent</em>, not <em>unchanged</em>. A writer that sends only its own fields silently erases everyone else’s work — the conformance statement calls this the single most damaging error an implementation can make.',
  },
  {
    q: 'How does the standard change, and who decides?',
    a: 'In the open. Every change arrives as a pull request to <code>storyobjectmodel/som</code> and anyone may open one. Within 1.x only additive changes ship; removing or renaming anything waits for 2.0, and a deprecated field keeps working until then. What is not yet settled is listed in the open register.',
  },
  {
    q: 'Who owns it?',
    a: 'Nobody. The standard is open and unowned. Schemas, examples, tools and skills are Apache 2.0; the specification prose is CC BY 4.0. There is no fee and nothing to sign.',
  },
  {
    q: 'What is Story Archaeology?',
    a: 'The method the model came from. Take one real story after transmission and trace how its context actually moved, hop by hop, between people and systems — where knowledge was created, where it was lost, and who carried it by hand. Story, Asset and Telling were transcribed from those sessions rather than invented.',
  },
];
