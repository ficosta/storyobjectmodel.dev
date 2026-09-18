import { Link } from 'react-router-dom';
import { PageHead, useHashScroll } from '../../../components/Bits';
import { FAMILIES } from '../data/envelope';
import { SCHEMA_BASE_URL } from '../../../data/consortium';

export default function Bus() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Referencia · SOM 1.0"
        title="Las siete familias de mensajes"
        lede="Todo lo normativo de SOM son siete JSON Schemas: el envelope, la Story y cinco familias para links, Tellings, llegadas de medios, auditoría y advertencias de skills. Cada uno se sirve en una URL que no cambiará durante toda la vida de 1.x."
        toc={[
          { href: '#families', label: 'Las familias' },
          { href: '#story', label: 'story.context' },
          { href: '#delivery', label: 'Llegadas de medios' },
          { href: '#linktelling', label: 'Links y Tellings' },
          { href: '#audit', label: 'Auditoría' },
          { href: '#roles', label: 'Qué implementar' },
        ]}
      />

      <section id="families">
        <div className="wrap">
          <p className="eyebrow">Schemas</p>
          <h2>Todo lo que viaja por el cable</h2>
          <p className="lede">
            La mayoría de las familias son opcionales: implementa el envelope y las familias sobre las que tengas algo
            que decir. La estructura de los nombres de topic es cosa tuya — la única regla es el prefijo{' '}
            <code>som.</code>, y los consumidores despachan según <code>message_type</code>, nunca según el topic.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Familia</th>
                  <th>message_type</th>
                  <th>Publicado por</th>
                  <th>Schema</th>
                </tr>
              </thead>
              <tbody>
                {FAMILIES.map((f) => (
                  <tr key={f.name}>
                    <td>
                      <code>{f.name}</code>
                      <div className="small muted" style={{ marginTop: 4 }}>
                        {f.purpose}
                      </div>
                    </td>
                    <td>
                      {f.messageTypes.map((m) => (
                        <div key={m}>
                          <code>{m}</code>
                        </div>
                      ))}
                    </td>
                    <td className="small">{f.publishedBy}</td>
                    <td className="small">
                      <a href={`${SCHEMA_BASE_URL}/${f.schema}`} target="_blank" rel="noreferrer">
                        <code>{f.schema}</code> ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <pre style={{ marginTop: 22 }}>{`# check one message from the command line
pip install jsonschema rfc3339-validator
curl -sO ${SCHEMA_BASE_URL}/story-context.schema.json`}</pre>
        </div>
      </section>

      <section id="story">
        <div className="wrap">
          <p className="eyebrow">La familia que implementas primero</p>
          <h2>
            <code>story.context</code>
          </h2>
          <p className="lede">
            El estado completo de una Story en un momento dado. Obligatorios: <code>story_id</code>, <code>slug</code>,{' '}
            <code>headline</code>, <code>story_type</code>, <code>sequence_number</code>, <code>updated_at</code> —
            más <code>lifecycle</code> cuando la Story es <code>ACTIVE</code>. Todo lo demás es opcional, y el objeto
            es cerrado.
          </p>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div>
              <pre>{`{
  "story_id": "hurricane-2026-0911",
  "slug": "HURRICANE-GULF",
  "headline": "Hurricane upgraded to Cat 4 after landfall",
  "story_type": "ACTIVE",
  "lifecycle": { "phase": "BREAKING",
                 "phase_entered_at": "2026-09-11T16:24:00Z" },
  "sequence_number": 4,
  "updated_at": "2026-09-11T16:26:00Z",
  "tags": [
    { "scheme": "iptc-mediatopic", "value": "17000000",
      "label": "weather" },
    { "scheme": "newsroom", "value": "us-desk" }
  ],
  "editorial_source": [ { "source_id": "src-ap-wire",
    "source_type": "WIRE", "provider": "AP",
    "credibility": "TRUSTED", "received_at": "…" } ]
}`}</pre>
            </div>
            <div className="card">
              <span className="kicker">Qué más puede llevar una Story</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  <code>tags[]</code> — <em>de qué</em> trata la Story. Ordenadas (la primera es la principal) y
                  calificadas por esquema: <code>newsroom</code>, <code>iptc-mediatopic</code> o{' '}
                  <code>com.&#123;vendor&#125;.&#123;name&#125;</code>.
                </li>
                <li>
                  <code>priority</code>, <code>premise</code> (resultado esperado, confianza, si cambió y a qué Assets
                  afecta), <code>story_meaning</code> (un núcleo 5W1H acotado).
                </li>
                <li>
                  <code>assets[]</code> con <code>media_refs[]</code>, <code>provenance</code>,{' '}
                  <code>standards_clearance</code>, <code>authenticity_credential</code> y el índice inverso{' '}
                  <code>usage[]</code>.
                </li>
                <li>
                  <code>assertions[]</code>, flags de <code>compliance[]</code> (con un <code>media_range</code>{' '}
                  opcional que fija los fotogramas restringidos) y <code>editorial_gates[]</code>.
                </li>
                <li>
                  <code>government_approval</code> — un gate de publicación que el executor no debe sobrepasar mientras
                  bloquee.
                </li>
                <li>
                  <code>skills_config</code>, <code>content_refs[]</code>, <code>relations[]</code>,{' '}
                  <code>collaboration</code>, <code>extensions</code>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="delivery">
        <div className="wrap">
          <p className="eyebrow">Llegadas de medios</p>
          <h2>
            <code>delivery.media_available</code>
          </h2>
          <p className="lede">
            Un almacén que anuncia que han llegado medios. Eso es todo lo que hace: sin bytes, sin credenciales y, a
            propósito, sin <code>story_id</code> — la resolución <code>asset_id → Asset → Story</code> se hace a partir
            del flujo de Stories.
          </p>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div>
              <pre>{`// a TAMS store
{
  "message_type": "delivery.media_available",
  "delivery_id":  "0190a000-0000-7000-8000-00000000aaa1",
  "asset_id":     "asset-presser-feed",
  "source":       "tams://tams-gcp-store/9f2e7c1a",
  "time_range":   "[0:0_1260:0)",
  "arrived_in":   "tams-gcp-store",
  "arrived_at":   "2026-09-11T16:30:00Z"
}

// any other store
{
  "message_type": "delivery.media_available",
  "delivery_id":  "0190a000-0000-7000-8000-00000000ccc1",
  "asset_id":     "asset-still-embassy",
  "locator": { "store": "image-mam",
               "ref":   "stills/2026/07/embassy-front-04.jpg" },
  "arrived_in":   "image-mam",
  "arrived_at":   "2026-07-09T15:00:00Z"
}`}</pre>
            </div>
            <div className="card">
              <span className="kicker">Las reglas</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  Se exige <code>source</code> o <code>locator</code>. Un <code>source</code> es una URI de TAMS Source
                  totalmente calificada, <code>tams://store/id</code> — Sources, nunca Flows.
                </li>
                <li>
                  <code>time_range</code> es un timerange de TAMS: límites <code>seconds:nanoseconds</code> entre
                  corchetes, con inicio o final abiertos permitidos — una señal que aún se está grabando es{' '}
                  <code>[0:0_)</code>.
                </li>
                <li>
                  Frente a un localizador, un rango se mide desde el cero propio del archivo almacenado, nunca desde el
                  timecode de origen incrustado.
                </li>
                <li>
                  La vinculación de medios a una Story ocurre en el acto editorial, nunca en la ingesta. Un clip que no
                  coincide con ninguna Story se guarda en una Story contenedora <code>ORPHAN</code> hasta que se
                  confirma una coincidencia propuesta.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="linktelling">
        <div className="wrap">
          <p className="eyebrow">Distribución</p>
          <h2>Links y Tellings</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">som.link.*</span>
              <h3>Asset ↔ destino</h3>
              <p className="small">
                <code>link.committed</code>, <code>link.gate_changed</code>, <code>link.withdrawn</code>. Cada evento
                lleva <code>link_id</code>, <code>asset_id</code>, <code>destination_id</code> y un{' '}
                <code>compliance_gate_status</code> <code>PENDING</code>, <code>CLEARED</code> o{' '}
                <code>BLOCKED</code>. Una vinculación indica quién y cuándo; una retirada, quién, cuándo y por qué.
              </p>
              <p className="small mb0">
                El gate es <b>por destino</b>, así que un mismo Asset puede estar aprobado para digital y bloqueado para
                emisión a la vez. El <code>assets[].usage[]</code> de la Story se mantiene exclusivamente a partir de
                estos eventos — solo lo vinculado, y fail-closed.
              </p>
            </div>
            <div className="card">
              <span className="kicker">som.telling.*</span>
              <h3>Exposición</h3>
              <p className="small">
                <code>telling.started</code> (exige <code>exposure_start</code>, prohíbe <code>exposure_end</code>),{' '}
                <code>telling.ended</code>, y <code>telling.exposed</code> para una exposición instantánea que lleva
                ambos. Los tiempos de exposición son inmutables; <code>scheduled_start</code> es mutable y nunca se usa
                para derivar el estado «al aire».
              </p>
              <p className="small mb0">
                <code>transforms[]</code> registra las adaptaciones en el borde — <code>CROP</code>, <code>TRIM</code>,{' '}
                <code>CAPTION_BURN</code> o un valor de fabricante <code>x-</code> — en orden de aplicación y solo por
                adición. Una transformación nunca levanta un hold de <code>compliance[].media_range</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="audit">
        <div className="wrap narrow">
          <p className="eyebrow">Gobernanza</p>
          <h2>
            <code>som.system.audit</code> — el rastro
          </h2>
          <pre>{`{
  "audit_id":    "0190e000-0008-7000-8000-0000000000f3",
  "action":      "SUPPRESSED",
  "target":      { "kind": "ASSET", "id": "pkg-acquit" },
  "actor":       { "actor_id": "automation-01", "actor_type": "system" },
  "reason":      "Acquit package suppressed; never linked to air",
  "recorded_at": "2026-06-23T14:30:02.000000Z"
}`}</pre>
          <ul className="clean">
            <li>
              <code>action</code> es uno de <code>CLEARED</code>, <code>SUPPRESSED</code>, <code>WITHHELD</code>,{' '}
              <code>OVERRIDDEN</code>; <code>target.kind</code> es <code>LINK</code>, <code>ASSET</code> o{' '}
              <code>TELLING</code>.
            </li>
            <li>
              El actor es un objeto, nunca una cadena plana. Una supresión apunta al Asset retenido — la rama que nunca
              sale al aire nunca recibe un link.
            </li>
            <li>
              Distinto de los registros de ejecución de skills. Registra la gobernanza: aprobaciones, supresiones,
              retenciones y anulaciones, con quién y por qué.
            </li>
          </ul>
        </div>
      </section>

      <section id="roles">
        <div className="wrap">
          <p className="eyebrow">Integración</p>
          <h2>Qué implementas, según tu papel</h2>
          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Eres…</th>
                  <th>Publicas</th>
                  <th>Lees</th>
                  <th>Cuidado con</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>Propietario de la Story</b>
                    <br />
                    <span className="muted small">NCS, planificación</span>
                  </td>
                  <td>
                    <code>story.context</code>
                  </td>
                  <td>
                    <code>skill.warning.raised</code>, assertions de otros
                  </td>
                  <td className="small">
                    Todos los campos en cada snapshot. <code>story_id</code> inmutable, <code>sequence_number</code>{' '}
                    creciente, <code>originating_system</code> vuelto a sellar.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Herramienta con executor</b>
                    <br />
                    <span className="muted small">escaleta, MAM, CMS, playout, grafismo</span>
                  </td>
                  <td>
                    <code>skill.warning.raised</code>
                  </td>
                  <td>
                    <code>story.context</code>
                  </td>
                  <td className="small">
                    Tu herramienta decide qué retiene. Nunca edites contenido para liberar un hold, y nunca muestres un
                    hold como un aviso con un botón de «publicar de todos modos».
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Almacén de medios</b>
                    <br />
                    <span className="muted small">TAMS, MAM</span>
                  </td>
                  <td>
                    <code>delivery.media_available</code>
                  </td>
                  <td>—</td>
                  <td className="small">
                    URIs de Source, no ids de Flow — o un localizador. Vuelve a anunciar con un <code>time_range</code>{' '}
                    creciente mientras continúe la captura.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Sistema que vincula / expone</b>
                    <br />
                    <span className="muted small">CMS, playout, redes sociales</span>
                  </td>
                  <td>
                    <code>som.link.*</code>, <code>som.telling.*</code>
                  </td>
                  <td>
                    <code>story.context</code>
                  </td>
                  <td className="small">
                    Estado del gate por destino. Los tiempos de exposición se sellan en el evento y son inmutables.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Actor de gobernanza</b>
                    <br />
                    <span className="muted small">estándares, legal, automatización</span>
                  </td>
                  <td>
                    <code>som.system.audit</code>
                  </td>
                  <td>todo lo relevante</td>
                  <td className="small">Los actores son objetos. Registra el motivo.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: 24 }}>
            <Link to="/es/skills">Siguiente: cómo se invoca una skill →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
