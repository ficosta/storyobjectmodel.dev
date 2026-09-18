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
          A Story existe e está sendo trabalhada. Os campos chegam ao longo de snapshots sucessivos: uma{' '}
          <code>premise</code> com um grau de confiança, as primeiras entradas em <code>editorial_source[]</code>, os
          primeiros Assets e afirmações.
        </p>
        <p className="small muted mb0">
          Cada mudança é um novo snapshot completo com um <code>sequence_number</code> maior. As ferramentas que leem a
          Story reavaliam cada um deles.
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
          A Story é considerada pronta para ir ao ar. O que ainda precisa ser resolvido antes é expresso como entradas
          em <code>editorial_gates[]</code>, cujos <code>blocks[]</code> nomeiam o que seguram — um Asset ou uma fase
          do ciclo de vida.
        </p>
        <p className="small muted mb0">
          Um gate é <code>PENDING</code>, <code>APPROVED</code> ou <code>REJECTED</code>. Os gates se combinam por
          conjunção: todo gate aplicável precisa permitir.
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
          A Story está no ar e andando rápido — exatamente quando os números não estão confirmados e os holds mais
          importam. A velocidade vem de toda ferramenta ver o mesmo estado ao mesmo tempo, não de pular um gate.
        </p>
        <p className="small muted mb0">
          Prioridade é independente da fase: <code>priority.level</code> vai de <code>ROUTINE</code>,{' '}
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
          A Story já saiu, e continua em movimento: correções, chegada de novas mídias e eventos de distribuição
          produzem novos snapshots e eventos.
        </p>
        <p className="small muted mb0">
          Depois da publicação, as famílias de distribuição carregam o peso: os links vinculam Assets a destinos,
          os Tellings registram a exposição e a família de auditoria mantém o rastro.
        </p>
      </>
    ),
  },
];

