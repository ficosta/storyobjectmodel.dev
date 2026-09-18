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
        eyebrow="Referência · som-skill-library"
        title="Skills"
        lede="O SOM carrega contexto; as Skills carregam conhecimento. Uma skill é uma regra escrita uma vez, pela redação, e legível por todas as ferramentas. Ela declara o que é verdade — quem age é só a ferramenta dona do executor."
        toc={[
          { href: '#model', label: 'Declarar, não agir' },
          { href: '#anatomy', label: 'Anatomia' },
          { href: '#library', label: 'A biblioteca' },
          { href: '#combine', label: 'Combinando holds' },
          { href: '#checks', label: 'Validação' },
          { href: '#open', label: 'O que está em aberto' },
        ]}
      />

      <section id="model">
        <div className="wrap">
          <p className="eyebrow">O modelo</p>
          <h2>Skills declaram. Executores agem.</h2>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <div className="lane-icon">1</div>
              <h3>A skill declara</h3>
              <p className="small mb0">
                Um arquivo de skill enuncia uma condição e o que é verdade quando ela se cumpre — uma flag está de pé,
                um hold se aplica, um enriquecimento se justifica. Ele nunca executa nada, nunca escreve estado da
                história e nunca altera conteúdo.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">2</div>
              <h3>O executor aciona (recall)</h3>
              <p className="small mb0">
                Os executores vivem dentro das ferramentas dos fornecedores. Cada um compara as mensagens que chegam
                com os <b>adverts</b> das skills — o bloco <code>recall</code>, lido por máquina — e publica o que a
                skill declara como <code>skill.warning.raised</code>.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">3</div>
              <h3>A ferramenta age</h3>
              <p className="small mb0">
                O MAM impede o commit de um asset retido, o playout recusa o take, o CMS segura um caminho. Cada um a
                seu modo, e cada um decidindo por si. Ninguém recebe comando nenhum.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Formato aberto, política da casa.</b> As skills seguem o formato aberto{' '}
              <a href={AGENTSKILLS_URL} target="_blank" rel="noreferrer">
                agentskills.io ↗
              </a>
              : um arquivo markdown com frontmatter YAML. A biblioteca compartilhada é genérica; cada redação carrega
              nela os próprios valores. Sua política continua sendo sua, e uma redação pode implementar o SOM 1.0 por
              completo sem usar a biblioteca.
            </p>
          </div>
        </div>
      </section>

      <section id="anatomy">
        <div className="wrap">
          <p className="eyebrow">Anatomia</p>
          <h2>Um arquivo: frontmatter para as máquinas, prosa para as pessoas</h2>

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
                <span className="kicker">Identidade</span>
                <p className="small mb0">
                  <code>skill_id</code> no formato <code>publisher/name</code>, uma <code>skill_version</code> semver,
                  as versões de schema do SOM contra as quais ela resolve, uma <code>category</code> e um{' '}
                  <code>lifecycle</code>.
                </p>
              </div>
              <div className="card" style={{ marginBottom: 16 }}>
                <span className="kicker">O advert</span>
                <p className="small mb0">
                  <code>recall</code> diz quais tipos de ferramenta podem pegar a skill, as condições sobre caminhos da
                  história (<code>field</code> e <code>field_change</code>) e quais mensagens provocam uma verificação.
                  Os caminhos são literais e conferidos contra o schema publicado; os valores podem vir de templates
                  preenchidos pela configuração da casa.
                </p>
              </div>
              <div className="card" style={{ marginBottom: 16 }}>
                <span className="kicker">Instância configurada</span>
                <p className="small mb0">
                  Um arquivo genérico com os valores de uma casa carregados, vigiando uma condição. Uma casa roda várias
                  a partir do mesmo arquivo — uma restrição judicial com escopo <code>story</code>, um número não
                  confirmado com escopo <code>link</code> — e registra uma linha de advert por instância configurada.
                </p>
              </div>
              <div className="card">
                <span className="kicker">Severidade</span>
                <p className="small mb0">
                  <code>hold</code> / <code>flag</code> / <code>inform</code>, em minúsculas para sempre. Uma skill
                  declara em <code>severity_range</code> quais delas pode produzir.
                </p>
              </div>
            </div>
          </div>

          <div className="table-scroll" style={{ marginTop: 26 }}>
            <table>
              <thead>
                <tr>
                  <th>Garantia</th>
                  <th>Valor</th>
                  <th>O que significa</th>
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
          <h2>Dez skills de referência, uma proposta</h2>
          <p className="lede">
            Todas <code>lifecycle: draft</code>, <code>origin: reference</code>, resolvendo contra o SOM 1.0. Encontre o
            tipo da sua ferramenta na tabela de consulta, leia as skills daquela linha e configure-as para a sua casa.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Declara</th>
                  <th>Categoria</th>
                  <th>Severidade</th>
                  <th>Acionada por</th>
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
                          <span className="tag soon">proposta</span>
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
              Tabela de consulta ↗
            </a>{' '}
            ·{' '}
            <a href={repoFile('skills/docs/CONVENTIONS.md')} target="_blank" rel="noreferrer">
              Convenções ↗
            </a>{' '}
            ·{' '}
            <a href={repoDir('skills/skills')} target="_blank" rel="noreferrer">
              Todos os arquivos de skill ↗
            </a>
          </p>
        </div>
      </section>

      <section id="combine">
        <div className="wrap">
          <p className="eyebrow">Quando as skills se encontram</p>
          <h2>Holds se combinam por conjunção</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Basta um hold para reter</span>
              <p className="small">
                Quando vários gates se aplicam ao mesmo fato no mesmo telling, ele só é servido quando todos permitem.
                “O mais restritivo vence” e “o dono da história tem precedência” foram formalmente retirados em 29 de
                julho de 2026.
              </p>
              <p className="small mb0">
                A precedência entre duas skills que entram em conflito sobre a mesma ação é outra questão, ordenada por{' '}
                <b>X</b> (categoria: compliance 1, editorial 2, workflow 3), <b>Y</b> (origem — toda skill da biblioteca
                é 5) e <b>Z</b>, que só a casa publicadora define.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Encadeamento pela pipeline</span>
              <p className="small">
                Uma skill que ao mesmo tempo declarasse um estado e retivesse algo ocuparia duas posições de uma vez.
                Por isso “flag e hold” são duas skills: <code>flag-on-mismatch</code> declara a flag, e{' '}
                <code>hold-while-flagged</code> se anuncia (advert) a partir do estado da flag — não importa quem a
                levantou, uma skill ou um advogado.
              </p>
              <p className="small mb0">
                É por isso que <code>depends</code> está vazio em toda parte: declarar uma dependência a inverteria e
                criaria um ciclo na primeira mudança de versão.
              </p>
            </div>
          </div>

          <div className="grid g2" style={{ marginTop: 18, alignItems: 'start' }}>
            <div className="note warn">
              <p className="mb0">
                <b>Fail-closed.</b> Um valor ilegível na configuração ou na história é tratado como se a condição
                valesse, na severidade mais alta que a skill tem, e <code>detail</code> diz o que não pôde ser lido. Se
                uma regra não pode ser avaliada, a saída que ela protege continua retida e uma pessoa decide.
              </p>
            </div>
            <div className="note">
              <p className="mb0">
                <b>O que não libera um hold:</b> a passagem do tempo, a flag simplesmente sumir de um snapshot
                posterior, uma liberação em outro escopo, uma autoridade inferior, o reinício do executor ou a
                liberação de outra flag. Liberar um hold nunca é uma instrução para liberar o asset.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="checks">
        <div className="wrap">
          <p className="eyebrow">Validação</p>
          <h2>A biblioteca verifica a si mesma</h2>
          <p className="lede">
            Cinco scripts vêm com a biblioteca, e cada um faz uma pergunta diferente — inclusive se os documentos
            concordam com os arquivos que descrevem.
          </p>
          <pre style={{ marginTop: 22 }}>{`cd som/skills
python3 scripts/validate_som_skill.py skills/<name>.md   # one skill file is legal
python3 scripts/check_library.py skills/                  # the library holds together
python3 scripts/check_paths.py skills/                    # every path resolves against
                                                          #   ../schema/story-context.schema.json
python3 scripts/build_lookup_table.py . --check           # the table matches the adverts
python3 scripts/check_cover_claims.py .                   # the docs match the files`}</pre>
          <p className="small muted">
            Uma lacuna é declarada em vez de escondida: <code>check_paths.py</code> resolve apenas caminhos literais. Um
            valor <code>{'{{ config.* }}'}</code> é desconhecido até que a casa o configure, então pegar um caminho
            configurado errado é trabalho da casa no momento do registro.
          </p>
        </div>
      </section>

      <section id="open">
        <div className="wrap narrow">
          <p className="eyebrow">Em aberto, com franqueza</p>
          <h2>O que a biblioteca não pretende resolver</h2>
          <ul className="clean">
            <li>
              <b>Como a autoridade é comparada.</b> “Liberado por autoridade igual ou superior no mesmo escopo” é a
              posição de trabalho da biblioteca, com a ordem fornecida por cada casa como <code>authority_scale</code>.
              Nenhum grupo a ratificou.
            </li>
            <li>
              <b>Quem transforma um aviso levantado em estado de gate.</b> Uma skill de levantamento só publica um
              aviso; uma skill de hold lê <code>editorial_gates[]</code>. O que materializa um no outro ainda não está
              definido.
            </li>
            <li>
              <b>Correspondência de tags qualificada por esquema.</b> Hoje as skills comparam <code>tags[].value</code>{' '}
              independentemente do esquema; se devem casar com <code>newsroom:sport</code> em vez de{' '}
              <code>sport</code> está em aberto.
            </li>
            <li>
              <b>Configuração da demo.</b> As instâncias configuradas usadas no passo a passo da IBC nomeiam
              fornecedores específicos e não estão publicadas na 1.0, até que cada fornecedor dê o aval.
            </li>
          </ul>
          <p className="mb0">
            <Link to="/pt/get-started">A seguir: valide e publique sua primeira mensagem →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
