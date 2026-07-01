/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Article, Category, Tag, PortalComment } from '../types';

export const categories: Category[] = [
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    description: 'Hardware, wearables, internet das coisas, novidades do mercado de smartphones, gadgets e o futuro do consumo digital.',
    color: '#D946EF' // Pink / Purple
  },
  {
    id: 'ia',
    name: 'Inteligência Artificial',
    description: 'Modelos de linguagem, automação, agentes inteligentes, aprendizado de máquina e os impactos éticos da revolução cognitiva.',
    color: '#38BDF8' // Blue
  },
  {
    id: 'games',
    name: 'Games',
    description: 'Análises de jogos, consoles de nova geração, e-sports, indies de sucesso e notícias da indústria de games.',
    color: '#10B981' // Green
  },
  {
    id: 'filmes',
    name: 'Filmes',
    description: 'Críticas de cinema, blockbusters mundiais, cinema independente, festivais e novidades do circuito cinematográfico.',
    color: '#F59E0B' // Amber
  },
  {
    id: 'series',
    name: 'Séries',
    description: 'Maratonas, lançamentos no streaming (Netflix, Max, Disney+, Prime Video) e tudo sobre as produções de TV.',
    color: '#EF4444' // Red
  },
  {
    id: 'animes',
    name: 'Animes',
    description: 'Análises de temporadas, novidades das animações japonesas e os estúdios de maior relevância no mundo otaku.',
    color: '#8B5CF6' // Violet
  },
  {
    id: 'mangas',
    name: 'Mangás',
    description: 'Notícias sobre lançamentos editoriais brasileiros e japoneses, capítulos semanais e mercado de colecionadores.',
    color: '#EC4899' // Pink
  },
  {
    id: 'hqs',
    name: 'HQs',
    description: 'Quadrinhos ocidentais, Marvel, DC Comics, graphic novels nacionais, selos independentes e cultura geek de papel.',
    color: '#6366F1' // Indigo
  }
];

export const initialTags: Tag[] = [
  { id: '1', name: 'OpenAI', slug: 'openai' },
  { id: '2', name: 'PlayStation 5', slug: 'playstation-5' },
  { id: '3', name: 'Marvel Studios', slug: 'marvel-studios' },
  { id: '4', name: 'Netflix', slug: 'netflix' },
  { id: '5', name: 'One Piece', slug: 'one-piece' },
  { id: '6', name: 'Inteligência Artificial', slug: 'inteligencia-artificial' },
  { id: '7', name: 'Hardware', slug: 'hardware' },
  { id: '8', name: 'Ray Tracing', slug: 'ray-tracing' },
  { id: '9', name: 'ChatGPT', slug: 'chatgpt' },
  { id: '10', name: 'Smartphones', slug: 'smartphones' }
];