const GLOSSARY: [string, React.ReactNode][] = [
  ['Story', <>O acontecimento no mundo, mantido como um contexto que o seu publicador possui e afirma. Publicada como snapshots completos de <code>story.context</code>, identificados por um <code>story_id</code> imutável.</>],
  ['Asset', <>Uma peça individual de mídia ou de trabalho editorial sobre uma Story, classificada pela posição probatória (<code>PRIMARY</code> / <code>SECONDARY</code> / <code>TERTIARY</code>). Existe tenha ou não algo sido publicado a partir dela.</>],
  ['Telling', <>O momento em que um Asset encontra um público por meio de um destino, com <code>exposure_start</code> / <code>exposure_end</code> imutáveis. O estado “no ar” é derivado dos Tellings.</>],
  ['Link', <>Um Asset vinculado a um destino, com um gate de conformidade por destino (<code>PENDING</code> / <code>CLEARED</code> / <code>BLOCKED</code>).</>],
  ['Source (TAMS)', <>Mídia endereçada como <code>tams://store/id</code> mais um intervalo de tempo opcional. O SOM referencia Sources, nunca Flows.</>],
  ['Locator', <>Uma referência de mídia fora do TAMS: <code>store</code> + <code>ref</code>. Um caminho no MAM, uma chave de objeto, um id do CMS.</>],
  ['Assertion (afirmação)', <>Uma afirmação sobre uma Story, um Asset, um link ou um Telling — <code>FACT_CHECK</code>, <code>DETECTION</code> ou <code>MATCH</code> — com procedência e um estado de revisão. O lugar oficial de um fato confirmado.</>],
  ['Provenance (procedência)', <>Quem ou o que produziu uma saída: <code>HUMAN</code> ou <code>MODEL</code>. Genérico quanto à autoria, nunca atrelado a IA.</>],
  ['Gate editorial', <>Algo que precisa ser resolvido antes que um Asset ou uma fase avance. <code>PENDING</code> / <code>APPROVED</code> / <code>REJECTED</code>.</>],
  ['Órfão (Orphan)', <>Uma Story mínima, só a casca (<code>story_type: ORPHAN</code>), criada para guardar um clipe que chegou sem Story, até que uma correspondência proposta seja confirmada.</>],
  ['Skill', <>Um arquivo de regra passivo no formato do agentskills.io. Ele declara; nunca age, e nunca altera conteúdo.</>],
  ['Executor', <>A parte de uma ferramenta de fornecedor que faz o recall das skills, publica os seus avisos e decide o que a ferramenta retém. As ferramentas têm executores; as redações não têm um executor central.</>],
  ['Instância configurada', <>Um arquivo de skill genérico com os valores de uma casa carregados, vigiando uma condição. Uma casa roda várias a partir do mesmo arquivo.</>],
  ['Story Archaeology', <>O método por trás do modelo: rastrear uma história real depois da exibição e registrar como o seu contexto de fato circulou.</>],
  ['Extensão', <><code>extensions["com.&#123;vendor&#125;.&#123;field&#125;"]</code> — o lugar definido para campos que o padrão não traz. Chaves desconhecidas são ignoradas.</>],
];

export default function Concepts() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Conceitos"
        title="O SOM em dez minutos"
        lede="Três substantivos, um snapshot e um punhado de regras sobre quem escreve e quem decide. Aprenda isso e os schemas se leem sozinhos."
        toc={[
          { href: '#nouns', label: 'Story · Asset · Telling' },
          { href: '#snapshots', label: 'Snapshots' },
          { href: '#lifecycle', label: 'Ciclo de vida' },
          { href: '#evidence', label: 'Evidências e afirmações' },
          { href: '#gates', label: 'Gates e auditoria' },
          { href: '#skills', label: 'Declarar, depois agir' },
          { href: '#principles', label: 'Princípios' },
          { href: '#glossary', label: 'Glossário' },
        ]}
      />

      <section id="nouns">
        <div className="wrap">
          <p className="eyebrow">Os três substantivos</p>
          <h2>Story, Asset, Telling</h2>
          <p className="lede">
            Uma história é um acontecimento do mundo real: ela cresce, se divide e muda de rumo, e ninguém conhece a
            sua forma até que termine. Levar isso para um schema se resumiu a três palavras que os jornalistas já usam.
          </p>

          <div className="grid g3" style={{ marginTop: 28 }}>
            <div className="card">
              <div className="lane-icon">S</div>
              <h3>Story</h3>
              <p className="small">
                O acontecimento. Do que se trata (<code>tags[]</code>, <code>story_meaning</code>), em que ponto está
                (<code>lifecycle</code>, <code>priority</code>), o que a redação espera (<code>premise</code>), suas
                fontes e a credibilidade delas, e os gates e alertas de conformidade que pesam sobre ela.
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
                O que a redação apura e produz: <code>VIDEO</code>, <code>SCRIPT</code>, <code>GRAPHIC</code>,{' '}
                <code>TRANSCRIPT</code> e saídas generativas como <code>SUMMARY</code> e <code>SOCIAL_POST</code>.
                Apenas referências — a mídia fica no seu storage.
              </p>
              <p className="small muted mb0">
                <code>status</code> é apenas editorial: <code>READY</code>, <code>IN_PRODUCTION</code>,{' '}
                <code>PREPARED</code>, <code>INVALIDATED</code>. “No ar” e “exibido” nunca são guardados aqui.
              </p>
            </div>
            <div className="card">
              <div className="lane-icon">T</div>
              <h3>Telling</h3>
              <p className="small">
                Um Asset encontrando um público por meio de um destino. Ele segue um <b>link</b> — o vínculo
                daquele Asset com aquele destino — e registra quando a exposição começou e terminou.
              </p>
              <p className="small muted mb0">
                A posição de conformidade pertence ao Telling. O mesmo Asset pode estar liberado num link e bloqueado
                em outro no mesmo instante.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="snapshots">
        <div className="wrap">
          <p className="eyebrow">Snapshots, nunca deltas</p>
          <h2>Uma Story é publicada inteira, todas as vezes</h2>

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div>
              <ul className="clean">
                <li>
                  <code>story_id</code> é imutável. Uma revisão é o próximo snapshot, não uma nova Story.
                </li>
                <li>
                  <code>sequence_number</code> DEVE aumentar e <code>updated_at</code> DEVE avançar.
                </li>
                <li>
                  Quem publica carimba de novo o <code>originating_system</code>, para que uma correção seja atribuída
                  a quem corrigiu, não a quem criou a Story primeiro.
                </li>
                <li>
                  Um único escritor cria: o sistema de gestão de histórias do publicador é dono da Story e da sua
                  sequência — nunca a agência, nem mesmo num flash.
                </li>
                <li>
                  Uma ferramenta que entra tarde, reinicia ou se reconecta depois de uma queda lê um único objeto e já
                  está atualizada.
                </li>
              </ul>
            </div>
            <div className="card">
              <span className="kicker">O erro mais danoso</span>
              <h3>Omissão significa ausência, não “sem alteração”</h3>
              <p className="small">
                Um produtor NÃO DEVE deixar de fora os campos que não modificou. Um escritor que envia só os seus
                próprios campos apaga em silêncio o trabalho de todos os outros sistemas sobre a Story.
              </p>
              <p className="small mb0">
                A especificação traz <code>tools/validate_sequence.py</code> para verificar exatamente essas
                propriedades numa sequência de snapshots — os bugs que nenhuma mensagem isolada consegue revelar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="lifecycle">
        <div className="wrap">
          <p className="eyebrow">Ciclo de vida da Story</p>
          <h2>Quatro fases, só em Stories ativas</h2>
          <p className="lede" style={{ marginBottom: 26 }}>
            Um bloco <code>lifecycle</code> é obrigatório quando <code>story_type</code> é <code>ACTIVE</code> e
            proibido nos demais casos — uma regra do schema, não uma convenção. Selecione uma fase.
          </p>

          <PhaseStepper phases={PHASES} />

          <div className="note" style={{ marginTop: 24 }}>
            <p className="mb0">
              <b>Órfãos.</b> Um clipe que chega sem Story ganha uma Story mínima <code>ORPHAN</code>, só a casca, para
              guardá-lo, com uma assertion <code>MATCH</code> que propõe a Story verdadeira. Na confirmação o clipe se
              muda — mesmo <code>asset_id</code>, timestamps originais — e a casca sempre se aposenta como{' '}
              <code>ARCHIVED</code>. Ela nunca é apagada, e os consumidores filtram os órfãos com um único predicado
              de <code>story_type</code>.
            </p>
          </div>
        </div>
      </section>

      <section id="evidence">
        <div className="wrap">
          <p className="eyebrow">Evidências &amp; afirmações</p>
          <h2>De onde as coisas vieram, e o que está sendo afirmado</h2>

          <div className="grid g3" style={{ marginTop: 26, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">editorial_source[]</span>
              <h3>Fontes e credibilidade</h3>
              <p className="small mb0">
                Cada fonte traz um tipo (<code>WIRE</code>, <code>OFFICIAL</code>, <code>USER_GENERATED</code>, …) e
                uma <code>credibility</code> declarada: <code>TRUSTED</code>, <code>VERIFIED</code>,{' '}
                <code>ENDORSED</code> ou <code>UNVERIFIED</code>. Credibilidade é um eixo diferente da autenticidade
                da mídia.
              </p>
            </div>
            <div className="card">
              <span className="kicker">assets[].provenance</span>
              <h3>Autoria</h3>
              <p className="small mb0">
                <code>HUMAN</code> ou <code>MODEL</code>, com modelo e versão só no caso de modelos. Uma{' '}
                <code>authenticity_credential</code> C2PA registra <code>present: false</code> em vez de esconder a
                sua ausência. O grau de confiança é opcional — não invente um para texto livre.
              </p>
            </div>
            <div className="card">
              <span className="kicker">assertions[]</span>
              <h3>Afirmações em revisão</h3>
              <p className="small mb0">
                <code>FACT_CHECK</code> (uma métrica e um valor), <code>DETECTION</code> ou <code>MATCH</code>, cada
                uma com um <code>review</code> <code>PENDING</code>, <code>CONFIRMED</code> ou <code>REJECTED</code>.
                Entradas rejeitadas são marcadas, nunca apagadas. Em qualquer divergência, a assertion prevalece.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="gates">
        <div className="wrap">
          <p className="eyebrow">Gates &amp; auditoria</p>
          <h2>Nada chega a um público sem um gate editorial</h2>
          <p className="lede">
            Uma skill declara, a ferramenta dona do executor decide e uma pessoa aprova. Uma liberação é concedida a
            uma versão do texto, então uma reescrita reabre o gate em vez de herdar a aprovação.
          </p>

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card sev hold">
              <h3>hold</h3>
              <p className="small mb0">
                O executor DEVE reter a saída nos campos afetados. Só é liberado por uma liberação no mesmo escopo —
                não pela passagem do tempo, nem pelo alerta sumir de um snapshot posterior.
              </p>
            </div>
            <div className="card sev flag">
              <h3>flag</h3>
              <p className="small mb0">
                Marca para revisão. Uma ferramenta pode exibi-lo; nada é retido só por causa dele.
              </p>
            </div>
            <div className="card sev inform">
              <h3>inform</h3>
              <p className="small mb0">Apenas consultivo. Nenhuma ação de bloqueio e nenhuma resposta obrigatória.</p>
            </div>
          </div>

          <div className="grid g2" style={{ marginTop: 22, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Conjunção</span>
              <p className="small mb0">
                Quando vários gates se aplicam ao mesmo fato no mesmo Telling, ele só é servido quando <b>todos</b> os
                gates permitem — um único hold basta para segurar. “O mais restritivo vence” e “o dono da Story tem
                precedência” foram abandonados em favor disso. A conformidade é fail-closed, e uma transformação —
                corte, recorte, legenda embutida — nunca levanta um hold.
              </p>
            </div>
            <div className="card">
              <span className="kicker">som.system.audit</span>
              <p className="small mb0">
                O rastro de governança. Uma <code>action</code> <code>CLEARED</code>, <code>SUPPRESSED</code>,{' '}
                <code>WITHHELD</code> ou <code>OVERRIDDEN</code>, sobre um <code>LINK</code>, <code>ASSET</code> ou{' '}
                <code>TELLING</code>, com um autor e um motivo. Uma supressão tem como alvo o Asset retido, porque o
                ramo que nunca vai ao ar nunca ganha um link.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="wrap">
          <p className="eyebrow">Declarar, depois agir</p>
          <h2>O SOM carrega o contexto. As skills carregam o conhecimento.</h2>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">O padrão — compartilhado</span>
              <p className="small mb0">
                O que é uma Story, em que estado ela está, o que está retido e o que está liberado, de onde veio o
                material. Igual em todo lugar, e sem nenhum julgamento próprio.
              </p>
            </div>
            <div className="card">
              <span className="kicker">As skills — da casa</span>
              <p className="small mb0">
                Padrões editoriais, regras de conformidade, práticas institucionais: o que legitimamente muda de uma
                redação para outra. O framework é aberto; o seu fluxo de trabalho continua seu, e nenhum fornecedor
                precisa de uma cópia da sua política.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>O silêncio é um resultado válido.</b> Uma skill que não encontra nada a declarar não diz nada, e uma
              ferramenta só prova que leu a Story publicando por sua vez. É também por isso que o rastro de auditoria
              é um subproduto de como as escritas funcionam, e não um recurso que alguém acoplou depois.{' '}
              <Link to="/pt/skills">Como funciona o recall →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="principles">
        <div className="wrap">
          <p className="eyebrow">Princípios</p>
          <h2>Por que o SOM tem a forma que tem</h2>
          <p className="lede">
            Seis princípios de trabalho abrem a especificação, e são o teste pelo qual qualquer mudança futura precisa
            passar.
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

          <h3 style={{ marginTop: 40, textAlign: 'center' }}>Como ele se comporta</h3>
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
              <b>Onde o padrão para.</b> O SOM descreve uma Story e tudo o que é verdade sobre ela, e nada mais. O que
              cada redação faz com o que lê é problema dela. A 1.0 é um compromisso com a estabilidade, não uma
              pretensão de completude: o que não está resolvido fica anotado no{' '}
              <a href={repoFile('spec/open-register.md')} target="_blank" rel="noreferrer">
                registro de questões em aberto ↗
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section id="glossary">
        <div className="wrap">
          <p className="eyebrow">Glossário</p>
          <h2>O vocabulário</h2>
          <div className="table-scroll" style={{ marginTop: 22 }}>
            <table>
              <thead>
                <tr>
                  <th>Termo</th>
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
            O glossário completo está na especificação:{' '}
            <a href={repoFile('spec/glossary.md')} target="_blank" rel="noreferrer">
              spec/glossary.md ↗
            </a>
          </p>
        </div>
      </section>

      <section>
        <div className="wrap center">
          <h2>A seguir: o formato de transmissão</h2>
          <p className="lede" style={{ margin: '0 auto 24px' }}>
            Toda mensagem compartilha um único envelope. Aqui está cada campo, e o que a conformidade exige dele.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Link className="btn primary" to="/pt/envelope">
              O envelope →
            </Link>
            <Link className="btn" to="/pt/bus">
              As sete famílias
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
