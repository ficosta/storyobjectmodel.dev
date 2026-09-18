import { localeFromPath, stripLocale, type Locale } from '../i18n/locales';

export interface RouteMeta {
  /** Path, always with a leading slash and no trailing slash (except "/"). */
  path: string;
  /** <title>. Keep under ~60 characters before the site suffix. */
  title: string;
  /** <meta name="description">. Aim for 140–160 characters. */
  description: string;
  /** Short label used in breadcrumbs and in-page navigation. */
  label: string;
  /** Relative priority in the sitemap. */
  priority: number;
}

export const SITE_URL = 'https://storyobjectmodel.dev';
export const SITE_NAME = 'storyobjectmodel.dev';

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    label: 'Home',
    title: 'Story Object Model 1.0 — a visual guide to the story context standard',
    description:
      'SOM 1.0 is the open standard for story context in content production: seven JSON message families on a pub/sub bus, so every newsroom tool reads the same live story.',
    priority: 1.0,
  },
  {
    path: '/concepts',
    label: 'Concepts',
    title: 'SOM concepts — Story, Asset, Telling, and how the model behaves',
    description:
      'The Story Object Model in ten minutes: the three nouns, snapshots, lifecycle, editorial gates and audit, skills that declare while executors act, and the principles behind it.',
    priority: 0.9,
  },
  {
    path: '/envelope',
    label: 'Envelope',
    title: 'The SOM 1.0 envelope — every field, and the conformance rules',
    description:
      'Field-by-field reference for the SOM 1.0 envelope and the skill.warning.raised payload: the wire version, format assertion, extensions, and what changed from v0.3.2.',
    priority: 0.8,
  },
  {
    path: '/bus',
    label: 'Messages',
    title: 'SOM 1.0 message families — story, link, telling, delivery, audit, warning',
    description:
      'The seven message families of SOM 1.0 and their schemas: story.context, som.link.*, som.telling.*, delivery.media_available, som.system.audit and skill.warning.raised.',
    priority: 0.8,
  },
  {
    path: '/skills',
    label: 'Skills',
    title: 'SOM skills — the library, recall adverts, and declare-not-act',
    description:
      'SOM carries context; Skills carry knowledge. The ten-skill reference library, how an executor recalls a skill, configured instances, conjunction of holds, and fail-closed.',
    priority: 0.8,
  },
  {
    path: '/get-started',
    label: 'Get started',
    title: 'Get started with SOM 1.0 — validate, publish, join',
    description:
      'Validate messages against the SOM 1.0 schemas with format assertion, publish a conformant story.context, pick an integration tier, and join the open working group.',
    priority: 0.9,
  },
];

export const ROUTE_BY_PATH: Record<string, RouteMeta> = Object.fromEntries(
  ROUTES.map((r) => [r.path, r]),
);

type RouteText = Pick<RouteMeta, 'label' | 'title' | 'description'>;

/** Titles and descriptions for each translation, keyed by the English path.
 *  English itself is ROUTES above. */
