import { OFFICIAL_URL, SPEC_REPO_URL, repoFile } from '../../../data/consortium';
import type { Principle, Reading } from '../../../data/reading';

/**
 * Fuentes primarias, la oficial primero. Donde algo de lo siguiente contradiga
 * los schemas publicados, mandan los schemas.
 */
export const READING: Reading[] = [
  {
    title: 'storyobjectmodel.com',
    source: 'El sitio oficial de SOM',
    date: 'septiembre de 2026',
    url: OFFICIAL_URL,
    why: 'El planteamiento del propio estándar, las dos demostraciones de IBC, los principios, el FAQ, cómo sumarse, el emulador en vivo y los schemas servidos en sus URL permanentes.',
  },
  {
    title: 'storyobjectmodel/som',
    source: 'GitHub — el repositorio de la especificación',
    date: 'SOM 1.0 · 12 de septiembre de 2026',
    url: SPEC_REPO_URL,
    why: 'Los siete schemas normativos, 18 ejemplos resueltos y 20 casos que deben rechazarse, los validadores, la biblioteca de skills y los documentos de conformidad, compatibilidad y migración.',
  },
  {
    title: 'Introduction and principles',
    source: 'Jon Roberts, en nombre de los autores',
    date: 'septiembre de 2026',
    url: repoFile('spec/introduction.md'),
    why: 'Por qué la historia nunca tuvo un modelo cuando los medios y el control sí, los tres sustantivos y los seis principios que todo cambio futuro debe superar.',
  },
  {
    title: 'Transforming newsrooms with agentic workflows',
    source: 'TVBEurope — Milan Varga, Octopus Newsroom',
    date: 'septiembre de 2026',
    url: 'https://www.tvbeurope.com/ibc/transforming-newsrooms-with-agentic-workflows',
    why: 'El relato de un participante sobre el proyecto y el argumento de la procedencia: por qué debería importarle a una cadena.',
  },
  {
    title: 'The next newsroom coordination problem',
    source: 'AP Workflow Solutions — Brian Hopman',
    date: '2026',
    url: 'https://workflow.ap.org/news/newsroom-coordination-problem/',
    why: 'Por qué MOS no es lo que se reemplaza, y dónde cuesta trazar la línea entre SOM y las skills.',
  },
  {
    title: 'Solving the story context gap',
    source: 'TVBEurope — Ash Ellis, Moments Lab',
    date: 'septiembre de 2026',
    url: 'https://www.tvbeurope.com/ibc/solving-the-story-context-gap',
    why: 'Qué significa para un proveedor publicar en el bus en lugar de pasar contenido de una interfaz a otra.',
  },
  {
    title: 'Writing an open standard for story context',
    source: 'Octopus Newsroom — entrevista con Milan Varga',
    date: '2026',
    url: 'https://www.octopus-news.com/writing-an-open-standard-for-story-context-an-interview-with-milan-varga/',
    why: 'La historia del origen: el sentido de una historia nunca se escribió de una forma que pudiera moverse.',
  },
  {
    title: 'The Smart Stories Project at IBC Accelerator',
    source: 'Trint — Tessa Kaday',
    date: 'agosto de 2026',
    url: 'https://trint.com/blog/smart-stories-project-at-ibc-accelerator-2026',
    why: 'La versión corta, escrita antes de las demostraciones de IBC.',
  },
  {
    title: 'Incubator 2026: SMART STORIES — the agentic production ecosystem',
    source: 'IBC Accelerator',
    date: '2026',
    url: 'https://show.ibc.org/accelerator-project-incubator-2026-smart-stories-agentic-production-ecosystem',
    why: 'La página del proyecto en el Accelerator, tal como la registra el programa.',
  },
];

/** Los seis principios de trabajo de spec/introduction.md, resumidos. */
export const PRINCIPLES: Principle[] = [
  {
    title: 'Alcance de una sola historia',
    body: 'El estándar coordina dentro de una historia. Las relaciones con otras historias viajan como referencias, y ahí termina el alcance.',
  },
  {
    title: 'Mensajes, no organizaciones',
    body: 'SOM describe lo que viaja por el bus. No opina sobre tus mesas, roles ni herramientas: dos flujos de trabajo muy distintos pueden hablar de la misma historia.',
  },
  {
    title: 'Estado afirmado por el medio',
    body: 'Un contexto de la historia dice aquello que su dueño está dispuesto a firmar. Nada en él es una conjetura deducida de varias fuentes.',
  },
  {
    title: 'Coordinación, no consumo',
    body: 'Un campo tiene sentido si otro sistema lo necesita para actuar correctamente. SOM no transporta el contenido y no es un formato de entrega.',
  },
  {
    title: 'Por defecto no; el sí se justifica',
    body: 'Un campo se gana su lugar si sin él se bloquea una integración real. La 1.0 retiró tres campos propuestos exactamente por esa razón.',
  },
  {
    title: 'Crecimiento del vocabulario gobernado',
    body: 'La estructura puede ser permisiva; las palabras que llevan significado, no. La extensión tiene una forma definida, así que los términos del proveedor y los de la redacción comparten mensaje en igualdad de condiciones.',
  },
];

/** Cómo se comporta el modelo, según storyobjectmodel.com/principles.html, resumido. */
export const BEHAVIOURS: Principle[] = [
  {
    title: 'Nada está al mando',
    body: 'Ningún orquestador, ninguna aplicación central. Cada herramienta lee la historia y decide por sí misma.',
  },
  {
    title: 'Las skills declaran, los executors actúan',
    body: 'Una skill enuncia lo que es cierto según una regla que escribió su redacción. Solo actúa la herramienta dueña del executor, y el silencio es un resultado válido.',
  },
  {
    title: 'Un solo escritor crea',
    body: 'El sistema de gestión de historias del medio es dueño de la historia y de su secuencia. Nunca el cable de agencia.',
  },
  {
    title: 'Republicación completa, nunca un delta',
    body: 'Una herramienta que se enciende a mitad de la noche lee un único objeto y lo sabe todo.',
  },
  {
    title: 'Vinculación en el acto editorial',
    body: 'Un medio pasa a formar parte de una historia cuando una persona lo decide, nunca solo porque haya llegado.',
  },
  {
    title: 'Una transformación nunca levanta un hold',
    body: 'Cortar, recortar o reversionar un Asset no puede blanquear su situación de cumplimiento.',
  },
  {
    title: 'Leer no deja rastro',
    body: 'Una herramienta demuestra que leyó algo publicando a su vez, y por eso el registro de auditoría surge de la propia forma en que funcionan las escrituras.',
  },
];
