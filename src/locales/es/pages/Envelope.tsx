import { Link } from 'react-router-dom';
import FieldExplorer from '../../../components/FieldExplorer';
import { PageHead, useHashScroll } from '../../../components/Bits';
import { ENVELOPE_FIELDS, WARNING_FIELDS } from '../data/envelope';
import { SCHEMA_BASE_URL, repoFile } from '../../../data/consortium';

const ENVELOPE_SAMPLES: Record<string, string> = {
  som_version: '"1.0.0"',
  message_id: '"0199a1c4-7a2e-7b31-8c55-4d2f9e6a1b07"',
  correlation_id: '"0199a1c4-0000-7000-8000-000000000911"',
  causation_id: '"0199a1c4-7a2e-7b31-8c55-4d2f9e6a1b06"',
  message_type: '"story.context"',
  timestamp: '"2026-09-11T16:41:00.000000Z"',
  originating_system: '{ "system_id": "ncs-nyc-01", "system_type": "ncs", … }',
  topic: '"som.story.context.hurricane-2026-0911"',
  modification_header: '{ "story_version": 7, "modified_by": "producer-7" }',
  _actors: '{ … }',
  '@context': 'null',
  extensions: '{ "com.example.desk": "news" }',
  payload: '{ "story_id": "hurricane-2026-0911", … }',
};

const WARNING_SAMPLES: Record<string, string> = {
  warning_id: '"0190a000-0000-7000-8000-00000000000a"',
  skill_id: '"smart-stories/hold-while-flagged"',
  skill_version: '"0.2.2"',
  story_id: '"story-verdict-0412"',
  scope: '"story:story-verdict-0412"',
  severity: '"hold"',
  rule_id: '"house-reporting-restriction-hold"',
  non_overridable: 'true',
  affected_fields: '["editorial_gates[].status"]',
  detail: '"Held off air. … Clears on a clearance at story scope by legal or above."',
  blocks: '["air:story-verdict-0412"]',
  skill_warning_ref: '"swr-0001"',
  content_type: '"sync.ai.banner"',
  message_type: '"skill.warning.raised"',
};