const ROUTE_TEXT: Record<Exclude<Locale, 'en'>, Record<string, RouteText>> = {
  pt: {
    '/': {
      label: 'Início',
      title: 'Story Object Model 1.0 — um guia visual do padrão de contexto da história',
      description:
        'O SOM 1.0 é o padrão aberto para contexto da história na produção de conteúdo: sete famílias de mensagens JSON numa pipeline pub/sub, para toda ferramenta da redação ler a mesma story ao vivo.',
    },
    '/concepts': {
      label: 'Conceitos',
      title: 'Conceitos do SOM — Story, Asset, Telling e como o modelo se comporta',
      description:
        'O Story Object Model em dez minutos: os três substantivos, snapshots, ciclo de vida, gates editoriais e auditoria, skills que declaram enquanto executores agem, e os princípios por trás.',
    },
    '/envelope': {
      label: 'Envelope',
      title: 'O envelope do SOM 1.0 — cada campo e as regras de conformidade',
      description:
        'Referência campo a campo do envelope do SOM 1.0 e do payload skill.warning.raised: a versão no fio, a validação de formatos, as extensões e o que mudou desde a v0.3.2.',
    },
    '/bus': {
      label: 'Mensagens',
      title: 'Famílias de mensagens do SOM 1.0 — story, link, telling, delivery, audit, warning',
      description:
        'As sete famílias de mensagens do SOM 1.0 e seus schemas: story.context, som.link.*, som.telling.*, delivery.media_available, som.system.audit e skill.warning.raised.',
    },
    '/skills': {
      label: 'Skills',
      title: 'Skills do SOM — a biblioteca, anúncios de recall e declarar-sem-agir',
      description:
        'O SOM carrega contexto; as Skills carregam conhecimento. A biblioteca de referência com dez skills, como um executor faz recall de uma skill, instâncias configuradas, conjunção de holds e fail-closed.',
    },
    '/get-started': {
      label: 'Comece aqui',
      title: 'Comece com o SOM 1.0 — validar, publicar, participar',
      description:
        'Valide mensagens contra os schemas do SOM 1.0 com validação de formatos, publique um story.context conforme, escolha um nível de integração e entre no grupo de trabalho aberto.',
    },
  },
  es: {
    '/': {
      label: 'Inicio',
      title: 'Story Object Model 1.0 — una guía visual del estándar de contexto de la historia',
      description:
        'SOM 1.0 es el estándar abierto para el contexto de la historia en la producción de contenidos: siete familias de mensajes JSON en un bus pub/sub, para que cada herramienta lea la misma story en vivo.',
    },
    '/concepts': {
      label: 'Conceptos',
      title: 'Conceptos de SOM — Story, Asset, Telling y cómo se comporta el modelo',
      description:
        'El Story Object Model en diez minutos: los tres sustantivos, snapshots, ciclo de vida, gates editoriales y auditoría, skills que declaran mientras los ejecutores actúan, y sus principios.',
    },
    '/envelope': {
      label: 'Envelope',
      title: 'El envelope de SOM 1.0 — cada campo y las reglas de conformidad',
      description:
        'Referencia campo por campo del envelope de SOM 1.0 y del payload skill.warning.raised: la versión en el cable, la validación de formatos, las extensiones y qué cambió desde la v0.3.2.',
    },
    '/bus': {
      label: 'Mensajes',
      title: 'Familias de mensajes de SOM 1.0 — story, link, telling, delivery, audit, warning',
      description:
        'Las siete familias de mensajes de SOM 1.0 y sus schemas: story.context, som.link.*, som.telling.*, delivery.media_available, som.system.audit y skill.warning.raised.',
    },
    '/skills': {
      label: 'Skills',
      title: 'Skills de SOM — la biblioteca, anuncios de recall y declarar sin actuar',
      description:
        'SOM transporta contexto; las Skills transportan conocimiento. La biblioteca de referencia de diez skills, cómo un ejecutor hace recall de una skill, instancias configuradas, conjunción de holds y fail-closed.',
    },
    '/get-started': {
      label: 'Empezar',
      title: 'Empieza con SOM 1.0 — validar, publicar, participar',
      description:
        'Valida mensajes contra los schemas de SOM 1.0 con validación de formatos, publica un story.context conforme, elige un nivel de integración y únete al grupo de trabajo abierto.',
    },
  },
  de: {
    '/': {
      label: 'Start',
      title: 'Story Object Model 1.0 — ein visueller Leitfaden zum Standard für Story-Kontext',
      description:
        'SOM 1.0 ist der offene Standard für Story-Kontext in der Content-Produktion: sieben JSON-Nachrichtenfamilien auf einem Pub/Sub-Bus, damit jedes Redaktionstool dieselbe Live-Story liest.',
    },
    '/concepts': {
      label: 'Konzepte',
      title: 'SOM-Konzepte — Story, Asset, Telling und wie sich das Modell verhält',
      description:
        'Das Story Object Model in zehn Minuten: die drei Substantive, Snapshots, Lebenszyklus, redaktionelle Gates und Audit, Skills, die deklarieren, während Executoren handeln, und die Prinzipien dahinter.',
    },
    '/envelope': {
      label: 'Envelope',
      title: 'Der SOM-1.0-Envelope — jedes Feld und die Konformitätsregeln',
      description:
        'Feld-für-Feld-Referenz zum SOM-1.0-Envelope und zum Payload skill.warning.raised: die Wire-Version, Format-Assertion, Extensions und was sich seit v0.3.2 geändert hat.',
    },
    '/bus': {
      label: 'Nachrichten',
      title: 'SOM-1.0-Nachrichtenfamilien — story, link, telling, delivery, audit, warning',
      description:
        'Die sieben Nachrichtenfamilien von SOM 1.0 und ihre Schemas: story.context, som.link.*, som.telling.*, delivery.media_available, som.system.audit und skill.warning.raised.',
    },
    '/skills': {
      label: 'Skills',
      title: 'SOM-Skills — die Bibliothek, Recall-Adverts und Deklarieren statt Handeln',
      description:
        'SOM trägt Kontext, Skills tragen Wissen. Die Referenzbibliothek mit zehn Skills, wie ein Executor eine Skill abruft, konfigurierte Instanzen, Konjunktion von Holds und Fail-closed.',
    },
    '/get-started': {
      label: 'Loslegen',
      title: 'Loslegen mit SOM 1.0 — validieren, veröffentlichen, mitmachen',
      description:
        'Nachrichten mit Format-Assertion gegen die SOM-1.0-Schemas validieren, ein konformes story.context veröffentlichen, eine Integrationsstufe wählen und der offenen Arbeitsgruppe beitreten.',
    },
  },
};

const FALLBACK_TEXT: Record<Locale, RouteText> = {
  en: { label: 'Not found', title: 'Page not found — storyobjectmodel.dev', description: 'That page is not on the bus.' },
  pt: { label: 'Não encontrada', title: 'Página não encontrada — storyobjectmodel.dev', description: 'Essa página não está na pipeline.' },
  es: { label: 'No encontrada', title: 'Página no encontrada — storyobjectmodel.dev', description: 'Esa página no está en el bus.' },
  de: { label: 'Nicht gefunden', title: 'Seite nicht gefunden — storyobjectmodel.dev', description: 'Diese Seite ist nicht auf dem Bus.' },
};

/** The route table in one language. `path` stays the English path; use
 *  localizePath() for the URL. */
export function routesFor(locale: Locale): RouteMeta[] {
  if (locale === 'en') return ROUTES;
  const text = ROUTE_TEXT[locale];
  return ROUTES.map((r) => ({ ...r, ...text[r.path] }));
}

/** Metadata for a URL in any language. `path` comes back without the prefix. */
export function metaForPath(pathname: string): RouteMeta & { locale: Locale } {
  const locale = localeFromPath(pathname);
  const bare = stripLocale(pathname);
  const clean = bare !== '/' && bare.endsWith('/') ? bare.slice(0, -1) : bare;
  const route = routesFor(locale).find((r) => r.path === clean);
  return route
    ? { ...route, locale }
    : { path: '/404', priority: 0, ...FALLBACK_TEXT[locale], locale };
}
