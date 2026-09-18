import { Link } from 'react-router-dom';
import { PageHead, PhaseStepper, useHashScroll } from '../../../components/Bits';
import type { Phase } from '../../../components/Bits';
import { BEHAVIOURS, PRINCIPLES } from '../data/reading';
import { repoFile } from '../../../data/consortium';

const PHASES: Phase[] = [
  {
    key: 'dev',
    name: 'DEVELOPING',
    title: 'DEVELOPING',
    body: (
      <>
        <p>
          La historia existe y se está trabajando. Los campos llegan en snapshots sucesivos: una <code>premise</code>{' '}
          con un grado de confianza, las primeras entradas de <code>editorial_source[]</code>, los primeros Assets y
          afirmaciones.
        </p>
        <p className="small muted mb0">
          Cada cambio es un nuevo snapshot completo con un <code>sequence_number</code> mayor. Las herramientas que
          leen la historia vuelven a evaluar con cada uno.
        </p>
      </>
    ),
  },
  {
    key: 'ready',
    name: 'READY_TO_AIR',
    title: 'READY_TO_AIR',
    body: (
      <>
        <p>
          Se considera que la historia está lista para salir. Lo que aún deba resolverse antes se expresa como
          entradas de <code>editorial_gates[]</code> cuyos <code>blocks[]</code> nombran lo que retienen: un Asset o
          una fase del ciclo de vida.
        </p>
        <p className="small muted mb0">
          Un gate está en <code>PENDING</code>, <code>APPROVED</code> o <code>REJECTED</code>. Los gates se combinan
          por conjunción: todos los gates vinculantes deben permitirlo.
        </p>
      </>
    ),
  },
  {
    key: 'breaking',
    name: 'BREAKING',
    title: 'BREAKING',
    body: (
      <>
        <p>
          La historia está en vivo y avanza deprisa: justo cuando las cifras están sin confirmar y los holds importan
          más. La velocidad viene de que todas las herramientas ven el mismo estado a la vez, no de saltarse un gate.
        </p>
        <p className="small muted mb0">
          La prioridad es independiente de la fase: <code>priority.level</code> va de <code>ROUTINE</code>,{' '}
          <code>STANDARD</code>, <code>HIGH</code>, <code>URGENT</code> a <code>FLASH</code>.
        </p>
      </>
    ),
  },
  {
    key: 'published',
    name: 'PUBLISHED',
    title: 'PUBLISHED',
    body: (
      <>
        <p>
          La historia ya salió, y sigue en movimiento: las correcciones, los medios que llegan y los eventos de
          distribución producen nuevos snapshots y eventos.
        </p>
        <p className="small muted mb0">
          Tras la publicación, el peso recae en las familias de distribución: los links vinculan Assets a
          destinos, los Tellings registran la exposición y la familia de auditoría conserva el rastro.
        </p>
      </>
    ),
  },
];

