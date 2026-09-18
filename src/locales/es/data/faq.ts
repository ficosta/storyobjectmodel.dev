import type { Faq } from '../../../data/faq';

/**
 * Las preguntas que la gente se hace al conocer el modelo. Las respuestas siguen
 * el propio FAQ del estándar en storyobjectmodel.com/faq.html y la declaración de
 * conformidad del repositorio de la especificación.
 */
export const FAQS: Faq[] = [
  {
    q: '¿Algo actúa por su cuenta?',
    a: 'No. Una skill <em>declara</em> lo que es cierto sobre una historia; la herramienta dueña del executor decide qué hacer al respecto; una persona aprueba todo lo que llega a una audiencia. Una aprobación se concede a una versión concreta del texto, así que una reescritura reabre el gate en lugar de heredar la aprobación. Si una regla no se puede evaluar, la salida que protege sigue retenida y decide una persona.',
  },
  {
    q: '¿Se trata de reemplazar a los periodistas?',
    a: 'Se trata de capturar su criterio. Las decisiones que dan forma a una historia ya existen —en un chat, en un nuevo briefing, en la cabeza de alguien— y desaparecen con el siguiente turno. Escribirlas en la historia deja cada decisión registrada y atribuida a quien la tomó. La persona deja de acarrear estado entre sistemas y vuelve a decidir.',
  },
  {
    q: '¿Qué impide que dos sistemas escriban versiones contradictorias de la misma historia?',
    a: 'Un solo escritor. El sistema de gestión de historias del medio crea la historia y es dueño de su <code>sequence_number</code> —nunca el cable de agencia, ni siquiera en un flash. Todo lo demás contribuye a través de su propia familia de mensajes. Cuando las skills discrepan, los gates se combinan por <b>conjunción</b> (basta un hold para que quede retenido), el cumplimiento normativo es fail-closed y una transformación nunca levanta un hold.',
  },
  {
    q: '¿Quién gestiona el bus y qué pasa cuando se cae?',
    a: 'Cada redacción gestiona el suyo, como cualquier otra infraestructura de mensajería del edificio. Si se cae, las herramientas siguen funcionando por separado, como hoy, y se reconcilian al reconectar: nada depende del bus para seguir al aire. Como la historia se republica completa, una herramienta que vuelve lee un único objeto y queda al día.',
  },
  {
    q: '¿SOM está atado a Kafka, o a algún broker?',
    a: 'No. SOM define un envelope y siete familias de payload que viajan sobre un bus pub/sub corriente. La única regla sobre topics es que un topic empieza por <code>som.</code> —y, de todos modos, un consumidor nunca deduce el tipo de payload a partir del topic; <code>message_type</code> es el único discriminador.',
  },
  {
    q: '¿Por qué no apuntar un modelo a los sistemas que ya tenemos?',
    a: 'Una consulta de recuperación responde a una sola pregunta para una sola herramienta, y nadie más ve la respuesta. Una producción necesita lo contrario: un único estado que todas las herramientas lean igual, gates que sigan en pie cuando el trabajo pasa de un proveedor a otro y un registro atribuido de cada decisión. La posición del estándar es que los modelos son consumidores de SOM, no un sustituto.',
  },
  {
    q: '¿Los medios viajan por el bus?',
    a: 'Nunca. Los Assets son referencias. En la conexión con TAMS, una historia apunta a una Source URI y un rango de tiempo; un MAM o cualquier otro almacén se direcciona igual, mediante un <code>locator</code>. La vinculación de un medio a una historia ocurre en el acto editorial, nunca en la ingesta.',
  },
  {
    q: '¿Qué pasa con los sistemas que ya usamos?',
    a: 'Se quedan. SOM no es un MAM, ni una escaleta, ni un producto, y no reemplaza nada. MOS sigue funcionando, con un puente que lo hace más inteligente, y lo que hayas construido con agentes sigue siendo tuyo. Basta un sistema para empezar.',
  },
  {
    q: '¿Cómo añado un campo que la especificación no tiene?',
    a: 'Ponlo en <code>extensions["com.{vendor}.{field}"]</code>. Los consumidores DEBEN ignorar las claves de extensión que no reconozcan y NO DEBEN rechazar el mensaje por ellas. Los valores de enum de proveedor usan en cambio el prefijo <code>x-</code>: <code>x-graphics_pack</code>.',
  },
  {
    q: '¿Por qué snapshots completos en lugar de deltas?',
    a: 'Porque los consumidores se incorporan tarde, se reinician y pierden mensajes. Un mensaje <code>story.context</code> es el estado completo de la historia, así que omitir significa <em>ausente</em>, no <em>sin cambios</em>. Un escritor que envía solo sus propios campos borra en silencio el trabajo de todos los demás: la declaración de conformidad lo considera el error más dañino que puede cometer una implementación.',
  },
  {
    q: '¿Cómo cambia el estándar y quién decide?',
    a: 'En abierto. Cada cambio llega como un pull request a <code>storyobjectmodel/som</code> y cualquiera puede abrir uno. Dentro de 1.x solo se publican cambios aditivos; eliminar o renombrar algo espera a la 2.0, y un campo obsoleto sigue funcionando hasta entonces. Lo que aún no está resuelto figura en el registro abierto.',
  },
  {
    q: '¿De quién es?',
    a: 'De nadie. El estándar es abierto y no tiene dueño. Los schemas, ejemplos, herramientas y skills son Apache 2.0; el texto de la especificación es CC BY 4.0. No hay cuota ni nada que firmar.',
  },
  {
    q: '¿Qué es Story Archaeology?',
    a: 'El método del que salió el modelo. Se toma una historia real después de su emisión y se rastrea cómo se movió realmente su contexto, salto a salto, entre personas y sistemas: dónde se creó conocimiento, dónde se perdió y quién lo llevó a mano. Story, Asset y Telling se transcribieron de esas sesiones en lugar de inventarse.',
  },
];
