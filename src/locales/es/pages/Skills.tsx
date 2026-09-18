import { Link } from 'react-router-dom';
import { PageHead, useHashScroll } from '../../../components/Bits';
import { CATEGORY_X, GUARANTEES, LIBRARY, LIBRARY_VERSION } from '../data/skills';
import { AGENTSKILLS_URL, repoDir, repoFile } from '../../../data/consortium';

export default function Skills() {
  useHashScroll();

  const published = LIBRARY.filter((s) => !s.proposed);
  const proposed = LIBRARY.filter((s) => s.proposed);

  return (
    <>
      <PageHead
        eyebrow="Referencia · som-skill-library"
        title="Skills"
        lede="SOM lleva el contexto; las skills llevan el conocimiento. Una skill es una regla escrita una sola vez, por la redacción, y legible por todas las herramientas. Declara lo que es cierto — la herramienta dueña del executor es la única que actúa."
        toc={[
          { href: '#model', label: 'Declarar, no actuar' },
          { href: '#anatomy', label: 'Anatomía' },
          { href: '#library', label: 'La biblioteca' },
          { href: '#combine', label: 'Cómo se combinan los holds' },
          { href: '#checks', label: 'Validación' },
          { href: '#open', label: 'Lo que sigue abierto' },
        ]}
      />

      <section id="model">
        <div className="wrap">
          <p className="eyebrow">El modelo</p>
          <h2>Las skills declaran. Los executors actúan.</h2>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <div className="lane-icon">1</div>
              <h3>La skill declara</h3>
              <p className="small mb0">
                Un archivo de skill enuncia una condición y lo que es cierto cuando se cumple — un flag sigue en pie, se
                aplica un hold, se justifica un enriquecimiento. Nunca ejecuta nada, nunca escribe el estado de la Story
                y nunca cambia el contenido.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">2</div>
              <h3>El executor invoca (recall)</h3>
              <p className="small mb0">
                Los executors viven dentro de las herramientas de los fabricantes. Cada uno compara los mensajes
                entrantes con los <b>adverts</b> de las skills — el bloque <code>recall</code>, legible por máquina — y
                publica lo que la skill declara como <code>skill.warning.raised</code>.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">3</div>
              <h3>La herramienta actúa</h3>
              <p className="small mb0">
                El MAM impide vincular un Asset retenido, el playout rechaza el paso a antena, el CMS retiene una
                ruta. Cada uno a su manera, y cada uno decidiendo por sí mismo. Nadie recibe una orden.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Forma abierta, política de la casa.</b> Las skills siguen el formato abierto{' '}
              <a href={AGENTSKILLS_URL} target="_blank" rel="noreferrer">
                agentskills.io ↗
              </a>
              : un archivo markdown con frontmatter YAML. La biblioteca compartida es genérica; cada redacción carga
              sobre ella sus propios valores. Tu política sigue siendo tuya, y una redacción puede implementar SOM 1.0
              por completo sin usar la biblioteca en absoluto.
            </p>
          </div>
        </div>
      </section>

      <section id="anatomy">
        <div className="wrap">
          <p className="eyebrow">Anatomía</p>
          <h2>Un archivo: frontmatter para las máquinas, prosa para las personas</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div>
              <pre>{`---
skill_id: smart-stories/hold-while-flagged
skill_version: ${LIBRARY_VERSION}
som_schema_version: ["1.0.0"]
skill_type: REFERENCE
category: compliance
lifecycle: draft

recall:                      # the advert
  target_system_type: [mam, playout, rundown,
                       cms, compliance_hub]
  conditions:
    - kind: field
      path: editorial_gates[].gate_type
      op: equals
      value: "{{ config.gate_type }}"
    - kind: field
      path: editorial_gates[].status
      op: equals
      value: PENDING
  recall_on: ["story.context", …]
  state_path: editorial_gates[].status

output_messages: ["skill.warning.raised"]
severity_range: [hold]
auto_change_content: false
fail_closed: true
migration_policy: GATED
disclosure_level: L2
depends: []
---
# hold-while-flagged
…what it is, config surface, runtime loop,
 output contract, worked configurations,
 eval set, open items, vendor build notes`}</pre>
            </div>
            <div>
              <div className="card" style={{ marginBottom: 16 }}>
                <span className="kicker">Identidad</span>
                <p className="small mb0">
                  <code>skill_id</code> como <code>publisher/name</code>, un <code>skill_version</code> semver, las
                  versiones de schema de SOM contra las que se resuelve, una <code>category</code> y un{' '}
                  <code>lifecycle</code>.
                </p>
              </div>
              <div className="card" style={{ marginBottom: 16 }}>
                <span className="kicker">El advert</span>
                <p className="small mb0">
                  <code>recall</code> indica qué tipos de herramienta pueden recoger la skill, las condiciones sobre
                  rutas de la Story (<code>field</code> y <code>field_change</code>) y qué mensajes provocan una
                  revisión. Las rutas son literales y se comprueban contra el schema publicado; los valores pueden
                  tomarse como plantilla de la configuración de la casa.
                </p>
              </div>
              <div className="card" style={{ marginBottom: 16 }}>
                <span className="kicker">Instancia configurada</span>
                <p className="small mb0">
                  Un archivo genérico con los valores de una casa cargados, vigilando una condición. Una casa ejecuta
                  varias a partir del mismo archivo — una restricción judicial con alcance <code>story</code>, una cifra
                  sin confirmar con alcance <code>link</code> — y registra una fila de advert por cada instancia
                  configurada.
                </p>
              </div>
              <div className="card">
                <span className="kicker">Severidad</span>
                <p className="small mb0">
                  <code>hold</code> / <code>flag</code> / <code>inform</code>, en minúsculas para siempre. Una skill
                  declara en <code>severity_range</code> cuáles de ellas puede producir.
                </p>
              </div>
            </div>
          </div>

          <div className="table-scroll" style={{ marginTop: 26 }}>
            <table>
              <thead>
                <tr>
                  <th>Garantía</th>
                  <th>Valor</th>
                  <th>Qué significa</th>
                </tr>
              </thead>
              <tbody>
                {GUARANTEES.map((g) => (
                  <tr key={g.field}>
                    <td>
                      <code>{g.field}</code>
                    </td>
                    <td>
                      <code>{g.value}</code>
                    </td>
                    <td className="small">{g.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="library">
        <div className="wrap">
          <p className="eyebrow">som-skill-library {LIBRARY_VERSION}</p>
          <h2>Diez skills de referencia y una propuesta</h2>
          <p className="lede">
            Todas <code>lifecycle: draft</code>, <code>origin: reference</code>, resueltas contra SOM 1.0. Busca tu tipo
            de herramienta en la tabla de consulta, lee las skills de esa fila y configúralas para tu casa.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Declara</th>
                  <th>Categoría</th>
                  <th>Severidad</th>
                  <th>Invocada por</th>
                </tr>
              </thead>
              <tbody>
                {[...published, ...proposed].map((s) => (
                  <tr key={s.name}>
                    <td>
                      <a href={repoFile(`skills/skills/${s.name}.md`)} target="_blank" rel="noreferrer">
                        <code>{s.name}</code>
                      </a>
                      {s.proposed && (
                        <div style={{ marginTop: 4 }}>
                          <span className="tag soon">propuesta</span>
                        </div>
                      )}
                    </td>
                    <td className="small" style={{ minWidth: 280 }}>
                      {s.declares}
                    </td>
                    <td className="small">
                      {s.category} <span className="muted">· X={CATEGORY_X[s.category]}</span>
                    </td>
                    <td>
                      {s.severities.map((sev) => (
                        <span key={sev} className={`tag ${sev}`} style={{ marginRight: 4 }}>
                          {sev}
                        </span>
                      ))}
                    </td>
                    <td className="small" style={{ minWidth: 150 }}>
                      {s.targets.map((t) => (
                        <div key={t}>
                          <code>{t}</code>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="small muted" style={{ marginTop: 16 }}>
            <a href={repoFile('skills/docs/LOOKUP-TABLE.md')} target="_blank" rel="noreferrer">
              Tabla de consulta ↗
            </a>{' '}
            ·{' '}
            <a href={repoFile('skills/docs/CONVENTIONS.md')} target="_blank" rel="noreferrer">
              Convenciones ↗
            </a>{' '}
            ·{' '}
            <a href={repoDir('skills/skills')} target="_blank" rel="noreferrer">
              Todos los archivos de skills ↗
            </a>
          </p>
        </div>
      </section>

      <section id="combine">
        <div className="wrap">
          <p className="eyebrow">Cuando las skills se encuentran</p>
          <h2>Los holds se combinan por conjunción</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Basta un hold para retener</span>
              <p className="small">
                Cuando varios gates condicionan el mismo hecho en el mismo Telling, solo se sirve cuando todos lo
                permiten. «Gana el más restrictivo» y «el propietario de la Story tiene prioridad» se retiraron
                formalmente el 29 de julio de 2026.
              </p>
              <p className="small mb0">
                La precedencia entre dos skills que chocan en la misma acción es otra cuestión, y se ordena por{' '}
                <b>X</b> (categoría: compliance 1, editorial 2, workflow 3), <b>Y</b> (origen — todas las skills de la
                biblioteca son 5) y <b>Z</b>, que solo fija la casa que publica.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Encadenamiento a través del bus</span>
              <p className="small">
                Una skill que declarara un estado y además retuviera algo ocuparía dos posiciones a la vez. Por eso
                «marcar y retener» son dos skills: <code>flag-on-mismatch</code> declara el flag, y{' '}
                <code>hold-while-flagged</code> se anuncia contra el estado del flag — lo haya levantado quien lo haya
                levantado, una skill o un abogado.
              </p>
              <p className="small mb0">
                Por eso <code>depends</code> está vacío en todas partes: declarar una dependencia la invertiría y
                crearía un ciclo en el primer cambio de versión.
              </p>
            </div>
          </div>

          <div className="grid g2" style={{ marginTop: 18, alignItems: 'start' }}>
            <div className="note warn">
              <p className="mb0">
                <b>Fail-closed.</b> Un valor de configuración o de la Story que no se puede leer se trata como si la
                condición se cumpliera, con la severidad más alta que tenga la skill, y <code>detail</code> indica qué
                no se pudo leer. Si una regla no se puede evaluar, la salida que protege sigue retenida y decide una
                persona.
              </p>
            </div>
            <div className="note">
              <p className="mb0">
                <b>Lo que no levanta un hold:</b> el paso del tiempo, que el flag simplemente no aparezca en un snapshot
                posterior, una aprobación en otro alcance, una autoridad inferior, un reinicio del executor o la
                aprobación de otro flag. Liberar un hold nunca es una instrucción de liberar el Asset.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="checks">
        <div className="wrap">
          <p className="eyebrow">Validación</p>
          <h2>La biblioteca se comprueba a sí misma</h2>
          <p className="lede">
            La biblioteca incluye cinco scripts, y cada uno responde a una pregunta distinta — incluida la de si los
            documentos coinciden con los archivos que describen.
          </p>
          <pre style={{ marginTop: 22 }}>{`cd som/skills
python3 scripts/validate_som_skill.py skills/<name>.md   # one skill file is legal
python3 scripts/check_library.py skills/                  # the library holds together
python3 scripts/check_paths.py skills/                    # every path resolves against
                                                          #   ../schema/story-context.schema.json
python3 scripts/build_lookup_table.py . --check           # the table matches the adverts
python3 scripts/check_cover_claims.py .                   # the docs match the files`}</pre>
          <p className="small muted">
            Hay un hueco que se nombra en lugar de ocultarse: <code>check_paths.py</code> solo resuelve rutas literales.
            Un valor <code>{'{{ config.* }}'}</code> es imposible de conocer hasta que una casa lo configura, así que
            detectar una ruta configurada incorrecta es trabajo de la casa en el momento del registro.
          </p>
        </div>
      </section>

      <section id="open">
        <div className="wrap narrow">
          <p className="eyebrow">Abierto, con honestidad</p>
          <h2>Lo que la biblioteca no pretende resolver</h2>
          <ul className="clean">
            <li>
              <b>Cómo se compara la autoridad.</b> «Aprobado por una autoridad igual o superior en el mismo alcance» es
              la posición de trabajo de la biblioteca, con el orden que aporta cada casa como{' '}
              <code>authority_scale</code>. Ningún grupo lo ha ratificado.
            </li>
            <li>
              <b>Quién convierte una advertencia levantada en estado de gate.</b> Una skill de tipo raise solo publica
              una advertencia; una skill de tipo hold lee <code>editorial_gates[]</code>. Qué materializa una cosa en la
              otra aún no está definido.
            </li>
            <li>
              <b>Coincidencia de etiquetas calificadas por esquema.</b> Hoy las skills comparan{' '}
              <code>tags[].value</code> sin tener en cuenta el esquema; sigue abierto si deben coincidir con{' '}
              <code>newsroom:sport</code> en lugar de con <code>sport</code>.
            </li>
            <li>
              <b>Configuración de la demo.</b> Las instancias configuradas que se usaron en el recorrido del IBC nombran
              a fabricantes concretos y no se publican en 1.0, a la espera del visto bueno de cada fabricante.
            </li>
          </ul>
          <p className="mb0">
            <Link to="/es/get-started">Siguiente: valida y publica tu primer mensaje →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
