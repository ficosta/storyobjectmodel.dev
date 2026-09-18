import type { Faq } from '../../../data/faq';

export type { Faq } from '../../../data/faq';

/**
 * The questions people ask on first meeting the model, in pt-BR. Follows the
 * English module item for item.
 */
export const FAQS: Faq[] = [
  {
    q: 'Alguma coisa age por conta própria?',
    a: 'Não. Uma skill <em>declara</em> o que é verdade sobre uma Story; a ferramenta dona do executor decide o que fazer a respeito; uma pessoa aprova tudo o que chega a um público. Uma liberação é concedida a uma versão específica do texto, então uma reescrita reabre o gate em vez de herdar a aprovação. Se uma regra não pode ser avaliada, a saída que ela protege continua segurada e uma pessoa decide.',
  },
  {
    q: 'Isso é para substituir jornalistas?',
    a: 'É para capturar o julgamento deles. As decisões que dão forma a uma história já existem — numa conversa de chat, num novo briefing, na cabeça de alguém — e somem na troca de turno. Escrevê-las na Story coloca cada decisão no registro, atribuída a quem a tomou. A pessoa deixa de carregar estado entre sistemas e passa a tomar a decisão.',
  },
  {
    q: 'O que impede dois sistemas de escreverem versões conflitantes da mesma Story?',
    a: 'Um único escritor. O sistema de gestão de histórias do publicador cria a Story e é dono do seu <code>sequence_number</code> — nunca a agência, nem mesmo num flash. Todo o resto contribui pela sua própria família de mensagens. Quando as skills divergem, os gates se combinam por <b>conjunção</b> (um único hold basta para segurar), a conformidade é fail-closed e uma transformação nunca levanta um hold.',
  },
  {
    q: 'Quem opera a pipeline, e o que acontece quando ela cai?',
    a: 'Cada redação opera a sua, como qualquer outra infraestrutura de mensageria da casa. Quando ela está fora do ar, as ferramentas continuam funcionando sozinhas, como hoje, e se reconciliam ao reconectar — nada depende da pipeline para continuar no ar. Como a Story é republicada inteira, uma ferramenta que volta lê um único objeto e já está atualizada.',
  },
  {
    q: 'O SOM está preso ao Kafka, ou a algum broker?',
    a: 'Não. O SOM define um envelope e sete famílias de payload transportadas sobre uma pipeline publish/subscribe comum. A única regra de topic é que ele comece com <code>som.</code> — e, de qualquer forma, um consumidor nunca deduz o tipo de payload a partir do topic; <code>message_type</code> é o único discriminador.',
  },
  {
    q: 'Por que não apontar um modelo para os sistemas que já temos?',
    a: 'Uma consulta de recuperação responde a uma única pergunta para uma única ferramenta, e ninguém mais vê a resposta. Uma produção precisa do contrário: um estado que toda ferramenta lê de forma idêntica, gates que continuam valendo quando o trabalho passa de um fornecedor para outro, e um registro atribuído de cada decisão. A posição do padrão é que modelos são consumidores do SOM, não um substituto para ele.',
  },
  {
    q: 'A mídia trafega na pipeline?',
    a: 'Nunca. Assets são referências. Na junção com o TAMS, uma Story aponta para uma URI de Source e um intervalo de tempo; um MAM ou qualquer outro storage é endereçado do mesmo jeito, por meio de um <code>locator</code>. A vinculação da mídia a uma Story acontece no ato editorial, nunca na ingestão.',
  },
  {
    q: 'O que acontece com os sistemas que já usamos?',
    a: 'Eles continuam. O SOM não é um MAM, um espelho nem um produto, e não substitui nada. O MOS continua funcionando, com uma ponte que o deixa mais inteligente, e o que você construiu com agentes continua sendo seu. Um sistema basta para começar.',
  },
  {
    q: 'Como adiciono um campo que a especificação não tem?',
    a: 'Coloque-o em <code>extensions["com.{vendor}.{field}"]</code>. Os consumidores DEVEM ignorar as chaves de extensão que não reconhecem e NÃO DEVEM rejeitar a mensagem por causa delas. Valores de enum de fornecedores usam o prefixo <code>x-</code> — <code>x-graphics_pack</code>.',
  },
  {
    q: 'Por que snapshots completos em vez de deltas?',
    a: 'Porque os consumidores entram tarde, reiniciam e perdem mensagens. Uma mensagem <code>story.context</code> é o estado completo da Story, então omissão significa <em>ausente</em>, não <em>sem alteração</em>. Um escritor que envia só os seus próprios campos apaga em silêncio o trabalho de todos os outros — a declaração de conformidade chama isso de o erro mais danoso que uma implementação pode cometer.',
  },
  {
    q: 'Como o padrão muda, e quem decide?',
    a: 'Às claras. Toda mudança chega como um pull request para <code>storyobjectmodel/som</code>, e qualquer um pode abrir um. Dentro da 1.x só entram mudanças aditivas; remover ou renomear qualquer coisa fica para a 2.0, e um campo descontinuado continua funcionando até lá. O que ainda não está resolvido fica listado no registro de questões em aberto.',
  },
  {
    q: 'De quem ele é?',
    a: 'De ninguém. O padrão é aberto e sem dono. Schemas, exemplos, ferramentas e skills estão sob Apache 2.0; o texto da especificação, sob CC BY 4.0. Não há taxa nem nada para assinar.',
  },
  {
    q: 'O que é Story Archaeology?',
    a: 'O método de onde o modelo veio. Pegue uma história real depois da exibição e rastreie como o seu contexto de fato circulou, salto a salto, entre pessoas e sistemas — onde o conhecimento foi criado, onde se perdeu e quem o carregou na mão. Story, Asset e Telling foram transcritos dessas sessões, não inventados.',
  },
];
