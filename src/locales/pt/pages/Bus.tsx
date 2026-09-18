import { Link } from 'react-router-dom';
import { PageHead, useHashScroll } from '../../../components/Bits';
import { FAMILIES } from '../data/envelope';
import { SCHEMA_BASE_URL } from '../../../data/consortium';

export default function Bus() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Referência · SOM 1.0"
        title="As sete famílias de mensagens"
        lede="Tudo o que é normativo no SOM cabe em sete JSON Schemas: o envelope, a história e cinco famílias para links, tellings, chegada de mídia, auditoria e avisos de skills. Cada um é servido numa URL que não muda durante toda a vida da 1.x."
        toc={[
          { href: '#families', label: 'As famílias' },
          { href: '#story', label: 'story.context' },
          { href: '#delivery', label: 'Chegada de mídia' },
          { href: '#linktelling', label: 'Links e tellings' },
          { href: '#audit', label: 'Auditoria' },
          { href: '#roles', label: 'O que implementar' },
        ]}
      />

      <section id="families">
        <div className="wrap">
          <p className="eyebrow">Schemas</p>
          <h2>Tudo o que passa pelo fio</h2>
          <p className="lede">
            A maioria das famílias é opcional: implemente o envelope e as famílias sobre as quais você tem algo a dizer.
            A organização dos nomes de topic é com você — a única regra é o prefixo <code>som.</code>, e os consumidores
            despacham por <code>message_type</code>, nunca pelo topic.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Família</th>
                  <th>message_type</th>
                  <th>Publicada por</th>
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
          <p className="eyebrow">A família que você implementa primeiro</p>
          <h2>
            <code>story.context</code>
          </h2>
          <p className="lede">
            O estado completo de uma história num dado momento. Obrigatórios: <code>story_id</code>, <code>slug</code>,{' '}
            <code>headline</code>, <code>story_type</code>, <code>sequence_number</code>, <code>updated_at</code> —
            mais <code>lifecycle</code> quando a história é <code>ACTIVE</code>. Todo o resto é opcional, e o
            objeto é fechado.
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
              <span className="kicker">O que mais uma história pode carregar</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  <code>tags[]</code> — do <em>que</em> trata a história. Ordenadas (a primeira é a principal) e
                  qualificadas por esquema: <code>newsroom</code>, <code>iptc-mediatopic</code> ou{' '}
                  <code>com.&#123;vendor&#125;.&#123;name&#125;</code>.
                </li>
                <li>
                  <code>priority</code>, <code>premise</code> (desfecho esperado, grau de confiança, se ele mudou e
                  quais assets isso afeta), <code>story_meaning</code> (um núcleo 5W1H com limite de tamanho).
                </li>
                <li>
                  <code>assets[]</code> com <code>media_refs[]</code>, <code>provenance</code>,{' '}
                  <code>standards_clearance</code>, <code>authenticity_credential</code> e o índice reverso{' '}
                  <code>usage[]</code>.
                </li>
                <li>
                  <code>assertions[]</code>, flags de <code>compliance[]</code> (com um <code>media_range</code>{' '}
                  opcional que marca os quadros restritos) e <code>editorial_gates[]</code>.
                </li>
                <li>
                  <code>government_approval</code> — um gate de publicação que o executor não pode ultrapassar enquanto
                  ele estiver bloqueando.
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
          <p className="eyebrow">Chegada de mídia</p>
          <h2>
            <code>delivery.media_available</code>
          </h2>
          <p className="lede">
            Um repositório anunciando que uma mídia chegou. É só isso que ele faz: sem bytes, sem credenciais e,
            de propósito, sem <code>story_id</code> — você resolve <code>asset_id → Asset → Story</code> a partir do
            fluxo de histórias.
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
              <span className="kicker">As regras</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  É obrigatório um entre <code>source</code> e <code>locator</code>. Um <code>source</code> é uma URI
                  de Source TAMS totalmente qualificada, <code>tams://store/id</code> — Sources, nunca Flows.
                </li>
                <li>
                  <code>time_range</code> é um timerange TAMS: limites <code>seconds:nanoseconds</code> entre
                  colchetes, com início ou fim em aberto permitidos — um feed ainda gravando é <code>[0:0_)</code>.
                </li>
                <li>
                  Com um locator, o intervalo é contado a partir do zero do próprio arquivo armazenado, nunca do
                  timecode de origem embutido.
                </li>
                <li>
                  A vinculação da mídia a uma história acontece no ato editorial, nunca na ingestão. Um clipe que não
                  corresponde a nenhuma história fica numa história-casca <code>ORPHAN</code> até que uma
                  correspondência proposta seja confirmada.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="linktelling">
        <div className="wrap">
          <p className="eyebrow">Distribuição</p>
          <h2>Links e tellings</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">som.link.*</span>
              <h3>Asset ↔ destino</h3>
              <p className="small">
                <code>link.committed</code>, <code>link.gate_changed</code>, <code>link.withdrawn</code>. Todo evento
                carrega <code>link_id</code>, <code>asset_id</code>, <code>destination_id</code> e um{' '}
                <code>compliance_gate_status</code> igual a <code>PENDING</code>, <code>CLEARED</code> ou{' '}
                <code>BLOCKED</code>. Um commit diz quem e quando; uma retirada diz quem, quando e por quê.
              </p>
              <p className="small mb0">
                O gate é <b>por destino</b>, então um mesmo asset pode estar liberado para o digital e bloqueado para a
                TV ao mesmo tempo. O <code>assets[].usage[]</code> da história é mantido exclusivamente a partir desses
                eventos — só o que foi vinculado, e fail-closed.
              </p>
            </div>
            <div className="card">
              <span className="kicker">som.telling.*</span>
              <h3>Exposição</h3>
              <p className="small">
                <code>telling.started</code> (exige <code>exposure_start</code>, proíbe <code>exposure_end</code>),{' '}
                <code>telling.ended</code> e <code>telling.exposed</code> para uma exposição instantânea que carrega
                os dois. Os horários de exposição são imutáveis; <code>scheduled_start</code> é mutável e nunca é usado
                para derivar o estado no ar.
              </p>
              <p className="small mb0">
                <code>transforms[]</code> registra as remodelagens na ponta — <code>CROP</code>, <code>TRIM</code>,{' '}
                <code>CAPTION_BURN</code> ou um valor de fornecedor <code>x-</code> — na ordem de aplicação, só por
                acréscimo. Uma transformação nunca derruba um hold de <code>compliance[].media_range</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="audit">
        <div className="wrap narrow">
          <p className="eyebrow">Governança</p>
          <h2>
            <code>som.system.audit</code> — a trilha
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
              <code>action</code> é um de <code>CLEARED</code>, <code>SUPPRESSED</code>, <code>WITHHELD</code>,{' '}
              <code>OVERRIDDEN</code>; <code>target.kind</code> é <code>LINK</code>, <code>ASSET</code> ou{' '}
              <code>TELLING</code>.
            </li>
            <li>
              O ator é um objeto, nunca uma string simples. Uma supressão tem como alvo o asset retido — o ramo que
              nunca vai ao ar nunca ganha um link.
            </li>
            <li>
              É distinto dos registros de execução de skills. Registra a governança: liberações, supressões, retenções
              e overrides, com quem e por quê.
            </li>
          </ul>
        </div>
      </section>

      <section id="roles">
        <div className="wrap">
          <p className="eyebrow">Integração</p>
          <h2>O que você implementa, por papel</h2>
          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Você é…</th>
                  <th>Publica</th>
                  <th>Lê</th>
                  <th>Cuidado com</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>Dono da história</b>
                    <br />
                    <span className="muted small">NCS, pauta</span>
                  </td>
                  <td>
                    <code>story.context</code>
                  </td>
                  <td>
                    <code>skill.warning.raised</code>, assertions de terceiros
                  </td>
                  <td className="small">
                    Todos os campos em todo snapshot. <code>story_id</code> imutável, <code>sequence_number</code>{' '}
                    crescente, <code>originating_system</code> carimbado de novo.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Ferramenta com um executor</b>
                    <br />
                    <span className="muted small">espelho, MAM, CMS, playout, grafismo</span>
                  </td>
                  <td>
                    <code>skill.warning.raised</code>
                  </td>
                  <td>
                    <code>story.context</code>
                  </td>
                  <td className="small">
                    Sua ferramenta decide o que retém. Nunca edite o conteúdo para liberar um hold, e nunca mostre um
                    hold como um banner com um botão “publicar mesmo assim”.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Repositório de mídia</b>
                    <br />
                    <span className="muted small">TAMS, MAM</span>
                  </td>
                  <td>
                    <code>delivery.media_available</code>
                  </td>
                  <td>—</td>
                  <td className="small">
                    URIs de Source, não ids de Flow — ou um locator. Anuncie de novo com um <code>time_range</code>{' '}
                    crescente enquanto a captura continua.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Sistema que vincula / expõe</b>
                    <br />
                    <span className="muted small">CMS, playout, redes sociais</span>
                  </td>
                  <td>
                    <code>som.link.*</code>, <code>som.telling.*</code>
                  </td>
                  <td>
                    <code>story.context</code>
                  </td>
                  <td className="small">
                    Status do gate por destino. Os horários de exposição são carimbados pelo evento e imutáveis.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Ator de governança</b>
                    <br />
                    <span className="muted small">padrões editoriais, jurídico, automação</span>
                  </td>
                  <td>
                    <code>som.system.audit</code>
                  </td>
                  <td>tudo o que for relevante</td>
                  <td className="small">Atores são objetos. Registre o motivo.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: 24 }}>
            <Link to="/pt/skills">A seguir: como uma skill é acionada (recall) →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
