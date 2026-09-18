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
  ['source (envelope)', <><code>originating_system</code> — o campo antigo é rejeitado sem exceção</>],
  ['signature (envelope)', <>Rejeitado sem exceção. Não existe campo de assinatura.</>],
  ['sources[]', <><code>editorial_source[]</code> — credibilidade <code>TRUSTED</code> | <code>VERIFIED</code> | <code>ENDORSED</code> | <code>UNVERIFIED</code></>],
  ['skills_config.broadcaster', <><code>skills_config.newsroom</code> (a chave antiga é rejeitada)</>],
  ['broadcaster_id', <>Rejeitado sem exceção. <code>newsroom_id</code> é opcional na 1.0, derivado de <code>skills_config.newsroom</code> se ausente</>],
  ['collaboration.version', <><code>collaboration.editing_version</code></>],
  ['content_ref (singular)', <><code>content_refs[]</code></>],
  ['instances[]', <><b>Rejeitado sem exceção.</b> A distribuição é modelada por links e tellings</>],
  ['instance_ref (warning)', <><b>Rejeitado sem exceção.</b> As saídas definem o escopo via <code>scope</code>: <code>link:</code>, <code>asset:</code> ou <code>story:</code></>],
  ['ai_enrichments[]', <><b>Rejeitado sem exceção</b> desde a v0.3.2. Saída generativa que é publicada é uma entrada em <code>assets[]</code> com <code>provenance</code>; afirmações sobre o conteúdo são <code>assertions[]</code></>],
  ['media_refs[].flow_id', <><code>source</code> (<code>tams://store/id</code>) + <code>time_range</code>, ou um <code>locator</code></>],
  ['editorial_gates[].blocks como strings', <>Obsoleto. Use <code>&#123; "kind": "ASSET" | "PHASE", "ref": … &#125;</code></>],
];

const WITHDRAWN: [string, string][] = [
  ['assets[].voice_count', 'Um inteiro opcional que carregava uma regra de classificação editorial que nunca chegou a ser definida.'],
  ['assets[].status → FINALIZING', 'Um membro de enum proposto para uma saída derivada ainda em finalização; nunca ratificado.'],
  ['transforms[].transform_id', 'Um identificador opcional e estável de auditoria para uma única transformação; ainda em discussão.'],
];

export default function Envelope() {
  useHashScroll();

  return (
    <>
      <PageHead
        eyebrow="Referência · SOM 1.0"
        title="O envelope"
        lede="Um único invólucro, compartilhado por todas as mensagens de todas as famílias. É um objeto fechado: campos de nível superior desconhecidos reprovam na validação, e os antigos campos source e signature são rejeitados de saída."
        toc={[
          { href: '#fields', label: 'Campos' },
          { href: '#rules', label: 'Regras de conformidade' },
          { href: '#warning', label: 'skill.warning.raised' },
          { href: '#migration', label: 'Vindo da v0.3.2' },
          { href: '#retired', label: 'Renomeados e aposentados' },
          { href: '#extensions', label: 'Extensions' },
        ]}
      />

      <section id="fields">
        <div className="wrap">
          <p className="eyebrow">Anatomia</p>
          <h2>Cada campo, um de cada vez</h2>
          <p className="lede" style={{ marginBottom: 28 }}>
            Clique numa chave para ler o que ela carrega e onde ela costuma pegar as pessoas. Os valores de exemplo
            seguem o passo 6 do exemplo do furacão desenvolvido na especificação.
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
          <p className="eyebrow">Conformidade</p>
          <h2>A barra é mais baixa do que você pensa</h2>
          <p className="lede">
            Um sistema está conforme com o SOM 1.0 se toda mensagem que publica é um envelope válido, todo payload
            valida contra o schema do seu <code>message_type</code> declarado, e ele ignora o que não reconhece.
            Um sistema de pauta que só publica <code>story.context</code> e só lê avisos está plenamente
            conforme.
          </p>

          <div className="grid g2" style={{ marginTop: 26 }}>
            <div className="card">
              <span className="kicker">01</span>
              <h3>
                Emita <code>"1.0.0"</code>, nunca ramifique com base nele
              </h3>
              <p className="small mb0">
                Produtores emitem a versão do pacote com a qual estão conformes; um futuro produtor 1.1 emite{' '}
                <code>"1.1.0"</code>. Consumidores não podem mudar de comportamento com base em{' '}
                <code>som_version</code> — isso quebra na 1.1 por definição. E{' '}
                <code>"0.3.2"</code> não é SOM 1.0: o schema deixa o campo aberto, então um consumidor conforme precisa
                aplicar essa regra por conta própria.
              </p>
            </div>
            <div className="card">
              <span className="kicker">02</span>
              <h3>
                <code>message_type</code> é o único discriminador
              </h3>
              <p className="small mb0">
                Escolha o schema do payload por ele. Não pelo topic, por um nome de arquivo, pela identidade do
                publicador ou pelo formato do payload.
              </p>
            </div>
            <div className="card">
              <span className="kicker">03</span>
              <h3>
                Valide <code>format</code>
              </h3>
              <p className="small mb0">
                O JSON Schema trata <code>format</code> como anotação, então a maioria dos validadores aceita{' '}
                <code>"message_id": "NOT-A-UUID"</code> sem nenhum erro. A conformidade exige validação de{' '}
                <code>uuid</code> e <code>date-time</code> — em Node, <code>ajv/dist/2020</code> mais{' '}
                <code>ajv-formats</code>; em Python, um <code>format_checker</code> e <code>rfc3339-validator</code>.
              </p>
            </div>
            <div className="card">
              <span className="kicker">04</span>
              <h3>Ignore o que você não reconhece</h3>
              <p className="small mb0">
                Chaves desconhecidas em <code>extensions</code> são ignoradas, nunca motivo de rejeição. Um{' '}
                <code>message_type</code> que você não trata também é ignorado — e é isso que permite à 1.x
                acrescentar famílias sem quebrar ninguém.
              </p>
            </div>
            <div className="card">
              <span className="kicker">05</span>
              <h3>
                <code>correlation_id</code> e <code>topic</code> são obrigatórios
              </h3>
              <p className="small mb0">
                <code>correlation_id</code> liga todas as mensagens sobre o ciclo de vida de uma história.{' '}
                <code>topic</code> deve começar com <code>som.</code> — fora isso, a organização dos topics é com você.
              </p>
            </div>
            <div className="card">
              <span className="kicker">+</span>
              <h3>Diga o que você produz e consome</h3>
              <p className="small mb0">
                As implementações deveriam declarar quais famílias publicam e quais leem. É essa declaração, e não o
                tamanho da implementação, que um integrador precisa.{' '}
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
            O que uma skill declarou sobre uma história, colocado na pipeline pelo executor na ferramenta que a
            acionou (recall). Doze campos obrigatórios, um objeto fechado e dois campos explicitamente proibidos.
          </p>

          <FieldExplorer fields={WARNING_FIELDS} samples={WARNING_SAMPLES} />

          <div className="grid g2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card">
              <span className="kicker">O escopo é o nível de disparo</span>
              <p className="small">
                <code>link:&#123;link_id&#125;</code> para uma skill específica de um destino,{' '}
                <code>asset:&#123;asset_id&#125;</code> para um asset, <code>story:&#123;story_id&#125;</code> para a
                história inteira.
              </p>
              <p className="small mb0">
                Uma liberação só vale no escopo em que o hold foi declarado: uma liberação de <code>link</code> nunca
                derruba um hold de <code>story</code>.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Timestamps ficam no envelope</span>
              <p className="small mb0">
                O payload do aviso rejeita tanto <code>timestamp</code> quanto o aposentado <code>instance_ref</code>.
                Quando o aviso foi levantado é o <code>timestamp</code> do envelope; o que o causou é o{' '}
                <code>causation_id</code> do envelope.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="migration">
        <div className="wrap">
          <p className="eyebrow">Migração</p>
          <h2>Vindo da v0.3.2</h2>
          <p className="lede">
            A 1.0 é uma ruptura limpa — e pequena: pare de emitir três campos retirados, emita{' '}
            <code>som_version: "1.0.0"</code> e ative a validação de formatos. Todos os outros campos, tipos, enums e
            restrições continuam iguais.
          </p>

          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Retirado na 1.0</th>
                  <th>O que era</th>
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
              <span className="kicker">Os identificadores mudaram</span>
              <p className="small mb0">
                Todo <code>$id</code> de schema agora é uma URL resolvível que serve o arquivo, como{' '}
                <code className="url">{`${SCHEMA_BASE_URL}/story-context.schema.json`}</code>, estável por toda a vida
                da 1.x. Os antigos identificadores <code>som.spec/schema/v0.3…</code> nunca foram resolvíveis.
              </p>
            </div>
            <div className="card">
              <span className="kicker">A estrutura é plana</span>
              <p className="small mb0">
                Os três diretórios de versão sumiram: um arquivo por família, sem versão no nome do arquivo. Tudo o que
                despachava por <code>"v0.3.2"</code> num caminho de schema deve passar a selecionar pela família.{' '}
                <code>authenticity_credential</code>, proposto na v0.3.2, entra na 1.0 como normativo.
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
          <p className="eyebrow">Renomeados e aposentados</p>
          <h2>Caminhos antigos que não validam mais</h2>
          <p className="lede">
            Se um produtor ou uma configuração é anterior ao congelamento do envelope na v0.3, estes itens mudaram de
            lugar — ou são rejeitados pelos schemas 1.0.
          </p>
          <div className="table-scroll" style={{ marginTop: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Antes</th>
                  <th>Agora</th>
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
          <h2>O lugar definido para o que o padrão não carrega</h2>
          <p>
            O envelope, a história e todas as famílias de eventos aceitam um objeto <code>extensions</code> cujas chaves
            devem casar com <code>com.&#123;vendor&#125;.</code> — qualquer outra coisa reprova na validação. Os
            consumidores ignoram chaves que não reconhecem.
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
              <em>Valores de enum</em> de fornecedores seguem outra convenção: <code>x-</code> mais um token em
              minúsculas — <code>x-graphics_pack</code>. Ela vale para os registros governados, mas extensíveis, como{' '}
              <code>asset_type</code>, <code>source_type</code> e <code>transform_type</code>.
            </li>
            <li>
              As tags têm seu próprio esquema de fornecedor: <code>com.&#123;vendor&#125;.&#123;name&#125;</code> ao
              lado de <code>newsroom</code> e <code>iptc-mediatopic</code>.
            </li>
          </ul>
          <p className="mb0">
            <Link to="/pt/bus">A seguir: as sete famílias a que essas mensagens pertencem →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
