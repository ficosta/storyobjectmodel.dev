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

/** Los dos escenarios de IBC 2026, tal como los describe storyobjectmodel.com. */
export const DEMOS: Demo[] = [
  {
    title: 'El huracán',
    anchor: 'demo-1',
    summary:
      'Cables de agencia y un feed de datos meteorológicos en el bus, con transcripción e inteligencia de medios leyendo la historia. Llegan dos clips —uno con credenciales de autenticidad, otro sin ellas— y el gate los trata de forma distinta, dejando constancia. La tormenta se reclasifica en origen, una periodista lo confirma y todas las herramientas que dependían de la categoría anterior ven el cambio a la vez. Una afirmación de una sola fuente, sin confirmar, sigue retenida mientras el resto de la página sale en vivo.',
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
    title: 'El anuncio del primer ministro',
    anchor: 'demo-2',
    summary:
      'Un anuncio cuyo resultado se desconoce hasta que se produce. La historia entra en el bus con una premisa esperada y dos juegos de guiones preparados. Las herramientas que la leen retienen borradores de publicaciones sociales, sugieren una unidad en directo, transcriben la señal y proponen la afirmación a medida que se pronuncia, y nada cambia hasta que una periodista aprueba. Esa única aprobación corta el clip, confirma los guiones correspondientes, suprime los demás con un motivo registrado y libera las publicaciones retenidas.',
    vendors: ['Reuters', 'Octopus', 'LiveU', 'Fonn Group (Mimir)', 'Trint', 'HyperContent AI', 'Amazon Web Services'],
  },
];