const GLOSSARY: [string, React.ReactNode][] = [
  ['Story', <>Lo que ocurre en el mundo, guardado como un contexto que su medio publicador posee y afirma. Se publica como snapshots completos de <code>story.context</code> identificados por un <code>story_id</code> inmutable.</>],
  ['Asset', <>Una pieza concreta de medios o de trabajo editorial sobre una historia, clasificada por su valor probatorio (<code>PRIMARY</code> / <code>SECONDARY</code> / <code>TERTIARY</code>). Existe se publique algo a partir de ella o no.</>],
  ['Telling', <>El momento en que un Asset llega a una audiencia a través de un destino, con <code>exposure_start</code> / <code>exposure_end</code> inmutables. El estado al aire se deriva de los Tellings.</>],
  ['Link', <>Un Asset vinculado a un destino, con un gate de cumplimiento por destino (<code>PENDING</code> / <code>CLEARED</code> / <code>BLOCKED</code>).</>],
  ['Source (TAMS)', <>Medios direccionados como <code>tams://store/id</code> más un rango de tiempo opcional. SOM hace referencia a Sources, nunca a Flows.</>],
  ['Locator', <>Una referencia a medios fuera de TAMS: <code>store</code> + <code>ref</code>. Una ruta de MAM, una clave de objeto, un id de CMS.</>],
  ['Aserción (assertion)', <>Una afirmación sobre una historia, un Asset, un link o un Telling —<code>FACT_CHECK</code>, <code>DETECTION</code> o <code>MATCH</code>— con procedencia y un estado de revisión. El lugar autorizado de un hecho confirmado.</>],
  ['Procedencia (provenance)', <>Quién o qué es autor de una salida: <code>HUMAN</code> o <code>MODEL</code>. Válida para cualquier autoría, nunca pensada solo para la IA.</>],
  ['Gate editorial', <>Algo que debe resolverse antes de que un Asset o una fase avancen. <code>PENDING</code> / <code>APPROVED</code> / <code>REJECTED</code>.</>],
  ['Huérfana (orphan)', <>Una historia contenedora mínima (<code>story_type: ORPHAN</code>) creada para alojar un clip que llegó sin historia, hasta que se confirma una coincidencia propuesta.</>],
  ['Skill', <>Un archivo de reglas pasivo con la forma de agentskills.io. Declara; nunca actúa y nunca modifica el contenido.</>],
  ['Executor', <>La parte de una herramienta de proveedor que hace recall de skills, publica sus advertencias y decide qué retiene la herramienta. Las herramientas tienen executors; las redacciones no tienen uno central.</>],
  ['Instancia configurada', <>Un archivo de skill genérico con los valores de una casa cargados, vigilando una condición. Una casa ejecuta varias a partir del mismo archivo.</>],
  ['Story Archaeology', <>El método detrás del modelo: rastrear una historia real después de su emisión y registrar cómo se movió realmente su contexto.</>],
  ['Extensión', <><code>extensions["com.&#123;vendor&#125;.&#123;field&#125;"]</code>: el lugar definido para los campos que el estándar no incluye. Las claves desconocidas se ignoran.</>],
];

export default function Concepts() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Conceptos"
        title="SOM en diez minutos"
        lede="Tres sustantivos, un snapshot y un puñado de reglas sobre quién escribe y quién decide. Apréndelos y los schemas se leen solos."
        toc={[
          { href: '#nouns', label: 'Story · Asset · Telling' },
          { href: '#snapshots', label: 'Snapshots' },
          { href: '#lifecycle', label: 'Ciclo de vida' },
          { href: '#evidence', label: 'Evidencia y afirmaciones' },
          { href: '#gates', label: 'Gates y auditoría' },
          { href: '#skills', label: 'Declarar, luego actuar' },
          { href: '#principles', label: 'Principios' },
          { href: '#glossary', label: 'Glosario' },
        ]}
      />

      <section id="nouns">
        <div className="wrap">
          <p className="eyebrow">Los tres sustantivos</p>
          <h2>Story, Asset, Telling</h2>
          <p className="lede">
            Una historia es un acontecimiento real: crece, se divide y cambia de rumbo, y nadie conoce su forma hasta
            que termina. Llevar eso a un schema se redujo a tres palabras que los periodistas ya usan.
          </p>

          <div className="grid g3" style={{ marginTop: 28 }}>
            <div className="card">
              <div className="lane-icon">S</div>
              <h3>Story</h3>
              <p className="small">
                Lo que ocurre. De qué trata (<code>tags[]</code>, <code>story_meaning</code>), en qué punto
                está (<code>lifecycle</code>, <code>priority</code>), qué espera la redacción (<code>premise</code>), sus
                fuentes y su credibilidad, y los gates y las marcas de cumplimiento que pesan sobre ella.
              </p>
              <p className="small muted mb0">
                <code>story_type</code>: <code>PLANNED</code>, <code>ACTIVE</code>, <code>KILLED</code>,{' '}
                <code>SPIKED</code>, <code>ARCHIVED</code>, <code>ORPHAN</code>.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">A</div>
              <h3>Asset</h3>
              <p className="small">
                Lo que la redacción reúne y produce: <code>VIDEO</code>, <code>SCRIPT</code>, <code>GRAPHIC</code>,{' '}
                <code>TRANSCRIPT</code> y salidas generativas como <code>SUMMARY</code> y <code>SOCIAL_POST</code>.
                Solo referencias: los medios se quedan en su almacén.
              </p>
              <p className="small muted mb0">
                <code>status</code> es solo editorial: <code>READY</code>, <code>IN_PRODUCTION</code>,{' '}
                <code>PREPARED</code>, <code>INVALIDATED</code>. «En vivo» y «emitido» nunca se guardan aquí.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">T</div>
              <h3>Telling</h3>
              <p className="small">
                Un Asset que llega a una audiencia a través de un destino. Sigue a un <b>link</b> —el vínculo de ese
                Asset con ese destino— y registra cuándo empezó y terminó la exposición.
              </p>
              <p className="small muted mb0">
                La situación de cumplimiento pertenece al Telling. El mismo Asset puede estar aprobado en un link y
                bloqueado en otro en el mismo momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="snapshots">
        <div className="wrap">
          <p className="eyebrow">Snapshots, nunca deltas</p>
          <h2>Una historia se publica entera, cada vez</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div>
              <ul className="clean">
                <li>
                  <code>story_id</code> es inmutable. Una revisión es el siguiente snapshot, no una historia nueva.
                </li>
                <li>
                  <code>sequence_number</code> DEBE aumentar y <code>updated_at</code> DEBE avanzar.
                </li>
                <li>
                  Quien publica vuelve a sellar <code>originating_system</code>, así que una corrección se atribuye a
                  quien corrige, no a quien creó la historia originalmente.
                </li>
                <li>
                  Un solo escritor crea: el sistema de gestión de historias del medio es dueño de la historia y de su
                  secuencia, nunca el cable de agencia, ni siquiera en un flash.
                </li>
                <li>
                  Una herramienta que se incorpora tarde, se reinicia o se reconecta tras una caída lee un único objeto
                  y queda al día.
                </li>
              </ul>
            </div>
            <div className="card">
              <span className="kicker">El error más dañino</span>
              <h3>Omitir significa ausente, no sin cambios</h3>
              <p className="small">
                Un productor NO DEBE dejar fuera los campos que no modificó. Un escritor que envía solo sus propios
                campos borra en silencio el trabajo de todos los demás sistemas sobre la historia.
              </p>
              <p className="small mb0">
                La especificación incluye <code>tools/validate_sequence.py</code> para comprobar exactamente estas
                propiedades en una serie de snapshots: los errores que ningún mensaje aislado puede revelar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="lifecycle">
        <div className="wrap">
          <p className="eyebrow">Ciclo de vida de la historia</p>
          <h2>Cuatro fases, solo en historias activas</h2>
          <p className="lede" style={{ marginBottom: 26 }}>
            Un bloque <code>lifecycle</code> es obligatorio cuando <code>story_type</code> es <code>ACTIVE</code> y
            está prohibido en los demás casos: una regla del schema, no una convención. Elige una fase.
          </p>

          <PhaseStepper phases={PHASES} />

          <div className="note" style={{ marginTop: 24 }}>
            <p className="mb0">
              <b>Huérfanas.</b> Un clip que llega sin historia recibe una historia contenedora mínima{' '}
              <code>ORPHAN</code> que lo aloja, con una aserción <code>MATCH</code> que propone la historia real. Al
              confirmarse, el clip se traslada —mismo <code>asset_id</code>, marcas de tiempo originales— y la
              contenedora siempre pasa a <code>ARCHIVED</code>. Nunca se elimina, y los consumidores filtran las
              huérfanas con un único predicado sobre <code>story_type</code>.
            </p>
          </div>
        </div>
      </section>

      <section id="evidence">
        <div className="wrap">
          <p className="eyebrow">Evidencia y afirmaciones</p>
          <h2>De dónde vienen las cosas y qué se está afirmando</h2>

          <div className="grid g3" style={{ marginTop: 26, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">editorial_source[]</span>
              <h3>Fuentes y credibilidad</h3>
              <p className="small mb0">
                Cada fuente lleva un tipo (<code>WIRE</code>, <code>OFFICIAL</code>, <code>USER_GENERATED</code>, …) y
                una <code>credibility</code> declarada: <code>TRUSTED</code>, <code>VERIFIED</code>,{' '}
                <code>ENDORSED</code> o <code>UNVERIFIED</code>. La credibilidad es un eje distinto de la autenticidad
                de los medios.
              </p>
            </div>
            <div className="card">
              <span className="kicker">assets[].provenance</span>
              <h3>Autoría</h3>
              <p className="small mb0">
                <code>HUMAN</code> o <code>MODEL</code>, con modelo y versión solo para los modelos. Una{' '}
                <code>authenticity_credential</code> C2PA registra <code>present: false</code> en lugar de ocultar su
                ausencia. La confianza es opcional: no te inventes una para texto libre.
              </p>
            </div>
            <div className="card">
              <span className="kicker">assertions[]</span>
              <h3>Afirmaciones en revisión</h3>
              <p className="small mb0">
                <code>FACT_CHECK</code> (una métrica y un valor), <code>DETECTION</code> o <code>MATCH</code>, cada una
                con un <code>review</code> en <code>PENDING</code>, <code>CONFIRMED</code> o <code>REJECTED</code>.
                Las entradas rechazadas se marcan, nunca se eliminan. Ante cualquier desacuerdo, manda la aserción.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="gates">
        <div className="wrap">
          <p className="eyebrow">Gates y auditoría</p>
          <h2>Nada llega a una audiencia sin un gate editorial</h2>
          <p className="lede">
            Una skill declara, la herramienta dueña del executor decide y una persona aprueba. Una aprobación se
            concede a una versión del texto, así que una reescritura reabre el gate en lugar de heredar la aprobación.
          </p>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card sev hold">
              <h3>hold</h3>
              <p className="small mb0">
                El executor DEBE retener la salida en los campos afectados. Solo la libera una aprobación sobre el
                mismo alcance: no el paso del tiempo, ni que la marca desaparezca de un snapshot posterior.
              </p>
            </div>
            <div className="card sev flag">
              <h3>flag</h3>
              <p className="small mb0">
                Marcar para revisión. Una herramienta puede mostrarla; nada se retiene solo por ella.
              </p>
            </div>
            <div className="card sev inform">
              <h3>inform</h3>
              <p className="small mb0">Solo informativo. Ninguna acción de bloqueo y ninguna respuesta obligatoria.</p>
            </div>
          </div>

          <div className="grid g2" style={{ marginTop: 22, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Conjunción</span>
              <p className="small mb0">
                Cuando varios gates afectan al mismo hecho en el mismo Telling, solo se sirve si <b>todos</b> los gates
                lo permiten: basta un hold para que quede retenido. «Gana el más restrictivo» y «el dueño de la
                historia tiene prioridad» se retiraron en favor de esto. El cumplimiento es fail-closed, y una
                transformación —recorte, reencuadre, subtítulos incrustados— nunca levanta un hold.
              </p>
            </div>
            <div className="card">
              <span className="kicker">som.system.audit</span>
              <p className="small mb0">
                El rastro de gobernanza. Una <code>action</code> de tipo <code>CLEARED</code>,{' '}
                <code>SUPPRESSED</code>, <code>WITHHELD</code> u <code>OVERRIDDEN</code>, sobre un <code>LINK</code>,
                un <code>ASSET</code> o un <code>TELLING</code>, con un actor y un motivo. Una supresión apunta al
                Asset retenido, porque la rama que nunca sale al aire nunca recibe un link.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="wrap">
          <p className="eyebrow">Declarar, luego actuar</p>
          <h2>SOM transporta contexto. Las skills transportan conocimiento.</h2>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">El estándar: compartido</span>
              <p className="small mb0">
                Qué es una historia, en qué estado está, qué está retenido y qué aprobado, de dónde vino el material.
                Igual en todas partes, y sin criterio propio.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Las skills: de cada casa</span>
              <p className="small mb0">
                Normas editoriales, reglas de cumplimiento, práctica institucional: lo que legítimamente cambia de una
                redacción a otra. El marco es abierto; tu flujo de trabajo sigue siendo tuyo, y ningún proveedor
                necesita una copia de tu política.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>El silencio es un resultado válido.</b> Una skill que no encuentra nada que declarar no dice nada, y
              una herramienta demuestra que leyó la historia solo publicando a su vez. Por eso el registro de auditoría
              es un subproducto de cómo funcionan las escrituras y no una función que alguien añadió después.{' '}
              <Link to="/es/skills">Cómo funciona el recall →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="principles">
        <div className="wrap">
          <p className="eyebrow">Principios</p>
          <h2>Por qué SOM tiene la forma que tiene</h2>
          <p className="lede">
            Seis principios de trabajo abren la especificación, y son la prueba que todo cambio futuro debe superar.
          </p>

          <div className="grid g3" style={{ marginTop: 28 }}>
            {PRINCIPLES.map((p, i) => (
              <div className="card" key={p.title}>
                <span className="kicker">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p className="small mb0">{p.body}</p>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: 40, textAlign: 'center' }}>Cómo se comporta</h3>
          <div className="grid g4" style={{ marginTop: 18 }}>
            {BEHAVIOURS.map((b) => (
              <div className="card" key={b.title}>
                <h3>{b.title}</h3>
                <p className="small mb0">{b.body}</p>
              </div>
            ))}
          </div>

          <div className="note" style={{ marginTop: 24 }}>
            <p className="mb0">
              <b>Dónde se detiene el estándar.</b> SOM describe una historia y todo lo que es cierto sobre ella, y nada
              más. Lo que cada redacción haga con lo que lee es asunto suyo. La 1.0 es un compromiso de estabilidad, no
              una pretensión de exhaustividad: lo que no está resuelto queda por escrito en el{' '}
              <a href={repoFile('spec/open-register.md')} target="_blank" rel="noreferrer">
                registro abierto ↗
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section id="glossary">
        <div className="wrap">
          <p className="eyebrow">Glosario</p>
          <h2>El vocabulario</h2>
          <div className="table-scroll" style={{ marginTop: 22 }}>
            <table>
              <thead>
                <tr>
                  <th>Término</th>
                  <th>Significado</th>
                </tr>
              </thead>
              <tbody>
                {GLOSSARY.map(([term, meaning]) => (
                  <tr key={term}>
                    <td>
                      <b>{term}</b>
                    </td>
                    <td>{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginTop: 16 }}>
            El glosario completo está en la especificación:{' '}
            <a href={repoFile('spec/glossary.md')} target="_blank" rel="noreferrer">
              spec/glossary.md ↗
            </a>
          </p>
        </div>
      </section>

      <section>
        <div className="wrap center">
          <h2>Siguiente: el formato de transmisión</h2>
          <p className="lede" style={{ margin: '0 auto 24px' }}>
            Todos los mensajes comparten un envelope. Aquí está cada campo y lo que la conformidad exige de él.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Link className="btn primary" to="/es/envelope">
              El envelope →
            </Link>
            <Link className="btn" to="/es/bus">
              Las siete familias
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