const RETIRED: [string, React.ReactNode][] = [
  ['source (envelope)', <><code>originating_system</code> — el campo antiguo se rechaza de plano</>],
  ['signature (envelope)', <>Rechazado de plano. No existe ningún campo de firma.</>],
  ['sources[]', <><code>editorial_source[]</code> — credibilidad <code>TRUSTED</code> | <code>VERIFIED</code> | <code>ENDORSED</code> | <code>UNVERIFIED</code></>],
  ['skills_config.broadcaster', <><code>skills_config.newsroom</code> (la clave antigua se rechaza)</>],
  ['broadcaster_id', <>Rechazado de plano. <code>newsroom_id</code> es opcional en 1.0 y, si falta, se deriva de <code>skills_config.newsroom</code></>],
  ['collaboration.version', <><code>collaboration.editing_version</code></>],
  ['content_ref (singular)', <><code>content_refs[]</code></>],
  ['instances[]', <><b>Rechazado de plano.</b> La distribución se modela con links y Tellings</>],
  ['instance_ref (warning)', <><b>Rechazado de plano.</b> Las salidas se acotan mediante <code>scope</code>: <code>link:</code>, <code>asset:</code> o <code>story:</code></>],
  ['ai_enrichments[]', <><b>Rechazado de plano</b> desde v0.3.2. La salida generativa que se publica es una entrada de <code>assets[]</code> con <code>provenance</code>; las afirmaciones sobre el contenido son <code>assertions[]</code></>],
  ['media_refs[].flow_id', <><code>source</code> (<code>tams://store/id</code>) + <code>time_range</code>, o un <code>locator</code></>],
  ['editorial_gates[].blocks as strings', <>Obsoleto. Usa <code>&#123; "kind": "ASSET" | "PHASE", "ref": … &#125;</code></>],
];

const WITHDRAWN: [string, string][] = [
  ['assets[].voice_count', 'Un entero opcional que llevaba una regla de clasificación editorial que nunca llegó a cerrarse.'],
  ['assets[].status → FINALIZING', 'Un valor de enum propuesto para una salida derivada que aún se está terminando; nunca se ratificó.'],
  ['transforms[].transform_id', 'Un identificador de auditoría estable y opcional para una única transformación; todavía en discusión.'],
];

export default function Envelope() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Referencia · SOM 1.0"
        title="El envelope"
        lede="Un único envoltorio, compartido por todos los mensajes de todas las familias. Es un objeto cerrado: los campos de primer nivel desconocidos no pasan la validación, y los antiguos campos source y signature se rechazan sin más."
        toc={[
          { href: '#fields', label: 'Campos' },
          { href: '#rules', label: 'Reglas de conformidad' },
          { href: '#warning', label: 'skill.warning.raised' },
          { href: '#migration', label: 'Desde v0.3.2' },
          { href: '#retired', label: 'Renombrados y retirados' },
          { href: '#extensions', label: 'Extensions' },
        ]}
      />

      <section id="fields">
        <div className="wrap">
          <p className="eyebrow">Anatomía</p>
          <h2>Cada campo, uno a uno</h2>
          <p className="lede" style={{ marginBottom: 28 }}>
            Haz clic en una clave para ver qué lleva y dónde suele confundir a la gente. Los valores de ejemplo siguen el
            paso 6 del caso práctico del huracán de la especificación.
          </p>
          <FieldExplorer fields={ENVELOPE_FIELDS} samples={ENVELOPE_SAMPLES} />
          <p className="small muted" style={{ marginTop: 16 }}>
            Schema:{' '}
            <a href={`${SCHEMA_BASE_URL}/envelope.schema.json`} target="_blank" rel="noreferrer">
              <code className="url">{`${SCHEMA_BASE_URL}/envelope.schema.json`}</code> ↗
            </a>
          </p>
        </div>
      </section>

      <section id="rules">
        <div className="wrap">
          <p className="eyebrow">Conformidad</p>
          <h2>El listón está más bajo de lo que crees</h2>
          <p className="lede">
            Un sistema es conforme con SOM 1.0 si cada mensaje que publica es un envelope válido, cada payload valida
            contra el schema de su <code>message_type</code> declarado, e ignora lo que no reconoce. Un sistema de
            planificación que solo publica <code>story.context</code> y solo lee advertencias es plenamente conforme.
          </p>

          <div className="grid g2" style={{ marginTop: 26 }}>
            <div className="card">
              <span className="kicker">01</span>
              <h3>
                Emite <code>"1.0.0"</code>, nunca decidas en función de él
              </h3>
              <p className="small mb0">
                Los productores emiten la versión del paquete con la que son conformes; un futuro productor 1.1 emitirá{' '}
                <code>"1.1.0"</code>. Los consumidores no deben cambiar su comportamiento según <code>som_version</code>{' '}
                — eso se rompe en 1.1 por definición. Y <code>"0.3.2"</code> no es SOM 1.0: el schema deja el campo
                abierto, así que un consumidor conforme tiene que aplicar esta regla por su cuenta.
              </p>
            </div>
            <div className="card">
              <span className="kicker">02</span>
              <h3>
                <code>message_type</code> es el único discriminador
              </h3>
              <p className="small mb0">
                Elige el schema del payload a partir de él. No del topic, de un nombre de archivo, de la identidad del
                publicador ni de la forma del payload.
              </p>
            </div>
            <div className="card">
              <span className="kicker">03</span>
              <h3>
                Valida <code>format</code>
              </h3>
              <p className="small mb0">
                JSON Schema trata <code>format</code> como una anotación, así que la mayoría de los validadores aceptan{' '}
                <code>"message_id": "NOT-A-UUID"</code> sin un solo error. La conformidad exige validar{' '}
                <code>uuid</code> y <code>date-time</code> — en Node, <code>ajv/dist/2020</code> más{' '}
                <code>ajv-formats</code>; en Python, un <code>format_checker</code> y <code>rfc3339-validator</code>.
              </p>
            </div>
            <div className="card">
              <span className="kicker">04</span>
              <h3>Ignora lo que no reconozcas</h3>
              <p className="small mb0">
                Las claves de <code>extensions</code> desconocidas se ignoran; nunca son motivo de rechazo. Un{' '}
                <code>message_type</code> que no manejas también se ignora — y eso es lo que permite que 1.x añada
                familias sin romper nada a nadie.
              </p>
            </div>
            <div className="card">
              <span className="kicker">05</span>
              <h3>
                <code>correlation_id</code> y <code>topic</code> son obligatorios
              </h3>
              <p className="small mb0">
                <code>correlation_id</code> enlaza todos los mensajes sobre el ciclo de vida de una Story.{' '}
                <code>topic</code> debe empezar por <code>som.</code> — más allá de eso, la estructura de topics es cosa
                tuya.
              </p>
            </div>
            <div className="card">
              <span className="kicker">+</span>
              <h3>Di qué produces y qué consumes</h3>
              <p className="small mb0">
                Las implementaciones deberían indicar qué familias publican y cuáles leen. Esa declaración, y no el
                tamaño de la implementación, es lo que necesita un integrador.{' '}
                <a href={repoFile('spec/conformance.md')} target="_blank" rel="noreferrer">
                  spec/conformance.md ↗
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="warning">
        <div className="wrap">
          <p className="eyebrow">Payload</p>
          <h2>
            <code>skill.warning.raised</code>
          </h2>
          <p className="lede" style={{ marginBottom: 28 }}>
            Lo que una skill declaró sobre una Story, puesto en el bus por el executor de la herramienta que la invocó.
            Doce campos obligatorios, un objeto cerrado y dos campos prohibidos explícitamente.
          </p>

          <FieldExplorer fields={WARNING_FIELDS} samples={WARNING_SAMPLES} />

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">El alcance es el nivel de disparo</span>
              <p className="small">
                <code>link:&#123;link_id&#125;</code> para una skill específica de un destino,{' '}
                <code>asset:&#123;asset_id&#125;</code> para un Asset, <code>story:&#123;story_id&#125;</code> para
                toda la Story.
              </p>
              <p className="small mb0">
                Una aprobación solo cuenta en el alcance en que se declaró el hold: una aprobación de <code>link</code>{' '}
                nunca levanta un hold de <code>story</code>.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Los timestamps viven en el envelope</span>
              <p className="small mb0">
                El payload de la advertencia rechaza tanto <code>timestamp</code> como el retirado{' '}
                <code>instance_ref</code>. Cuándo se levantó la advertencia lo dice el <code>timestamp</code> del
                envelope; qué la causó, el <code>causation_id</code> del envelope.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="migration">
        <div className="wrap">
          <p className="eyebrow">Migración</p>
          <h2>Si vienes de v0.3.2</h2>
          <p className="lede">
            1.0 es una ruptura limpia, y pequeña: deja de emitir tres campos retirados, emite{' '}
            <code>som_version: "1.0.0"</code> y activa la validación de formatos. Todos los demás campos, tipos, enums y
            restricciones siguen igual.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Retirado en 1.0</th>
                  <th>Qué era</th>
                </tr>
              </thead>
              <tbody>
                {WITHDRAWN.map(([field, why]) => (
                  <tr key={field}>
                    <td>
                      <code>{field}</code>
                    </td>
                    <td className="small">{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid g2" style={{ marginTop: 22, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Los identificadores cambiaron</span>
              <p className="small mb0">
                Cada <code>$id</code> de schema es ahora una URL resoluble que sirve el archivo, como{' '}
                <code className="url">{`${SCHEMA_BASE_URL}/story-context.schema.json`}</code>, estable durante toda la
                vida de 1.x. Los antiguos identificadores <code>som.spec/schema/v0.3…</code> nunca fueron resolubles.
              </p>
            </div>
            <div className="card">
              <span className="kicker">La estructura es plana</span>
              <p className="small mb0">
                Los tres directorios de versión desaparecen: un archivo por familia, sin versión en el nombre. Todo lo
                que se despachaba según <code>"v0.3.2"</code> en una ruta de schema debe seleccionar por familia.{' '}
                <code>authenticity_credential</code>, propuesto en v0.3.2, llega a 1.0 como normativo.
              </p>
            </div>
          </div>

          <p className="small muted" style={{ marginTop: 18 }}>
            <a href={repoFile('spec/migration-from-v0.3.2.md')} target="_blank" rel="noreferrer">
              spec/migration-from-v0.3.2.md ↗
            </a>{' '}
            ·{' '}
            <a href={repoFile('spec/compatibility-policy.md')} target="_blank" rel="noreferrer">
              spec/compatibility-policy.md ↗
            </a>
          </p>
        </div>
      </section>

      <section id="retired">
        <div className="wrap">
          <p className="eyebrow">Renombrados y retirados</p>
          <h2>Rutas antiguas que ya no validan</h2>
          <p className="lede">
            Si un productor o una configuración es anterior al cierre del envelope en v0.3, estos campos se han movido —
            o los rechazan los schemas de 1.0.
          </p>
          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Antes</th>
                  <th>Ahora</th>
                </tr>
              </thead>
              <tbody>
                {RETIRED.map(([oldPath, now]) => (
                  <tr key={oldPath}>
                    <td>
                      <code>{oldPath}</code>
                    </td>
                    <td>{now}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="extensions">
        <div className="wrap narrow">
          <p className="eyebrow">Extensions</p>
          <h2>El lugar definido para lo que el estándar no lleva</h2>
          <p>
            El envelope, la Story y todas las familias de eventos aceptan un objeto <code>extensions</code> cuyas claves
            deben coincidir con <code>com.&#123;vendor&#125;.</code> — cualquier otra cosa no pasa la validación. Los
            consumidores ignoran las claves que no reconocen.
          </p>
          <pre>{`{
  "warning_id":  "0190a000-0000-7000-8000-00000000000a",
  "skill_id":    "nbcu/editorial-standards",
  "scope":       "link:l1",
  "severity":    "flag",
  "detail":      "Informal term 'cops' in headline.",
  "extensions": {
    "com.nbcu.rationale": "Style guide proscribes informal register in headlines."
  }
}`}</pre>
          <ul className="clean">
            <li>
              Los <em>valores de enum</em> de fabricante siguen otra convención: <code>x-</code> más un token en
              minúsculas — <code>x-graphics_pack</code>. Se aplica a los registros gobernados pero ampliables, como{' '}
              <code>asset_type</code>, <code>source_type</code> y <code>transform_type</code>.
            </li>
            <li>
              Las etiquetas tienen su propio esquema de fabricante: <code>com.&#123;vendor&#125;.&#123;name&#125;</code>,
              junto a <code>newsroom</code> e <code>iptc-mediatopic</code>.
            </li>
          </ul>
          <p className="mb0">
            <Link to="/es/bus">Siguiente: las siete familias a las que pertenecen estos mensajes →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