export const initialArticles: Article[] = [
  {
    id: 'ia-nova-geracao-agentes',
    title: 'A Revolução dos Agentes Autônomos de IA no Trabalho Diário',
    subtitle: 'Novos modelos transcendem chats convencionais e realizam fluxos complexos de engenharia e análise sem supervisão.',
    summary: 'A revolução dos agentes autônomos está mudando a forma como interagimos com a tecnologia no ambiente profissional. Entenda como essa nova classe de IA vai além das respostas de texto simples.',
    content: `A Inteligência Artificial deu seu passo mais ousado desde o estouro dos Grandes Modelos de Linguagem (LLMs). Entramos na era dos **Agentes de IA Autônomos**, softwares capazes de receber objetivos de alto nível, raciocinar, planejar ações, executar ferramentas e iterar até atingir o resultado esperado sem intervenção humana constante.

### O que são Agentes Autônomos?

Diferente do ChatGPT tradicional, que aguarda passivamente por perguntas, um agente autônomo opera em um loop contínuo de pensamento e ação. Se você pedir a um agente para: *"Encontre 5 potenciais fornecedores de baterias sustentáveis na América Latina, envie um e-mail solicitando cotação e compile as respostas em uma planilha"*, ele irá realizar cada etapa, lidando com erros e corrigindo caminhos no meio do processo.

### Principais Casos de Uso na Indústria

1. **Desenvolvimento de Software:** IA como o Devin e ferramentas similares codificam repositórios inteiros, testam bugs em ambientes isolados e realizam o deploy de forma autônoma.
2. **Atendimento ao Cliente de Próxima Geração:** Bots inteligentes não usam mais respostas prontas; eles acessam sistemas internos, localizam o status de pedidos e resolvem estornos de forma segura.
3. **Análise de Dados de Mercado:** Scrapers automatizados geridos por agentes avaliam oscilações financeiras em tempo real, gerando relatórios macroeconômicos integrados.

### Desafios Éticos e de Segurança

O avanço rápido levanta preocupações cruciais. À medida que damos autonomia financeira e operacional aos agentes (como cartões de crédito corporativos virtuais), as barreiras de segurança (*sandboxing*) tornam-se indispensáveis. Falhas de segurança conhecidas como *prompt injection* indiretas podem fazer com que agentes executem códigos maliciosos ao ler dados externos de páginas web infectadas.

O futuro não reside na substituição pura e simples dos humanos, mas na orquestração de **equipes híbridas**, onde um profissional humano gerencia dezenas de agentes virtuais altamente focados em tarefas complexas.`,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Ilustração conceitual de redes neurais e agentes digitais conectados',
    categoryId: 'ia',
    tags: ['Inteligência Artificial', 'OpenAI', 'ChatGPT'],
    author: {
      name: 'Sofia Alencar',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      role: 'Editora-Chefe de IA'
    },
    createdAt: '2026-06-28T09:00:00-03:00',
    readTime: 6,
    views: 1240,
    published: true,
    featured: true
  },
  {
    id: 'games-gta6-trailer-analise',
    title: 'Análise Completa das Mecânicas Reveladas no Novo Trailer de GTA VI',
    subtitle: 'Gráficos ultra-realistas, densidade urbana de Leonida e sistema de físicas avançado surpreendem entusiastas de hardware.',
    summary: 'Mergulhamos em cada frame do material oficial divulgado pela Rockstar Games para desvendar o que há de mais revolucionário em termos de jogabilidade, NPCs e renderização.',
    content: `A Rockstar Games voltou a quebrar a internet com a divulgação de novos detalhes do aguardadíssimo **Grand Theft Auto VI**. Ambientado no estado fictício de Leonida (inspirado na Flórida), o game promete redefinir as fronteiras de mundo aberto, interatividade e realismo técnico.

### Iluminação Global e Ray Tracing

O novo motor gráfico **RAGE 9** traz soluções inovadoras de Ray Tracing por hardware que funcionam até mesmo nos consoles de geração atual. Reflexos em poças de água e latarias metálicas de carros, refração de luz através de folhagens densas e o ciclo de transição solar mostram uma fidelidade visual nunca vista no gênero.

### Densidade Populacional Sem Precedentes

Um dos pontos de maior destaque é a densidade de NPCs nas praias de Vice City e nos bairros periféricos. A Rockstar implementou um novo algoritmo de comportamento social que faz com que cada cidadão virtual reaja de forma única a eventos climáticos, ações do jogador e tendências de redes sociais in-game.

### Novidades em Jogabilidade e Narrativa Dupla

* **Dupla Dinâmica:** A relação entre Lucia e Jason será o núcleo emocional do jogo, com mecânicas de assalto coordenadas e troca instantânea de personagens.
* **Ecossistema Vivo:** Pântanos habitados por crocodilos gigantes, manguezais com física de lama realista e vida selvagem agressiva garantem que sair das estradas pavimentadas seja uma verdadeira aventura.
* **Mídias Sociais Integradas:** Grande parte do dinamismo social do jogo se dará por transmissões de vídeo verticais ao vivo in-game, espelhando nossa cultura hiperconectada moderna.

GTA VI continua agendado para o próximo ano, e a expectativa da indústria é que este seja o produto cultural de maior impacto comercial da década.`,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Visão noturna de uma cidade costeira repleta de neon e tráfego intenso',
    categoryId: 'games',
    tags: ['PlayStation 5', 'Ray Tracing', 'Games'],
    author: {
      name: 'Gabriel "Gamer" Costa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'Especialista em Jogos'
    },
    createdAt: '2026-06-27T15:30:00-03:00',
    readTime: 5,
    views: 3120,
    published: true,
    featured: true
  },
  {
    id: 'tecnologia-chips-organicos',
    title: 'A Nova Era dos Processadores Orgânicos e Biocomputação',
    subtitle: 'Cientistas conseguem integrar neurônios biológicos cultivados em laboratório com microchips de silício para tarefas de IA.',
    summary: 'O casamento definitivo entre biologia e eletrônica está acontecendo. Saiba como os bioprocessadores conseguem reduzir o consumo de energia em até 1 milhão de vezes comparados às GPUs tradicionais.',
    content: `O desenvolvimento de chips baseados em silício está batendo nos limites físicos da Lei de Moore. Para continuar evoluindo em poder computacional sem fritar as matrizes de energia globais, cientistas de ponta iniciaram pesquisas comerciais com **bioprocessadores orgânicos**, conectando neurônios de laboratório reais com eletrodos de microescala.

### Consumo Energético Próximo a Zero

O cérebro humano opera com aproximadamente 20 Watts de potência — o suficiente para realizar cálculos lógicos, processar sentidos, criar memórias e coordenar o corpo simultaneamente. Em contraste, um cluster moderno de servidores de IA consome megawatts. Chips orgânicos prometem levar essa incrível eficiência energética para as redes locais.

### Aprendizado Baseado em Plasticidade Sináptica

Enquanto as redes neurais artificiais precisam de rodadas massivas de retropropagação e supercomputadores para treinar parâmetros, o tecido vivo aprende de forma dinâmica adaptando suas próprias conexões sinápticas físicos em segundos.

* **Interação Direta:** Os neurônios biológicos recebem sinais elétricos codificados e respondem devolvendo padrões que os microcontroladores traduzem em lógica binária.
* **Auto-regeneração:** Diferente de circuitos integrados tradicionais que se degradam, bioprocessadores mantêm atividades de manutenção celular automáticas.

Embora ainda estejamos na infância dessa tecnologia comercial, os primeiros kits de desenvolvimento já estão sendo disponibilizados em nuvem para universidades parceiras realizarem ensaios laboratoriais pioneiros.`,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Imagem microscópica de caminhos de silício dourados fundidos com padrões orgânicos',
    categoryId: 'tecnologia',
    tags: ['Hardware', 'Inteligência Artificial', 'Tecnologia'],
    author: {
      name: 'Dr. Lucas Ribeiro',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'Redator de Ciência e Tecnologia'
    },
    createdAt: '2026-06-26T11:45:00-03:00',
    readTime: 8,
    views: 950,
    published: true,
    featured: false
  },
  {
    id: 'filmes-dune-part-three',
    title: 'Duna Parte 3: O Messias de Duna Confirmado pelo Diretor Denis Villeneuve',
    subtitle: 'Adaptação do segundo livro da saga espacial fechará a trilogia icônica com foco na desconstrução do herói Paul Atreides.',
    summary: 'A Legendary Entertainment e a Warner Bros. deram sinal verde para a conclusão da trilogia de Denis Villeneuve. Entenda os desafios de adaptar o complexo romance filosófico.',
    content: `O cineasta Denis Villeneuve oficializou o início dos trabalhos de pré-produção de **Duna: Parte 3**, que adaptará o romance subsequente de Frank Herbert, *O Messias de Duna*. O longa promete fechar de forma grandiosa a jornada de desconstrução mística em torno de Paul Atreides (Timothée Chalamet).

### A Queda de um Ídolo Espacial

Se as duas primeiras partes representaram a clássica jornada do herói, o terceiro capítulo promete chocar os espectadores que não leram os romances originais. Herbert escreveu o segundo livro com o propósito claro de alertar a humanidade sobre os perigos de seguir líderes messiânicos cegamente.

> "A saga de Paul não é sobre a salvação da galáxia, mas sim sobre o início de uma guerra santa cósmica inevitável que ele próprio tentou desesperadamente evitar." — Denis Villeneuve.

### O Retorno do Elenco e Novos Rostos

Além de Chalamet, estão confirmados os retornos de **Zendaya** (Chani), **Florence Pugh** (Princesa Irulan) e **Anya Taylor-Joy** (Alia Atreides). Rumores de bastidores apontam que as filmagens começarão no final deste ano com locações nos desertos da Jordânia e do Marrocos.`,
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Deserto infinito com dunas douradas e sol escaldante no horizonte',
    categoryId: 'filmes',
    tags: ['Marvel Studios', 'Netflix', 'Filmes'],
    author: {
      name: 'Mariana Drummond',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      role: 'Crítica de Cinema'
    },
    createdAt: '2026-06-25T14:20:00-03:00',
    readTime: 4,
    views: 1840,
    published: true,
    featured: false
  },
  {
    id: 'series-house-of-the-dragon-temporada3',
    title: 'A Dança dos Dragões Entra em sua Fase Mais Sangrenta na Nova Temporada',
    subtitle: 'Com batalhas navais marcadas e traições familiares internas, série da HBO amplia orçamento e entrega espetáculo épico.',
    summary: 'Análise antecipada dos novos episódios de House of the Dragon detalha os novos dragões e as alianças secretas firmadas em Westeros.',
    content: `A épica guerra civil Targaryen, conhecida como **A Dança dos Dragões**, atinge seu ápice absoluto na terceira temporada de *House of the Dragon*. Com os Pretos (Rhaenyra) e os Verdes (Aegon II) sem possibilidade alguma de negociação amigável, o conflito se alastra por cada canto de Westeros.

### Batalhas Dracônicas em Larga Escala

A produção do show confirmou que esta temporada contará com o maior orçamento de efeitos visuais da história da franquia, incluindo a icônica Batalha da Goela, envolvendo frotas navais completas e múltiplos dragões simultâneos no ar.

### Novos Dragões Entram em Combate

A busca por "Sementes de Dragão" (bastardos Targaryen capazes de domar dragões selvagens) surtiu efeito, alterando completamente a balança de poder militar. Dragões monstruosos como **Vermithor** e **Silverwing** agora estão armados para voar a favor dos Pretos, o que forçará Aemond e seu titã Vhagar a traçarem táticas desesperadas.`,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Pintura clássica com tonalidades de fogo e dragões mitológicos estilizados',
    categoryId: 'series',
    tags: ['Netflix', 'Séries'],
    author: {
      name: 'Mariana Drummond',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      role: 'Crítica de Cinema'
    },
    createdAt: '2026-06-24T18:10:00-03:00',
    readTime: 5,
    views: 2310,
    published: true,
    featured: false
  },
  {
    id: 'animes-solo-leveling-retorno',
    title: 'Solo Leveling: Segunda Temporada Promete Elevar o Nível de Animação em 2026',
    subtitle: 'Estúdio A-1 Pictures foca em batalhas brutais e na evolução das sombras de Sung Jinwoo no novo arco.',
    summary: 'O fenômeno global de Solo Leveling está pronto para retornar. Confira os detalhes de produção divulgados pelos roteiristas e o novo trailer oficial.',
    content: `Depois do sucesso avassalador de sua estreia, a adaptação para anime da webnovel coreana **Solo Leveling** está pronta para retornar aos holofotes globais na nova temporada intitulada *Arise from the Shadow*.

### O Despertar do Exército das Sombras

Agora consagrado como o Monarca das Sombras, Sung Jinwoo iniciará a convocação de generais mortos-vivos colossais de suas batalhas anteriores. A direção artística do A-1 Pictures promete refinar o design de luzes e sombras para ilustrar a imponência escura das tropas de Jinwoo.

### Trilha Sonora de Tirar o Fôlego

O mestre **Hiroyuki Sawano** (responsável por trilhas de *Attack on Titan* e *Kill la Kill*) retorna para assinar o álbum orquestral, misturando batidas techno industriais com coros gregorianos dramáticos durante as incursões às masmorras de rank S.`,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Ilustração artística inspirada em guerreiros estilizados no escuro com olhos azuis brilhantes',
    categoryId: 'animes',
    tags: ['One Piece', 'Animes'],
    author: {
      name: 'Takeshi Tanaka',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      role: 'Correspondente Geek Japão'
    },
    createdAt: '2026-06-23T10:15:00-03:00',
    readTime: 4,
    views: 2900,
    published: true,
    featured: false
  },
  {
    id: 'mangas-one-piece-fim-proximo',
    title: 'Eiichiro Oda Confirma Revelações Chocantes Sobre o Século Perdido em Novo Volume',
    subtitle: 'Com a conclusão da saga de Egghead, o mangá de maior sucesso da história entra na sua reta final em Elbaf.',
    summary: 'Preparem os corações: pistas fundamentais sobre a arma ancestral Uranus e o mistério de Joy Boy começam a se conectar de maneira épica.',
    content: `O autor de **One Piece**, Eiichiro Oda, não cansa de surpreender os leitores mundiais. O mangá que ultrapassou a marca histórica de 500 milhões de cópias vendidas está entregando revelações monumentais a cada capítulo da sua fase atual.

### A Chegada ao Reino dos Gigantes: Elbaf

Após escaparem por um triz do cerco militar tecnológico na ilha do futuro Egghead, a tripulação dos Chapéus de Palha ancora nas praias de **Elbaf**, a ilha dos guerreiros gigantes nórdicos. Este é um dos destinos mais aguardados e sugeridos desde os primórdios da aventura na saga de Little Garden.

### O Clímax do Século Perdido

As transmissões globais feitas por Vegapunk expuseram a verdade sobre o afundamento do mundo antigo devido ao uso de armas ancestrais no passado. Com isso, os segredos gravados nas pedras indestrutíveis do Poneglyph ganham um senso de urgência militar inegável.`,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Ilustração artística de um mar agitado e navio navegando em direção à aventura',
    categoryId: 'mangas',
    tags: ['One Piece', 'Mangás'],
    author: {
      name: 'Takeshi Tanaka',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      role: 'Correspondente Geek Japão'
    },
    createdAt: '2026-06-22T08:30:00-03:00',
    readTime: 6,
    views: 3410,
    published: true,
    featured: false
  },
  {
    id: 'hqs-marvel-reboot-universo-ultimate',
    title: 'Como o Novo Universo Ultimate da Marvel Está Salvando os Quadrinhos',
    subtitle: 'Liderado por Jonathan Hickman, reboot ousado cria novas versões de heróis clássicos sem amarras cronológicas cansativas.',
    summary: 'A Marvel acertou em cheio ao relançar a linha Ultimate. Saiba como o novo Homem-Aranha casado e maduro conquistou leitores e o mercado de quadrinhos ocidentais.',
    content: `A indústria de quadrinhos americanos de heróis vinha sofrendo de fadiga criativa crônica. Décadas de cronologias densas, reboots parciais incoerentes e mortes falsas de personagens afastaram novos leitores interessados. É nesse cenário que surge o novo **Universo Ultimate**, encabeçado pelo genial roteirista Jonathan Hickman.

### Homem-Aranha Maduro e Humano

A decisão de criar um Peter Parker que só ganha seus poderes de aranha aos 35 anos — já casado com Mary Jane e pai de dois filhos — foi o sopro de novidade mais aclamado das HQs nos últimos dez anos. O herói lida de maneira realista com responsabilidades de trabalho diárias e os riscos familiares de vestir o capuz.

### Os Supremos de Jonathan Hickman

Diferente da versão militarista dos anos 2000, os novos Supremos (Vingadores) funcionam como uma célula rebelde clandestina que tenta libertar a Terra de uma oligarquia secreta liderada pelo maligno Criador (Reed Richards malvado).

Cada volume da nova linha está esgotando em tiragens sucessivas nas lojas especializadas americanas e brasileiras, demonstrando que o público nerd clama por narrativas audaciosas com início, meio e fim planejados de forma inteligente.`,
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Páginas coloridas de quadrinhos de ação geek empilhados',
    categoryId: 'hqs',
    tags: ['Marvel Studios', 'HQs'],
    author: {
      name: 'Gabriel "Gamer" Costa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'Especialista em Jogos'
    },
    createdAt: '2026-06-21T11:00:00-03:00',
    readTime: 5,
    views: 1540,
    published: true,
    featured: false
  }
];

export const initialComments: PortalComment[] = [
  {
    id: 'c1',
    articleId: 'ia-nova-geracao-agentes',
    authorName: 'Rodrigo Medeiros',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    content: 'Sensacional essa análise! Na minha empresa já estamos rodando scripts automatizados baseados em agentes para monitorar servidores. A economia de tempo é absurda.',
    createdAt: '2026-06-28T11:20:00-03:00',
    approved: true
  },
  {
    id: 'c2',
    articleId: 'ia-nova-geracao-agentes',
    authorName: 'Patrícia Sales',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80',
    content: 'Muito boa a explicação! A minha única preocupação real são os vazamentos de dados proprietários se esses agentes usarem LLMs públicas não auditadas.',
    createdAt: '2026-06-28T13:45:00-03:00',
    approved: true
  },
  {
    id: 'c3',
    articleId: 'games-gta6-trailer-analise',
    authorName: 'Bruno Alencar',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
    content: 'Esse jogo vai revolucionar tudo de novo. A Rockstar joga em outra liga profissional, não tem jeito.',
    createdAt: '2026-06-27T17:00:00-03:00',
    approved: true
  }
];
