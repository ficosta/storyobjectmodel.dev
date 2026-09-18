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
        title="Primeiros passos"
        lede="Leia os documentos curtos, rode o corpus de conformidade, valide sua própria mensagem com a validação de formatos ligada e publique. Depois escolha um nível e converse com o grupo de trabalho."
        toc={[
          { href: '#read', label: 'Leia primeiro' },
          { href: '#corpus', label: 'Rode o corpus' },
          { href: '#validate', label: 'Valide em TypeScript' },
          { href: '#publish', label: 'Publique uma história' },
          { href: '#tiers', label: 'Níveis de integração' },
          { href: '#involved', label: 'Participe' },
        ]}
      />

      <section id="read">
        <div className="wrap">
          <p className="eyebrow">Passo 1</p>
          <h2>Leia quatro coisas, nesta ordem</h2>
          <div className="grid g4" style={{ marginTop: 26 }}>
            <a className="card" href={repoFile('spec/introduction.md')} target="_blank" rel="noreferrer">
              <span className="kicker">01 · para todos</span>
              <h3>Introdução ↗</h3>
              <p className="small mb0">Por que o SOM existe, os três substantivos e os seis princípios.</p>
            </a>
            <a className="card" href={repoFile('spec/conformance.md')} target="_blank" rel="noreferrer">
              <span className="kicker">02 · para implementadores</span>
              <h3>Conformidade ↗</h3>
              <p className="small mb0">O que significa estar conforme com o SOM 1.0 — mais curto do que você imagina.</p>
            </a>
            <a className="card" href={repoDir('examples/hurricane-run')} target="_blank" rel="noreferrer">
              <span className="kicker">03 · o retrato mais claro</span>
              <h3>O exemplo do furacão ↗</h3>
              <p className="small mb0">Uma história contada ao longo de sete snapshots.</p>
            </a>
            <a className="card" href={`${SCHEMA_BASE_URL}/story-context.schema.json`} target="_blank" rel="noreferrer">
              <span className="kicker">04 · sua primeira família</span>
              <h3>Schema story-context ↗</h3>
              <p className="small mb0">A família que você quase certamente vai implementar primeiro.</p>
            </a>
          </div>
        </div>
      </section>

      <section id="corpus">
        <div className="wrap">
          <p className="eyebrow">Passo 2</p>
          <h2>Rode o corpus de conformidade</h2>
          <p className="lede">
            O repositório da especificação traz exemplos completos que precisam validar, vinte casos negativos que
            precisam ser rejeitados e ferramentas em Python puro que verificam ambos.
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
              <span className="kicker">Quatro perguntas diferentes</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  Esta mensagem é válida? — <code>validate.py</code>
                </li>
                <li>
                  Os schemas de fato restringem? — <code>validate_negative.py</code>. Dezenove casos falham nos
                  schemas; o vigésimo, <code>som_version: "0.3.2"</code>, falha na regra de versão do fio, que a sua
                  implementação precisa aplicar por conta própria.
                </li>
                <li>
                  O schema corresponde ao que diz sobre si mesmo? — <code>som_lint.py</code>
                </li>
                <li>
                  Uma sequência de snapshots se sustenta? — <code>validate_sequence.py</code>, onde moram os bugs
                  caros.
                </li>
              </ul>
            </div>
          </div>

          <div className="note warn" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Instale o <code>rfc3339-validator</code>.</b> Sem ele, o <code>jsonschema</code> do Python aceita em
              silêncio um <code>timestamp</code> malformado. O corpus negativo inclui esse caso justamente para que a
              verificação falhe ruidosamente quando o pacote estiver faltando.
            </p>
          </div>
        </div>
      </section>

      <section id="validate">
        <div className="wrap">
          <p className="eyebrow">Passo 3</p>
          <h2>Valide na sua própria stack — com os formatos validados</h2>
          <p className="lede">
            Duas implementações que discordam sobre se <code>message_id</code> precisa ser um UUID não são
            interoperáveis. Em Node, isso significa o build 2020-12 do Ajv mais <code>ajv-formats</code>.
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
            Ilustrativo, não uma implementação de referência — guarde em cache os validadores compilados em vez de
            buscá-los a cada mensagem. Os schemas são servidos na URL do seu próprio <code>$id</code>, então resolver
            pelo identificador também funciona.
          </p>
        </div>
      </section>

      <section id="publish">
        <div className="wrap">
          <p className="eyebrow">Passo 4</p>
          <h2>Publique um snapshot de história conforme</h2>

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
              <span className="kicker">Checklist para cada snapshot</span>
              <ul className="clean small" style={{ marginBottom: 0 }}>
                <li>
                  Um <code>message_id</code> UUID novo (v7 recomendado); o mesmo <code>correlation_id</code> ao longo
                  do ciclo de vida da história.
                </li>
                <li>
                  O mesmo <code>story_id</code>, um <code>sequence_number</code> maior, um{' '}
                  <code>updated_at</code> posterior.
                </li>
                <li>
                  <b>Todos os campos</b>, inclusive os que outros sistemas contribuíram. Omitir significa ausente.
                </li>
                <li>
                  <code>lifecycle</code> presente se, e somente se, <code>story_type</code> for <code>ACTIVE</code>.
                </li>
                <li>
                  O seu próprio <code>originating_system</code>, carimbado de novo a cada publicação.
                </li>
                <li>
                  Tudo o que o padrão não carrega vai em <code>extensions["com.&#123;vendor&#125;.…"]</code>.
                </li>
              </ul>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Veja num barramento ao vivo.</b> O{' '}
              <a href={EMULATOR_URL} target="_blank" rel="noreferrer">
                emulador ↗
              </a>{' '}
              do projeto é um painel sobre um barramento em funcionamento que você mesmo pode usar, e as{' '}
              <a href={DEMOS_URL} target="_blank" rel="noreferrer">
                demos da IBC ↗
              </a>{' '}
              mostram dois cenários completos de ponta a ponta. Uma implementação de referência em .NET virá num
              repositório separado; o starter do hackathon pré-1.0 emite <code>0.3.2</code> e não é tráfego 1.0.
            </p>
          </div>
        </div>
      </section>

      <section id="tiers">
        <div className="wrap">
          <p className="eyebrow">Adesão</p>
          <h2>Nada do seu produto precisa sair</h2>
          <p className="lede">Um sistema basta para começar. As integrações são descritas em três níveis.</p>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <div className="lane-icon">1</div>
              <h3>Assinar e publicar</h3>
              <p className="small mb0">
                Leia a história e coloque a sua própria família no barramento. O projeto estima isso em dias, não em
                meses.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">2</div>
              <h3>Contexto bidirecional</h3>
              <p className="small mb0">
                Sua ferramenta consome e também contribui com contexto estruturado — assertions, proveniência, links,
                tellings.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">3</div>
              <h3>Decidir com base na história</h3>
              <p className="small mb0">
                Sua ferramenta age de forma autônoma sobre o que lê, por meio de um executor que aplica as skills da
                casa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="involved">
        <div className="wrap">
          <p className="eyebrow">Participe</p>
          <h2>O grupo de trabalho está aberto</h2>
          <div className="grid g3" style={{ marginTop: 26 }}>
            <a className="card" href={INVOLVED_FORM_URL} target="_blank" rel="noreferrer">
              <h3>Registre seu interesse ↗</h3>
              <p className="small">
                Desenvolva sobre o padrão, escreva skills, conduza uma sessão de Story Archaeology, entre no grupo de
                trabalho ou apenas acompanhe o trabalho — o formulário oficial pergunta quem você é e o que quer fazer.
              </p>
              <span className="more">formulário de storyobjectmodel.com →</span>
            </a>
            <a className="card" href={repoFile('GOVERNANCE.md')} target="_blank" rel="noreferrer">
              <h3>Proponha uma mudança ↗</h3>
              <p className="small">
                Toda mudança chega como pull request, e qualquer pessoa pode abrir um. Mudanças nos schemas estão
                sujeitas à política de compatibilidade; as questões em aberto ficam no registro público.
              </p>
              <span className="more">GOVERNANCE · CONTRIBUTING →</span>
            </a>
            <a className="card" href={`mailto:${CONTACT_EMAIL}`}>
              <h3>Converse sobre uma integração</h3>
              <p className="small">
                Para qualquer coisa que o README do repositório não responda, escreva para o projeto.
              </p>
              <span className="more">{CONTACT_EMAIL} →</span>
            </a>
          </div>

          <div className="note" style={{ marginTop: 26 }}>
            <p className="mb0">
              <b>Os schemas prevalecem.</b> Quando qualquer texto — este site incluído — discordar de um schema
              publicado, o schema é que está certo. <Link to="/pt/bus">Veja as sete famílias →</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
