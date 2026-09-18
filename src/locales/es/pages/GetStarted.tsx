import { Link } from 'react-router-dom';
import { PageHead, useHashScroll } from '../../../components/Bits';
import {
  CONTACT_EMAIL,
  DEMOS_URL,
  EMULATOR_URL,
  INVOLVED_FORM_URL,
  SCHEMA_BASE_URL,
  SPEC_REPO_URL,
  repoDir,
  repoFile,
} from '../../../data/consortium';

export default function GetStarted() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Construir"
        title="Primeros pasos"
        lede="Lee los documentos breves, ejecuta el corpus de conformidad, valida tu propio mensaje con la validación de formatos activada y publícalo. Después elige un nivel y habla con el grupo de trabajo."
        toc={[
          { href: '#read', label: 'Lee primero' },
          { href: '#corpus', label: 'Ejecuta el corpus' },
          { href: '#validate', label: 'Valida en TypeScript' },
          { href: '#publish', label: 'Publica una Story' },
          { href: '#tiers', label: 'Niveles de integración' },
          { href: '#involved', label: 'Participa' },
        ]}
      />

      <section id="read">
        <div className="wrap">
          <p className="eyebrow">Paso 1</p>
          <h2>Lee cuatro cosas, en este orden</h2>
          <div className="grid g4" style={{ marginTop: 26 }}>
            <a className="card" href={repoFile('spec/introduction.md')} target="_blank" rel="noreferrer">
              <span className="kicker">01 · para todos</span>
              <h3>Introducción ↗</h3>
              <p className="small mb0">Por qué existe SOM, los tres sustantivos y los seis principios.</p>
            </a>
            <a className="card" href={repoFile('spec/conformance.md')} target="_blank" rel="noreferrer">
              <span className="kicker">02 · para implementadores</span>
              <h3>Conformidad ↗</h3>
              <p className="small mb0">Qué significa ser conforme con SOM 1.0 — más breve de lo que esperas.</p>
            </a>
            <a className="card" href={repoDir('examples/hurricane-run')} target="_blank" rel="noreferrer">
              <span className="kicker">03 · la imagen más clara</span>
              <h3>El caso del huracán ↗</h3>
              <p className="small mb0">Una Story contada a lo largo de siete snapshots.</p>
            </a>
            <a className="card" href={`${SCHEMA_BASE_URL}/story-context.schema.json`} target="_blank" rel="noreferrer">
              <span className="kicker">04 · tu primera familia</span>
              <h3>Schema story-context ↗</h3>
              <p className="small mb0">La familia que casi con toda seguridad implementarás primero.</p>
            </a>
          </div>
        </div>
      </section>

      <section id="corpus">
        <div className="wrap">
          <p className="eyebrow">Paso 2</p>
          <h2>Ejecuta el corpus de conformidad</h2>
          <p className="lede">
            El repositorio de la especificación incluye ejemplos prácticos que deben validar, veinte casos negativos que
            deben rechazarse y herramientas en Python puro que comprueban ambos.
          </p>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div>
              <pre>{`git clone ${SPEC_REPO_URL}.git
cd som
pip install jsonschema rfc3339-validator

python3 tools/validate.py            # every example is legal
python3 tools/validate_negative.py   # every negative case is rejected
python3 tools/som_lint.py schema     # schemas agree with their own claims
python3 tools/validate_sequence.py examples/hurricane-run
                                     # a story over time holds together`}</pre>
            </div>
            <div className="card">
              <span className="kicker">Cuatro preguntas distintas</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  ¿Es válido este mensaje? — <code>validate.py</code>
                </li>
                <li>
                  ¿Restringen de verdad los schemas? — <code>validate_negative.py</code>. Diecinueve casos fallan en los
                  schemas; el vigésimo, <code>som_version: "0.3.2"</code>, falla por la regla de versión en el cable,
                  que tu implementación debe aplicar por su cuenta.
                </li>
                <li>
                  ¿Coincide el schema con lo que dice de sí mismo? — <code>som_lint.py</code>
                </li>
                <li>
                  ¿Se sostiene una serie de snapshots? — <code>validate_sequence.py</code>, donde viven los errores
                  caros.
                </li>
              </ul>
            </div>
          </div>

          <div className="note warn" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Instala <code>rfc3339-validator</code>.</b> Sin él, el <code>jsonschema</code> de Python acepta en
              silencio un <code>timestamp</code> mal formado. El corpus negativo incluye ese caso precisamente para que
              la comprobación falle de forma ruidosa cuando falte el paquete.
            </p>
          </div>
        </div>
      </section>

      <section id="validate">
        <div className="wrap">
          <p className="eyebrow">Paso 3</p>
          <h2>Valida en tu propio stack — con los formatos validados</h2>
          <p className="lede">
            Dos implementaciones que no se ponen de acuerdo en si <code>message_id</code> debe ser un UUID no son
            interoperables. En Node, eso significa la versión 2020-12 de Ajv más <code>ajv-formats</code>.
          </p>
          <pre style={{ marginTop: 22 }}>{`// npm i ajv ajv-formats
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

const BASE = '${SCHEMA_BASE_URL}';
const FAMILY_SCHEMA: Record<string, string> = {
  'story.context': 'story-context',
  'skill.warning.raised': 'skill-warning',
  'delivery.media_available': 'delivery-media-available',
  'link.committed': 'link-event', 'link.gate_changed': 'link-event', 'link.withdrawn': 'link-event',
  'telling.started': 'telling-event', 'telling.ended': 'telling-event', 'telling.exposed': 'telling-event',
  'system.audit': 'system-audit',
};

const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv); // conformance §4: uuid and date-time MUST be asserted

const load = async (name: string) => (await fetch(\`\${BASE}/\${name}.schema.json\`)).json();

export async function validateMessage(msg: { som_version?: string; message_type?: string; payload?: unknown }) {
  const envelope = ajv.compile(await load('envelope'));
  if (!envelope(msg)) return { ok: false, errors: envelope.errors };

  // §3: 0.3.2 is not SOM 1.0 — and never branch on the version otherwise.
  if (msg.som_version?.startsWith('0.')) return { ok: false, errors: ['pre-1.0 som_version'] };

  // §2 and §5: dispatch on message_type only; ignore families you don't handle.
  const family = FAMILY_SCHEMA[msg.message_type ?? ''];
  if (!family) return { ok: true, ignored: true };

  const payload = ajv.compile(await load(family));
  return payload(msg.payload) ? { ok: true } : { ok: false, errors: payload.errors };
}`}</pre>
          <p className="small muted mb0">
            Ilustrativo, no una implementación de referencia — guarda en caché los validadores compilados en lugar de
            descargar los schemas en cada mensaje. Los schemas se sirven en la URL de su propio <code>$id</code>, así
            que resolverlos por identificador también funciona.
          </p>
        </div>
      </section>

      <section id="publish">
        <div className="wrap">
          <p className="eyebrow">Paso 4</p>
          <h2>Publica un snapshot de Story conforme</h2>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div>
              <pre>{`{
  "som_version": "1.0.0",
  "message_id": "0199a1c4-7a2e-7b31-8c55-4d2f9e6a1b07",
  "correlation_id": "0199a1c4-0000-7000-8000-000000000911",
  "message_type": "story.context",
  "timestamp": "2026-09-11T16:41:00.000000Z",
  "originating_system": {
    "system_id": "ncs-nyc-01", "system_type": "ncs"
  },
  "topic": "som.story.context.hurricane-2026-0911",
  "payload": {
    "story_id": "hurricane-2026-0911",
    "slug": "HURRICANE-LANDFALL",
    "headline": "Hurricane makes Cat 4 landfall",
    "story_type": "ACTIVE",
    "lifecycle": { "phase": "BREAKING",
                   "phase_entered_at": "2026-09-11T14:00:00Z" },
    "sequence_number": 7,
    "updated_at": "2026-09-11T16:41:00Z"
  }
}`}</pre>
            </div>
            <div className="card">
              <span className="kicker">Lista de comprobación para cada snapshot</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  Un <code>message_id</code> UUID nuevo (se recomienda v7); el mismo <code>correlation_id</code> durante
                  todo el ciclo de vida de la Story.
                </li>
                <li>
                  El mismo <code>story_id</code>, un <code>sequence_number</code> mayor, un{' '}
                  <code>updated_at</code> posterior.
                </li>
                <li>
                  <b>Todos los campos</b>, incluidos los que aportaron otros sistemas. Omitir significa ausente.
                </li>
                <li>
                  <code>lifecycle</code> presente si y solo si <code>story_type</code> es <code>ACTIVE</code>.
                </li>
                <li>
                  Tu propio <code>originating_system</code>, vuelto a sellar en cada publicación.
                </li>
                <li>
                  Todo lo que el estándar no lleva va en <code>extensions["com.&#123;vendor&#125;.…"]</code>.
                </li>
              </ul>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Míralo en un bus en vivo.</b> El{' '}
              <a href={EMULATOR_URL} target="_blank" rel="noreferrer">
                emulador ↗
              </a>{' '}
              del proyecto es un panel sobre un bus en funcionamiento que puedes usar tú mismo, y las{' '}
              <a href={DEMOS_URL} target="_blank" rel="noreferrer">
                demos del IBC ↗
              </a>{' '}
              muestran dos escenarios completos de principio a fin. Una implementación de referencia en .NET llegará en
              un repositorio aparte; el kit de inicio del hackathon, anterior a 1.0, emite <code>0.3.2</code> y no es
              tráfico 1.0.
            </p>
          </div>
        </div>
      </section>

      <section id="tiers">
        <div className="wrap">
          <p className="eyebrow">Unirse</p>
          <h2>No tienes que sacar nada de tu producto</h2>
          <p className="lede">Basta un sistema para empezar. Las integraciones se describen en tres niveles.</p>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <div className="lane-icon">1</div>
              <h3>Suscribirse y publicar</h3>
              <p className="small mb0">
                Lee la Story y pon tu propia familia en el bus. El proyecto lo calcula en días, no en meses.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">2</div>
              <h3>Contexto bidireccional</h3>
              <p className="small mb0">
                Tu herramienta consume y también aporta contexto estructurado — assertions, procedencia, links,
                Tellings.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">3</div>
              <h3>Decidir según la Story</h3>
              <p className="small mb0">
                Tu herramienta actúa de forma autónoma sobre lo que lee, mediante un executor que aplica las skills de
                la casa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="involved">
        <div className="wrap">
          <p className="eyebrow">Participa</p>
          <h2>El grupo de trabajo está abierto</h2>
          <div className="grid g3" style={{ marginTop: 26 }}>
            <a className="card" href={INVOLVED_FORM_URL} target="_blank" rel="noreferrer">
              <h3>Manifiesta tu interés ↗</h3>
              <p className="small">
                Desarrolla sobre él, escribe skills, organiza una sesión de Story Archaeology, únete al grupo de
                trabajo o simplemente sigue el trabajo — el formulario oficial pregunta quién eres y qué quieres hacer.
              </p>
              <span className="more">formulario de storyobjectmodel.com →</span>
            </a>
            <a className="card" href={repoFile('GOVERNANCE.md')} target="_blank" rel="noreferrer">
              <h3>Propón un cambio ↗</h3>
              <p className="small">
                Todo cambio llega como pull request, y cualquiera puede abrir uno. Los cambios de schema están sujetos
                a la política de compatibilidad; las preguntas abiertas viven en el registro abierto.
              </p>
              <span className="more">GOVERNANCE · CONTRIBUTING →</span>
            </a>
            <a className="card" href={`mailto:${CONTACT_EMAIL}`}>
              <h3>Consulta una integración</h3>
              <p className="small">
                Para todo lo que el README del repositorio no responda, escribe al proyecto.
              </p>
              <span className="more">{CONTACT_EMAIL} →</span>
            </a>
          </div>

          <div className="note" style={{ marginTop: 26 }}>
            <p className="mb0">
              <b>Los schemas mandan.</b> Cuando cualquier texto — este sitio incluido — contradice un schema publicado,
              el schema tiene razón. <Link to="/es/bus">Explora las siete familias →</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
