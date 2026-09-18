import { Link } from 'react-router-dom';
import AccentWord from '../../../components/AccentWord';
import LoopDiagram from '../../../components/LoopDiagram';
import FieldExplorer from '../../../components/FieldExplorer';
import { Accordion, useHashScroll } from '../../../components/Bits';
import { ENVELOPE_FIELDS } from '../data/envelope';
import { FAQS } from '../data/faq';
import { DEMOS } from '../data/consortium';
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
  payload: 'validado contra o schema do message_type',
};

export default function Home() {
  useHashScroll();

  return (
    <>
      <div className="hero">
        <div className="wrap">
          <p className="eyebrow">SOM 1.0 · publicado no IBC 2026</p>
          <h1>
            Um barramento para o <AccentWord>contexto da história</AccentWord>.
            <br />
            Todas as ferramentas nele.
          </h1>
          <p className="lede">
            O Story Object Model é um padrão aberto para o contexto da história na produção de conteúdo — uma camada
            sob as ferramentas que você já usa, levando o que é verdade sobre uma Story neste momento e como isso
            mudou. As ferramentas param de conversar entre si e passam a ler uma única descrição da história,
            compartilhada e ao vivo.
          </p>
          <div className="btn-row">
            <Link className="btn primary" to="/pt/get-started">
              Comece aqui
            </Link>
            <Link className="btn" to="/pt/concepts">
              O SOM em dez minutos
            </Link>
          </div>
        </div>
      </div>

      <div className="credits">
        <div className="wrap">
          <p>Entre as catorze organizações champion</p>
          <ul>
            {CHAMPION_MARKS.map((o) => (
              <li key={o.name}>
                <img src={o.logo} alt={o.name} style={{ height: o.height }} />
              </li>
            ))}
          </ul>
          <p className="co">
            Desenvolvido no IBC Accelerator Media Innovation Programme 2026 como o projeto SMART STORIES, com
            catorze champions e dezessete participantes.
          </p>
        </div>
      </div>

      <section id="gap">
        <div className="wrap">
          <p className="eyebrow">A lacuna</p>
          <h2>Cada sistema guarda um fragmento. Nenhum guarda a história.</h2>
          <p className="lede">
            Cada ferramenta de uma redação é precisa sobre a sua própria fatia. As decisões que dão forma à história —
            segurar um número, qual roteiro vale, o que já foi liberado — circulam por chat, telefone e conversa de
            mesa em mesa, e raramente sobrevivem à troca de turno.
          </p>

          <div className="scenario" style={{ marginTop: 30 }}>
            <div>
              <span className="kicker">Hoje</span>
              <p>
                Tarde da noite, numa notícia urgente, o editor de plantão segura um número de vítimas não confirmado.
                O espelho fica sabendo; a arte recebe um novo briefing e entende errado; a equipe do site viu o grupo
                de mensagens e a de redes sociais não; ninguém avisou o letreiro.
              </p>
              <p className="mb0">
                O número está retido numa saída e no ar em outra, e amanhã o único rastro é a memória das pessoas. O
                contexto nunca faltou — ele ficou encalhado onde nenhum sistema conseguia lê-lo.
              </p>
            </div>
            <div>
              <span className="kicker">Com o SOM</span>
              <p>
                O editor toma a mesma decisão na ferramenta que já usa, e ela é gravada na Story. Toda ferramenta
                inscrita vê a decisão na hora e aplica as regras que a sua redação lhe deu: o clipe não pode ir ao ar,
                a arte não roda, o letreiro tira o número.
              </p>
              <p className="mb0">
                A decisão, quem a tomou, quando e por quê ficam registrados — assim como o que cada ferramenta fez a
                respeito. A pessoa não foi substituída; ela deixou de carregar estado e voltou a tomar a decisão.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="idea">
        <div className="wrap">
          <p className="eyebrow">A ideia</p>
          <h2>As ferramentas falam com a história, não entre si</h2>
          <p className="lede" style={{ marginBottom: 30 }}>
            O SOM é um pequeno conjunto de famílias de mensagens JSON sobre um barramento publish/subscribe comum.
            Nada fica acima das ferramentas: nenhum orquestrador, nenhuma aplicação central. Cada participante lê a
            Story, decide por conta própria e publica o que fez na sua própria família.
          </p>

          <LoopDiagram />

          <div className="grid g3" style={{ marginTop: 26 }}>
            <div className="card">
              <span className="kicker">story.context</span>
              <h3>Story</h3>
              <p className="mb0 small">
                O que está acontecendo no mundo: do que se trata, suas fontes e quanto se confia nelas, ciclo de vida
                e prioridade, a premissa que a redação espera e as afirmações feitas, com o seu estado de revisão.
              </p>
            </div>
            <div className="card">
              <span className="kicker">assets[]</span>
              <h3>Asset</h3>
              <p className="mb0 small">
                O que a redação apura e produz para contá-la — vídeo, áudio, roteiros, artes, transcrições. Só por
                referência: a mídia nunca trafega no barramento. Cada Asset carrega sua procedência e sua posição
                probatória.
              </p>
            </div>
            <div className="card">
              <span className="kicker">telling.*</span>
              <h3>Telling</h3>
              <p className="mb0 small">
                O momento em que um Asset encontra um público por meio de um destino. Uma Story, um conjunto de Assets,
                qualquer número de Tellings — e a posição de conformidade pertence ao Telling, não à mídia.
              </p>
            </div>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>Transcrito, não inventado.</b> Os três substantivos saíram das sessões de Story Archaeology —
              rastreando como o contexto de uma história real circulou entre pessoas e sistemas depois da exibição. O
              modelo é pequeno porque o vocabulário que as redações já usam é pequeno.{' '}
              <Link to="/pt/concepts#nouns">Os três substantivos em detalhe →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="start">
        <div className="wrap">
          <p className="eyebrow">Comece aqui</p>
          <h2>Três formas de entrar no barramento</h2>
          <p className="lede" style={{ marginBottom: 30 }}>
            Um sistema conforme implementa o envelope e apenas as famílias sobre as quais tem algo a dizer. O que isso
            significa depende do papel que você desempenha.
          </p>

          <div className="grid g3">
            <Link className="card" to="/pt/envelope">
              <div className="lane-icon">▤</div>
              <h3>Você é dono das histórias</h3>
              <p className="small">
                Um sistema de pauta ou NCS. Você cria a Story e publica snapshots de <code>story.context</code>: um{' '}
                <code>story_id</code> imutável, um <code>sequence_number</code> crescente e todos os campos, todas as
                vezes — omissão significa ausência.
              </p>
              <span className="more">O envelope, campo a campo →</span>
            </Link>
            <Link className="card" to="/pt/skills">
              <div className="lane-icon">◈</div>
              <h3>Sua ferramenta age sobre regras</h3>
              <p className="small">
                Um sistema de espelho, MAM, CMS, playout ou grafismo. Seu executor faz o recall das skills da
                biblioteca compartilhada, publica <code>skill.warning.raised</code> e decide o que a sua ferramenta
                retém.
              </p>
              <span className="more">As skills e a biblioteca →</span>
            </Link>
            <Link className="card" to="/pt/bus">
              <div className="lane-icon">⇄</div>
              <h3>Você move mídia ou saídas</h3>
              <p className="small">
                Um storage TAMS ou um MAM anuncia <code>delivery.media_available</code>; um sistema que faz o
                vínculo publica <code>som.link.*</code>; o playout e as redes sociais publicam{' '}
                <code>som.telling.*</code>.
              </p>
              <span className="more">As sete famílias de mensagens →</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="rulebook">
        <div className="wrap">
          <p className="eyebrow">O livro de regras</p>
          <h2>O SOM carrega o contexto. As skills carregam o conhecimento.</h2>
          <p className="lede">
            As regras editoriais são escritas uma única vez, pela redação, no formato aberto do agentskills.io, onde
            toda ferramenta consegue lê-las. Uma skill é passiva: ela declara o que é verdade, e a ferramenta dona do
            executor age a partir disso.
          </p>

          <div className="grid g2" style={{ marginTop: 26, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">Como a mesa de padrões editoriais diria</span>
              <p className="small mb0">
                Não divulgue um número de vítimas até que duas fontes identificadas e independentes o confirmem, ou
                até haver uma declaração oficial. Até lá, segure o número em todas as saídas e encaminhe-o à mesa de
                padrões editoriais.
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
              <b>Uma cópia, um autor.</b> Ninguém traduz a regra para seis produtos de fornecedores diferentes, e
              nenhum fornecedor precisa de uma cópia da sua política para trabalhar para você. Se uma regra não pode
              ser avaliada, a saída que ela protege continua retida e uma pessoa decide.{' '}
              <Link to="/pt/skills">Como funciona o recall das skills →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="demos">
        <div className="wrap">
          <p className="eyebrow">Veja acontecer</p>
          <h2>Dois cenários de notícia urgente, um barramento de histórias</h2>
          <p className="lede">
            No IBC 2026 o consórcio rodou dois cenários com histórias e fornecedores diferentes, todos lendo e
            escrevendo a mesma Story com ferramentas reais de produção. Em nenhum deles alguma coisa envia um comando
            para outra.
          </p>

          <div className="grid g2" style={{ marginTop: 28, alignItems: 'start' }}>
            {DEMOS.map((d, i) => (
              <a className="card" key={d.title} href={`${DEMOS_URL}#${d.anchor}`} target="_blank" rel="noreferrer">
                <span className="kicker">Cenário {String(i + 1).padStart(2, '0')}</span>
                <h3>{d.title} ↗</h3>
                <p className="small">{d.summary}</p>
                <p className="small muted mb0">{d.vendors.join(' · ')}</p>
              </a>
            ))}
          </div>

          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <a className="btn" href={DEMOS_URL} target="_blank" rel="noreferrer">
              Assista às demos ↗
            </a>
            <a className="btn" href={EMULATOR_URL} target="_blank" rel="noreferrer">
              Abra o emulador ao vivo do barramento ↗
            </a>
          </div>
        </div>
      </section>

      <section id="fits">
        <div className="wrap">
          <p className="eyebrow">Não substitui nada</p>
          <h2>Um padrão novo, mais junções inteligentes</h2>
          <p className="lede">
            O hardware teve o GPI; o software teve o MOS, criado por emissoras e fornecedores para a sua indústria e
            sem dono. O SOM é o equivalente para a era das ferramentas inteligentes, e encontra os padrões que já
            funcionam onde eles estão.
          </p>

          <div className="table-scroll" style={{ marginTop: 26 }}>
            <table>
              <thead>
                <tr>
                  <th>Camada</th>
                  <th>Do que é dona</th>
                  <th>Relação com o SOM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>NCS / pauta</b>
                  </td>
                  <td>Criar e redigir a Story</td>
                  <td>
                    O dono da Story. Publica <code>story.context</code> e é dono da sua sequência. O espelho é uma
                    visão da história; o SOM carrega a história da qual ele é uma visão.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>MOS</b>
                  </td>
                  <td>Controle de dispositivos, itens do espelho</td>
                  <td>As linhas MOS continuam, com uma ponte que as torna cientes do contexto da história.</td>
                </tr>
                <tr>
                  <td>
                    <b>TAMS</b>
                    <br />
                    <span className="muted small">BBC R&amp;D Time Addressable Media Store</span>
                  </td>
                  <td>Os frames</td>
                  <td>
                    O SOM guarda o que os frames significam para a história. Um hold se prende exatamente aos frames que
                    bloqueia, pela Source <code>tams://</code> e pelo intervalo de tempo; uma citação conhece seus
                    pontos de entrada e saída; quais frames chegaram a qual público vira uma consulta.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>MAM / outros storages</b>
                  </td>
                  <td>Essência, versões, recuperação</td>
                  <td>
                    O mesmo padrão por meio de um <code>locator</code> (<code>store</code> + <code>ref</code>). Mídia
                    no SOM é qualquer mídia, não só TAMS.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Agentes &amp; MCP</b>
                  </td>
                  <td>O que quer que você tenha construído</td>
                  <td>
                    Continua. Uma saída generativa que é publicada é uma entrada em <code>assets[]</code> com a{' '}
                    <code>provenance</code> de autoria; afirmações sobre o conteúdo são <code>assertions[]</code> com
                    um estado de revisão.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="note" style={{ marginTop: 22 }}>
            <p className="mb0">
              <b>O que o SOM não é:</b> a mídia, o espelho, um MAM, um produto, um software, um substituto para
              qualquer coisa que você já usa, nem propriedade de fornecedor algum. Como diz o projeto, um padrão que
              pertence a um fornecedor é um produto; um que pertence a uma indústria é infraestrutura.
            </p>
          </div>
        </div>
      </section>

      <section id="envelope">
        <div className="wrap">
          <p className="eyebrow">O envelope</p>
          <h2>Toda mensagem compartilha o mesmo invólucro</h2>
          <p className="lede" style={{ marginBottom: 28 }}>
            Um objeto fechado — campos desconhecidos no nível superior falham na validação. Clique em qualquer chave
            para ler o que ela significa.
          </p>

          <FieldExplorer fields={ENVELOPE_FIELDS} samples={ENVELOPE_SAMPLES} comments={ENVELOPE_COMMENTS} />

          <div className="note" style={{ marginTop: 24 }}>
            <p>
              <b>As regras que pegam.</b> Emita <code>som_version: "1.0.0"</code> e nunca crie ramificações com base
              nele. <code>message_type</code> é o único discriminador. <code>correlation_id</code> é obrigatório.{' '}
              <code>topic</code> começa com <code>som.</code> Faça a validação de formatos com <code>format</code> — a
              maioria dos validadores aceita calada um <code>message_id</code> que não é um UUID.{' '}
              <Link to="/pt/envelope">Referência completa do envelope →</Link>
            </p>
          </div>
        </div>
      </section>

      <section id="numbers">
        <div className="wrap">
          <p className="eyebrow">Em números</p>
          <h2 className="mb0">O formato do padrão</h2>
          <div className="grid g4" style={{ marginTop: 30 }}>
            <div className="stat">
              <b>7</b>
              <span>famílias de mensagens, cada uma um JSON Schema numa URL que não muda durante toda a vida da 1.x</span>
            </div>
            <div className="stat">
              <b>3</b>
              <span>substantivos — Story, Asset, Telling — transcritos de como as redações já trabalham</span>
            </div>
            <div className="stat">
              <b>10</b>
              <span>skills de referência publicadas, mais uma proposta, na biblioteca compartilhada</span>
            </div>
            <div className="stat">
              <b>14 + 17</b>
              <span>organizações champion e participantes de tecnologia no SMART STORIES</span>
            </div>
          </div>
        </div>
      </section>

      <section id="who">
        <div className="wrap">
          <p className="eyebrow">Créditos</p>
          <h2>Feito pela indústria, publicado para a indústria</h2>
          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div>
              <p>
                O SOM ganhou forma no debate aberto — dois hackathons, um grupo de trabalho semanal e seis meses do
                pontapé inicial a um barramento funcionando — e foi publicado como{' '}
                <b>versão 1.0 em 12 de setembro de 2026</b> no IBC, em Amsterdã.
              </p>
              <p>
                Seus autores são {AUTHORS.slice(0, -1).join(', ')} e {AUTHORS[AUTHORS.length - 1]}. Jon Roberts,
                Morag McIntosh e Alex Bassett conceberam o modelo e lideraram o projeto, ao lado de Brian Hopman, da
                AP; John Boucklos foi coautor da especificação, conduziu o schema até a 1.0 e construiu os validadores
                e o repositório.
              </p>
              <p className="mb0">
                A BBC R&amp;D trabalhou na junção com o TAMS. O Google Cloud foi o patrocinador principal do projeto
                do Accelerator; a Amazon Web Services forneceu o barramento de referência, o dashboard e o storage
                TAMS; a The Associated Press e a The Weather Company forneceram dados.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Aberto e sem dono</span>
              <p className="small">
                Sem taxa e nada para assinar. Schemas, exemplos, ferramentas e skills são licenciados sob Apache 2.0;
                o texto da especificação, sob CC BY 4.0. Essas licenças são a totalidade dos termos.
              </p>
              <p className="small">
                O Accelerator terminou; o grupo de trabalho, não. Ele é aberto a qualquer pessoa que implemente o
                modelo ou seja afetada por ele, e toda mudança chega como um pull request que qualquer um pode abrir.
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
              Lista conforme registrada no{' '}
              <a href={`${SPEC_REPO_URL}/blob/main/CONTRIBUTORS.md`} target="_blank" rel="noreferrer">
                CONTRIBUTORS.md ↗
              </a>{' '}
              da especificação.
            </p>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap narrow">
          <p className="eyebrow">Perguntas frequentes</p>
          <h2 style={{ marginBottom: 28 }}>Antes que você pergunte</h2>
          <Accordion items={FAQS} />
        </div>
      </section>

      <section id="reading">
        <div className="wrap">
          <p className="eyebrow">Leituras complementares</p>
          <h2>Direto da fonte</h2>
          <p className="lede">
            Este site é um guia secundário e não oficial. Estas são as fontes primárias — as três primeiras são o
            próprio padrão.
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
          <h2>Leia. Construa com base nele. Conte o que quebrar.</h2>
          <p className="lede" style={{ margin: '0 auto 26px' }}>
            A especificação está publicada e é livre para implementar. Para construir com base nela, escrever skills,
            conduzir uma sessão de Story Archaeology ou entrar no grupo de trabalho, fale diretamente com o projeto.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Link className="btn primary" to="/pt/get-started">
              Comece agora →
            </Link>
            <a className="btn" href={INVOLVED_FORM_URL} target="_blank" rel="noreferrer">
              Participe ↗
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
