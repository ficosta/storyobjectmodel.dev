import { Link } from 'react-router-dom';
import AccentWord from '../../../components/AccentWord';
import LoopDiagram from '../../../components/LoopDiagram';
import FieldExplorer from '../../../components/FieldExplorer';
import { Accordion, useHashScroll } from '../../../components/Bits';
import { ENVELOPE_FIELDS } from '../data/envelope';
import { FAQS } from '../data/faq';
import {
  AUTHORS,
  CHAMPIONS,
  CHAMPION_MARKS,
  CONTACT_EMAIL,
  DEMOS_URL,
  EMULATOR_URL,
  INVOLVED_FORM_URL,
  OFFICIAL_URL,
  PARTICIPANTS,
  SPEC_REPO_URL,
} from '../../../data/consortium';
import { DEMOS } from '../data/consortium';
import { READING } from '../data/reading';

const ENVELOPE_SAMPLES: Record<string, string> = {
  som_version: '"1.0.0"',
  message_id: '"0199a1c4-7a2e-7b31-…"',
  correlation_id: '"0199a1c4-0000-7000-…"',
  causation_id: '"0199a1c4-7a2e-7b31-…"',
  message_type: '"story.context"',
  timestamp: '"2026-09-11T16:41:00.000000Z"',
  originating_system: '{ "system_id": "ncs-nyc-01", "system_type": "ncs" }',
  topic: '"som.story.context.hurricane-2026-0911"',
  modification_header: '{ "story_version": 7, … }',
  _actors: '{ … }',
  '@context': 'null',
  extensions: '{ "com.example.desk": "news" }',
  payload: '{ … }',
};

const ENVELOPE_COMMENTS: Record<string, string> = {
  payload: 'validado contra el schema del message_type',
};

