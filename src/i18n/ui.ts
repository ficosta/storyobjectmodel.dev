import type { Locale } from './locales';

/** Strings the shared chrome needs — header, footer and the shared widgets.
 *  Page prose lives with each page, under src/locales/<lang>/. */
export interface UiStrings {
  nav: { concepts: string; envelope: string; messages: string; skills: string; spec: string; getStarted: string };
  toggleNav: string;
  themeToDark: string;
  themeToLight: string;
  language: string;
  footer: {
    tagline: string;
    learn: string;
    storyLifecycle: string;
    glossary: string;
    reference: string;
    messageFamilies: string;
    build: string;
    specification: string;
    schemas: string;
    emulator: string;
    /** Legal line, split around the link to storyobjectmodel.com. */
    legalBefore: string;
    legalAfter: string;
    /** Credit line, split around the author link. */
    craftBefore: string;
    craftAfter: string;
  };
  field: { required: string; optional: string };
  loop: {
    storyOwner: string;
    mediaStore: string;
    executorTool: string;
    rundown: string;
    playout: string;
    standardsDesk: string;
    bus: string;
    aria: string;
  };
}

export const UI: Record<Locale, UiStrings> = {
  en: {
    nav: {
      concepts: 'Concepts',
      envelope: 'Envelope',
      messages: 'Messages',
      skills: 'Skills',
      spec: 'Spec',
      getStarted: 'Get started',
    },
    toggleNav: 'Toggle navigation',
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
    language: 'Language',
    footer: {
      tagline: 'A visual guide to SOM 1.0, the open standard for story context in content production.',
      learn: 'Learn',
      storyLifecycle: 'Story lifecycle',
      glossary: 'Glossary',
      reference: 'Reference',
      messageFamilies: 'Message families',
      build: 'Build',
      specification: 'Specification',
      schemas: 'Schemas 1.0',
      emulator: 'Emulator',
      legalBefore: '— an unofficial community guide to the Story Object Model. The standard lives at',
      legalAfter:
        '; its specification prose is CC BY 4.0 and its schemas Apache 2.0, and where this guide and a schema disagree, the schema is right.',
      craftBefore: 'Crafted with some agents love and',
      craftAfter: 'for the community',
    },
    field: { required: 'required', optional: 'optional' },
    loop: {
      storyOwner: 'Story owner (NCS)',
      mediaStore: 'Media store',
      executorTool: 'Tool with an executor',
      rundown: 'Rundown / CMS',
      playout: 'Playout / social',
      standardsDesk: 'Standards desk',
      bus: 'som.* — one bus · one story_id · full snapshots',
      aria: 'Six participants around one publish-and-subscribe bus. The story owner publishes story.context, a media store publishes delivery.media_available, a tool with an executor publishes skill.warning.raised, a rundown or CMS publishes link events, playout publishes telling events, and the standards desk publishes system audit records. None of them sends a command to another; each reads the story from the bus.',
    },
  },
  pt: {
    nav: {
      concepts: 'Conceitos',
      envelope: 'Envelope',
      messages: 'Mensagens',
      skills: 'Skills',
      spec: 'Especificação',
      getStarted: 'Comece aqui',
    },
    toggleNav: 'Abrir ou fechar a navegação',
    themeToDark: 'Mudar para o tema escuro',
    themeToLight: 'Mudar para o tema claro',
    language: 'Idioma',
    footer: {
      tagline: 'Um guia visual do SOM 1.0, o padrão aberto para contexto da história na produção de conteúdo.',
      learn: 'Aprenda',
      storyLifecycle: 'Ciclo de vida da Story',
      glossary: 'Glossário',
      reference: 'Referência',
      messageFamilies: 'Famílias de mensagens',
      build: 'Construa',
      specification: 'Especificação',
      schemas: 'Schemas 1.0',
      emulator: 'Emulador',
      legalBefore: '— um guia comunitário e não oficial do Story Object Model. O padrão vive em',
      legalAfter:
        '; o texto da especificação é CC BY 4.0 e os schemas Apache 2.0, e onde este guia e um schema divergirem, vale o schema.',
      craftBefore: 'Feito com um pouco de amor de agentes e',
      craftAfter: 'para a comunidade',
    },
    field: { required: 'obrigatório', optional: 'opcional' },
    loop: {
      storyOwner: 'Dono da Story (NCS)',
      mediaStore: 'Repositório de mídia',
      executorTool: 'Ferramenta com executor',
      rundown: 'Espelho / CMS',
      playout: 'Playout / redes sociais',
      standardsDesk: 'Mesa de padrões editoriais',
      bus: 'som.* — uma pipeline · um story_id · snapshots completos',
      aria: 'Seis participantes em torno de uma única pipeline publish/subscribe. O dono da story publica story.context, um repositório de mídia publica delivery.media_available, uma ferramenta com executor publica skill.warning.raised, um espelho ou CMS publica eventos de link, o playout publica eventos de telling e a mesa de padrões publica registros de auditoria. Nenhum envia comandos a outro; cada um lê a story na pipeline.',
    },
  },
  es: {
    nav: {
      concepts: 'Conceptos',
      envelope: 'Envelope',
      messages: 'Mensajes',
      skills: 'Skills',
      spec: 'Especificación',
      getStarted: 'Empezar',
    },
    toggleNav: 'Abrir o cerrar la navegación',
    themeToDark: 'Cambiar al tema oscuro',
    themeToLight: 'Cambiar al tema claro',
    language: 'Idioma',
    footer: {
      tagline: 'Una guía visual de SOM 1.0, el estándar abierto para el contexto de la historia en la producción de contenidos.',
      learn: 'Aprende',
      storyLifecycle: 'Ciclo de vida de la Story',
      glossary: 'Glosario',
      reference: 'Referencia',
      messageFamilies: 'Familias de mensajes',
      build: 'Construye',
      specification: 'Especificación',
      schemas: 'Schemas 1.0',
      emulator: 'Emulador',
      legalBefore: '— una guía comunitaria y no oficial del Story Object Model. El estándar vive en',
      legalAfter:
        '; el texto de la especificación es CC BY 4.0 y los schemas Apache 2.0, y donde esta guía y un schema no coincidan, manda el schema.',
      craftBefore: 'Hecho con algo de cariño de agentes y',
      craftAfter: 'para la comunidad',
    },
    field: { required: 'obligatorio', optional: 'opcional' },
    loop: {
      storyOwner: 'Dueño de la Story (NCS)',
      mediaStore: 'Almacén de medios',
      executorTool: 'Herramienta con ejecutor',
      rundown: 'Escaleta / CMS',
      playout: 'Playout / redes',
      standardsDesk: 'Mesa de estándares',
      bus: 'som.* — un bus · un story_id · snapshots completos',
      aria: 'Seis participantes alrededor de un único bus de publicación/suscripción. El dueño de la story publica story.context, un almacén de medios publica delivery.media_available, una herramienta con ejecutor publica skill.warning.raised, una escaleta o CMS publica eventos de link, el playout publica eventos de telling y la mesa de estándares publica registros de auditoría. Ninguno envía órdenes a otro; cada uno lee la story en el bus.',
    },
  },
  de: {
    nav: {
      concepts: 'Konzepte',
      envelope: 'Envelope',
      messages: 'Nachrichten',
      skills: 'Skills',
      spec: 'Spezifikation',
      getStarted: 'Loslegen',
    },
    toggleNav: 'Navigation ein- oder ausblenden',
    themeToDark: 'Zum dunklen Design wechseln',
    themeToLight: 'Zum hellen Design wechseln',
    language: 'Sprache',
    footer: {
      tagline: 'Ein visueller Leitfaden zu SOM 1.0, dem offenen Standard für Story-Kontext in der Content-Produktion.',
      learn: 'Verstehen',
      storyLifecycle: 'Lebenszyklus einer Story',
      glossary: 'Glossar',
      reference: 'Referenz',
      messageFamilies: 'Nachrichtenfamilien',
      build: 'Bauen',
      specification: 'Spezifikation',
      schemas: 'Schemas 1.0',
      emulator: 'Emulator',
      legalBefore: '— ein inoffizieller Community-Leitfaden zum Story Object Model. Der Standard selbst liegt auf',
      legalAfter:
        '; der Spezifikationstext steht unter CC BY 4.0, die Schemas unter Apache 2.0, und wo dieser Leitfaden und ein Schema sich widersprechen, gilt das Schema.',
      craftBefore: 'Gebaut mit etwas Agenten-Liebe und',
      craftAfter: 'für die Community',
    },
    field: { required: 'Pflicht', optional: 'optional' },
    loop: {
      storyOwner: 'Story-Eigentümer (NCS)',
      mediaStore: 'Medienspeicher',
      executorTool: 'Tool mit Executor',
      rundown: 'Rundown / CMS',
      playout: 'Playout / Social',
      standardsDesk: 'Standards-Desk',
      bus: 'som.* — ein Bus · eine story_id · volle Snapshots',
      aria: 'Sechs Teilnehmer um einen gemeinsamen Publish/Subscribe-Bus. Der Story-Eigentümer veröffentlicht story.context, ein Medienspeicher delivery.media_available, ein Tool mit Executor skill.warning.raised, ein Rundown oder CMS Link-Events, das Playout Telling-Events und der Standards-Desk System-Audit-Einträge. Keiner schickt einem anderen einen Befehl; jeder liest die Story vom Bus.',
    },
  },
};