export default function Home() {
  useHashScroll();

  return (
    <>
      <div className="hero">
        <div className="wrap">
          <p className="eyebrow">SOM 1.0 · publicado en IBC 2026</p>
          <h1>
            Un bus para el <AccentWord>contexto de la historia</AccentWord>.
            <br />
            Todas las herramientas en él.
          </h1>
          <p className="lede">
            El Story Object Model es un estándar abierto para el contexto de la historia en la producción de
            contenidos: una capa bajo las herramientas que ya usas, que transporta lo que es cierto sobre una historia
            en este momento y cómo ha cambiado. Las herramientas dejan de hablar entre sí y, en su lugar, leen una
            única descripción de la historia, compartida y en vivo.
          </p>
          <div className="btn-row">
            <Link className="btn primary" to="/es/get-started">
              Empieza aquí
            </Link>
            <Link className="btn" to="/es/concepts">
              SOM en diez minutos
            </Link>
          </div>
        </div>
      </div>

      <div className="credits">
        <div className="wrap">
          <p>Entre las catorce organizaciones champion</p>
          <ul>
            {CHAMPION_MARKS.map((o) => (
              <li key={o.name}>
                <img src={o.logo} alt={o.name} style={{ height: o.height }} />
              </li>
            ))}
          </ul>
          <p className="co">
            Desarrollado en el IBC Accelerator Media Innovation Programme 2026 como el proyecto SMART STORIES, con
            catorce champions y diecisiete participantes.
          </p>
        </div>
      </div>

      <section id="gap">
        <div className="wrap">
          <p className="eyebrow">El vacío</p>
          <h2>Cada sistema tiene un fragmento. Ninguno tiene la historia.</h2>
          <p className="lede">
            Cada herramienta de una redacción es precisa en su propia parcela. Las decisiones que dan forma a la
            historia —retener una cifra, qué guion es el vigente, qué se ha aprobado— viajan por chat, por teléfono y
            de mesa en mesa, y rara vez sobreviven al siguiente turno.
          </p>

          <div className="scenario" style={{ marginTop: 30 }}>
            <div>
              <span className="kicker">Hoy</span>
              <p>
                Ya tarde, en plena noticia de última hora, el editor de guardia retiene una cifra de víctimas sin
                confirmar. La escaleta se entera; gráficos recibe un nuevo briefing y lo malinterpreta; la mesa web vio
                el chat del grupo y la de redes no; nadie avisó al rótulo de noticias.
              </p>
              <p className="mb0">
                La cifra está retenida en una salida y en vivo en otra, y mañana el único rastro será la memoria de la
                gente. El contexto nunca faltó: quedó varado donde ningún sistema podía leerlo.
              </p>
            </div>
            <div>
              <span className="kicker">Con SOM</span>
              <p>
                El editor toma la misma decisión en la herramienta que ya usa, y queda escrita en la historia. Todas
                las herramientas suscritas la ven al instante y aplican las reglas que les dio su redacción: el clip no
                puede salir, el gráfico no se emite, el rótulo retira la cifra.
              </p>
              <p className="mb0">
                La decisión, quién la tomó, cuándo y por qué quedan registrados, y también lo que hizo cada
                herramienta al respecto. La persona no fue reemplazada: dejó de acarrear estado y volvió a decidir.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="idea">
        <div className="wrap">
          <p className="eyebrow">La idea</p>
          <h2>Las herramientas hablan con la historia, no entre sí</h2>
          <p className="lede" style={{ marginBottom: 30 }}>
            SOM es un pequeño conjunto de familias de mensajes JSON sobre un bus pub/sub corriente. Nada está por
            encima de las herramientas: ni orquestador ni aplicación central. Cada participante lee la historia,
            decide por sí mismo y publica lo que hizo en su propia familia.
          </p>

          <LoopDiagram />

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <span className="kicker">story.context</span>
              <h3>Story</h3>
              <p className="mb0 small">
                Lo que está ocurriendo en el mundo: de qué trata, sus fuentes y cuánto se confía en ellas, su ciclo de
                vida y prioridad, la premisa que espera la redacción y las afirmaciones que se hacen, con su estado de
                revisión.
              </p>
            </div>
            <div className="card">
              <span className="kicker">assets[]</span>
              <h3>Asset</h3>
              <p className="mb0 small">
                Lo que la redacción reúne y produce para contarla: video, audio, guiones, gráficos, transcripciones.
                Solo por referencia: los medios nunca viajan por el bus. Cada Asset lleva su procedencia y su valor
                probatorio.
              </p>
            </div>
            <div className="card">
              <span className="kicker">telling.*</span>
              <h3>Telling</h3>
              <p className="mb0 small">
                El momento en que un Asset llega a una audiencia a través de un destino. Una historia, un conjunto de
                Assets, cualquier número de Tellings, y la situación de cumplimiento pertenece al Telling, no al medio.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Transcrito, no inventado.</b> Los tres sustantivos salieron de sesiones de Story Archaeology, que
              rastrean cómo se movió el contexto de una historia real entre personas y sistemas tras su emisión. El
              modelo es pequeño porque el vocabulario que ya usan las redacciones es pequeño.{' '}
              <Link to="/es/concepts#nouns">Los tres sustantivos a fondo →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="start">
        <div className="wrap">
          <p className="eyebrow">Empieza aquí</p>
          <h2>Tres maneras de subirse al bus</h2>
          <p className="lede" style={{ marginBottom: 30 }}>
            Un sistema conforme implementa el envelope y solo las familias sobre las que tiene algo que decir. Lo que
            eso implica depende de tu papel.
          </p>

          <div className="grid g3">
            <Link className="card" to="/es/envelope">
              <div className="lane-icon">▤</div>
              <h3>Eres dueño de historias</h3>
              <p className="small">
                Un sistema de planificación o NCS. Creas la historia y publicas snapshots de{' '}
                <code>story.context</code>: un <code>story_id</code> inmutable, un <code>sequence_number</code>{' '}
                creciente y todos los campos cada vez; omitir significa ausente.
              </p>
              <span className="more">El envelope, campo por campo →</span>
            </Link>
            <Link className="card" to="/es/skills">
              <div className="lane-icon">◈</div>
              <h3>Tu herramienta actúa según reglas</h3>
              <p className="small">
                Una escaleta, un MAM, un CMS, un sistema de playout o de gráficos. Tu executor hace recall de skills
                de la biblioteca compartida, publica <code>skill.warning.raised</code> y decide qué retiene tu
                herramienta.
              </p>
              <span className="more">Las skills y la biblioteca →</span>
            </Link>
            <Link className="card" to="/es/bus">
              <div className="lane-icon">⇄</div>
              <h3>Mueves medios o salidas</h3>
              <p className="small">
                Un almacén TAMS o un MAM anuncia <code>delivery.media_available</code>; un sistema que confirma
                publica <code>som.link.*</code>; el playout y las redes publican <code>som.telling.*</code>.
              </p>
              <span className="more">Las siete familias de mensajes →</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="rulebook">
        <div className="wrap">
          <p className="eyebrow">El reglamento</p>
          <h2>SOM transporta contexto. Las skills transportan conocimiento.</h2>
          <p className="lede">
            Las reglas editoriales las escribe una sola vez la redacción, con la forma abierta de agentskills.io,
            donde cualquier herramienta puede leerlas. Una skill es pasiva: declara lo que es cierto, y la
            herramienta dueña del executor actúa en consecuencia.
          </p>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Como lo diría una mesa de estándares</span>
              <p className="small mb0">
                No emitas una cifra de víctimas hasta que la confirmen dos fuentes independientes con nombre, o haya
                una declaración oficial. Hasta entonces, retén la cifra en todas las salidas y envíala a la mesa de
                estándares.
              </p>
            </div>
            <div>
              <pre>{`# illustrative — the same rule, once, for every tool
skill:       casualty-figure-hold
declares:    GATE
scope:       story.context.editorial_gates
when:        confirming_sources < 2 and no official_statement
then:        hold · route: standards_desk
authored_by: standards desk
silence:     valid`}</pre>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Una copia, un autor.</b> Nadie traduce la regla a seis productos de proveedores, y ningún proveedor
              necesita una copia de tu política para trabajar para ti. Si una regla no se puede evaluar, la salida que
              protege sigue retenida y decide una persona. <Link to="/es/skills">Cómo se hace recall de las skills →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="demos">
        <div className="wrap">
          <p className="eyebrow">Míralo en acción</p>
          <h2>Dos escenarios de última hora, un solo bus de historias</h2>
          <p className="lede">
            En IBC 2026 el consorcio presentó dos escenarios con historias y proveedores distintos, todos leyendo y
            escribiendo la misma historia con herramientas de producción reales. En ninguno de los dos algo le envía
            una orden a otra cosa.
          </p>

          <div className="grid g2" style={{ marginTop: 28, alignItems: 'start' }}>
            {DEMOS.map((d, i) => (
              <a className="card" key={d.title} href={`${DEMOS_URL}#${d.anchor}`} target="_blank" rel="noreferrer">
                <span className="kicker">Escenario {String(i + 1).padStart(2, '0')}</span>
                <h3>{d.title} ↗</h3>
                <p className="small">{d.summary}</p>
                <p className="small muted mb0">{d.vendors.join(' · ')}</p>
              </a>
            ))}
          </div>

          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <a className="btn" href={DEMOS_URL} target="_blank" rel="noreferrer">
              Ver las demos ↗
            </a>
            <a className="btn" href={EMULATOR_URL} target="_blank" rel="noreferrer">
              Abrir el emulador del bus en vivo ↗
            </a>
          </div>
        </div>
      </section>

      <section id="fits">
        <div className="wrap">
          <p className="eyebrow">No reemplaza nada</p>
          <h2>Un estándar nuevo, más conexiones inteligentes</h2>
          <p className="lede">
            El hardware tuvo GPI; el software tuvo MOS, creado por cadenas y proveedores para su sector y sin dueño.
            SOM es su equivalente para la era de las herramientas inteligentes, y se encuentra con los estándares que
            ya funcionan allí donde están.
          </p>

          <div className="table-scroll" style={{ marginTop: 26 }}>
            <table>
              <thead>
                <tr>
                  <th>Capa</th>
                  <th>De qué es dueña</th>
                  <th>Relación con SOM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>NCS / planificación</b>
                  </td>
                  <td>Crear y redactar la historia</td>
                  <td>
                    El dueño de la historia. Publica <code>story.context</code> y es dueño de su secuencia. La escaleta
                    es una vista de una historia; SOM transporta la historia de la que es vista.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>MOS</b>
                  </td>
                  <td>Control de dispositivos, elementos de la escaleta</td>
                  <td>Las líneas MOS se quedan, con un puente que las hace conscientes del contexto de la historia.</td>
                </tr>
                <tr>
                  <td>
                    <b>TAMS</b>
                    <br />
                    <span className="muted small">BBC R&amp;D Time Addressable Media Store</span>
                  </td>
                  <td>Los fotogramas</td>
                  <td>
                    SOM guarda lo que los fotogramas significan para la historia. Un hold se ancla a los fotogramas
                    exactos que bloquea mediante una Source <code>tams://</code> y un rango de tiempo; una cita conoce
                    sus puntos de entrada y salida; qué fotogramas llegaron a qué audiencia pasa a ser una consulta.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>MAM / otros almacenes</b>
                  </td>
                  <td>Esencia, versiones, recuperación</td>
                  <td>
                    El mismo patrón mediante un <code>locator</code> (<code>store</code> + <code>ref</code>). En SOM,
                    los medios son cualquier medio, no solo TAMS.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Agentes y MCP</b>
                  </td>
                  <td>Lo que hayas construido</td>
                  <td>
                    Se queda. La salida generativa que se publica es una entrada de <code>assets[]</code> con{' '}
                    <code>provenance</code> de autoría; las afirmaciones sobre el contenido son{' '}
                    <code>assertions[]</code> con un estado de revisión.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Lo que SOM no es:</b> los medios, la escaleta, un MAM, un producto, software, un reemplazo de nada de
              lo que usas, ni propiedad de ningún proveedor. Como dice el proyecto, un estándar propiedad de un
              proveedor es un producto; uno propiedad de un sector es infraestructura.
            </p>
          </div>
        </div>
      </section>

      <section id="envelope">
        <div className="wrap">
          <p className="eyebrow">El envelope</p>
          <h2>Todos los mensajes comparten un mismo envoltorio</h2>
          <p className="lede" style={{ marginBottom: 28 }}>
            Un objeto cerrado: los campos de nivel superior desconocidos no pasan la validación. Haz clic en cualquier
            clave para leer qué significa.
          </p>

          <FieldExplorer fields={ENVELOPE_FIELDS} samples={ENVELOPE_SAMPLES} comments={ENVELOPE_COMMENTS} />

          <div className="note" style={{ marginTop: 24 }}>
            <p>
              <b>Las reglas que muerden.</b> Emite <code>som_version: "1.0.0"</code> y nunca bifurques la lógica según
              su valor. <code>message_type</code> es el único discriminador. <code>correlation_id</code> es
              obligatorio. <code>topic</code> empieza por <code>som.</code> Activa la validación de formatos
              (<code>format</code>): la mayoría de los validadores aceptan en silencio un <code>message_id</code> que
              no es un UUID. <Link to="/es/envelope">Referencia completa del envelope →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="numbers">
        <div className="wrap">
          <p className="eyebrow">En cifras</p>
          <h2 className="mb0">La forma del estándar</h2>
          <div className="grid g4" style={{ marginTop: 30 }}>
            <div className="stat">
              <b>7</b>
              <span>familias de mensajes, cada una un JSON Schema en una URL que no cambiará durante toda la vida de 1.x</span>
            </div>
            <div className="stat">
              <b>3</b>
              <span>sustantivos —Story, Asset, Telling— transcritos de cómo ya trabajan las redacciones</span>
            </div>
            <div className="stat">
              <b>10</b>
              <span>skills de referencia publicadas, más una propuesta, en la biblioteca compartida</span>
            </div>
            <div className="stat">
              <b>14 + 17</b>
              <span>organizaciones champion y participantes tecnológicos en SMART STORIES</span>
            </div>
          </div>
        </div>
      </section>

      <section id="who">
        <div className="wrap">
          <p className="eyebrow">Créditos</p>
          <h2>Construido por el sector, publicado para el sector</h2>
          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div>
              <p>
                SOM tomó forma debatiéndose en abierto —dos hackatones, un grupo de trabajo semanal y seis meses desde
                el arranque hasta un bus funcionando— y se publicó como <b>versión 1.0 el 12 de septiembre de 2026</b>{' '}
                en IBC, en Ámsterdam.
              </p>
              <p>
                Sus autores son {AUTHORS.slice(0, -1).join(', ')} y {AUTHORS[AUTHORS.length - 1]}. Jon Roberts,
                Morag McIntosh y Alex Bassett concibieron el modelo y dirigieron el proyecto, junto con Brian Hopman,
                de AP; John Boucklos coescribió la especificación, llevó el schema hasta la 1.0 y construyó los
                validadores y el repositorio.
              </p>
              <p className="mb0">
                BBC R&amp;D trabajó en la conexión con TAMS. Google Cloud fue el patrocinador principal del proyecto
                del Accelerator; Amazon Web Services aportó el bus de referencia, el panel y el almacén TAMS; The
                Associated Press y The Weather Company aportaron datos.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Abierto y sin dueño</span>
              <p className="small">
                Sin cuota y nada que firmar. Los schemas, ejemplos, herramientas y skills tienen licencia Apache 2.0;
                el texto de la especificación es CC BY 4.0. Esas licencias son la totalidad de las condiciones.
              </p>
              <p className="small">
                El Accelerator terminó; el grupo de trabajo, no. Está abierto a cualquiera que implemente el modelo o
                se vea afectado por él, y cada cambio llega como un pull request que cualquiera puede abrir.
              </p>
              <p className="small mb0">
                <a href={SPEC_REPO_URL} target="_blank" rel="noreferrer">
                  github.com/storyobjectmodel/som ↗
                </a>{' '}
                ·{' '}
                <a href={OFFICIAL_URL} target="_blank" rel="noreferrer">
                  storyobjectmodel.com ↗
                </a>
              </p>
            </div>
          </div>

          <div className="roster">
            <div>
              <h4>Champions · 14</h4>
              <ul>
                {CHAMPIONS.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Participantes · 17</h4>
              <ul>
                {PARTICIPANTS.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
            <p className="small muted mb0">
              Lista según el{' '}
              <a href={`${SPEC_REPO_URL}/blob/main/CONTRIBUTORS.md`} target="_blank" rel="noreferrer">
                CONTRIBUTORS.md ↗
              </a>{' '}
              de la especificación.
            </p>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap narrow">
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2 style={{ marginBottom: 28 }}>Antes de que preguntes</h2>
          <Accordion items={FAQS} />
        </div>
      </section>

      <section id="reading">
        <div className="wrap">
          <p className="eyebrow">Para leer más</p>
          <h2>Directo de la fuente</h2>
          <p className="lede">
            Este sitio es una guía secundaria y no oficial. Estas son las fuentes primarias; las tres primeras son el
            propio estándar.
          </p>

          <div className="reading" style={{ marginTop: 28 }}>
            {READING.map((r) => (
              <a className="card" href={r.url} target="_blank" rel="noreferrer" key={r.url}>
                <span className="kicker">
                  {r.source} · {r.date}
                </span>
                <h3>{r.title} ↗</h3>
                <p className="small mb0">{r.why}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="cta">
        <div className="wrap center">
          <h2>Léelo. Construye sobre él. Cuéntales qué se rompe.</h2>
          <p className="lede" style={{ margin: '0 auto 26px' }}>
            La especificación está publicada y se puede implementar gratis. Para construir sobre ella, escribir
            skills, organizar una sesión de Story Archaeology o sumarte al grupo de trabajo, ponte en contacto
            directamente con el proyecto.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Link className="btn primary" to="/es/get-started">
              Primeros pasos →
            </Link>
            <a className="btn" href={INVOLVED_FORM_URL} target="_blank" rel="noreferrer">
              Participa ↗
            </a>
            <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
