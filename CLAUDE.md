# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Site do **Studio Web**, negócio de Niterói/RJ que vende landing pages para autônomos e pequenos negócios. Todo o texto visível ao usuário é em **português do Brasil** — mantenha copy nova em pt-BR, no mesmo tom informal e direto do que já existe. Respostas e comentários também em português.

## Como rodar

Site estático, sem build, sem dependências e sem suíte de testes. Não há nada para instalar ou compilar.

- Abra o `index.html` direto, ou use o Live Server do VS Code (`.vscode/settings.json` fixa a porta **5501** → http://127.0.0.1:5501/index.html).
- Qualquer servidor estático serve, ex.: `python -m http.server 5501`.
- As mudanças aparecem ao recarregar; não existe HMR, bundler nem minificador no fluxo.

## Estrutura

Na raiz: `index.html` (a landing principal), `404.html`, `style.css`, `script.js`, `logo.png`, `robots.txt`, `sitemap.xml`, `llms.txt`.

Cada página interna é um **diretório com `index.html` dentro**, o que dá URL limpa com barra final na Vercel:

```
/criacao-de-site-em-niteroi/          intenção local
/quanto-custa-uma-landing-page/       página de resposta
/landing-page-para-manicure/          nicho
/landing-page-para-fotografo/         nicho
/landing-page-para-personal-trainer/  nicho
```

Todas compartilham o mesmo `style.css` e `script.js` — **referenciados por caminho absoluto** (`/style.css`, `/script.js`, `/logo.png`), porque caminho relativo quebra a partir de subdiretório. Não introduza framework, gerenciador de pacotes ou etapa de build sem ser pedido; o formato sem dependências é proposital.

**Ao criar uma página nova**, além do arquivo: acrescente a URL ao `sitemap.xml` (com barra final), uma linha na seção `## Páginas` do `llms.txt`, e um link na coluna "Páginas" do rodapé do `index.html`.

## Convenções que importam

**O número de WhatsApp fica no HTML, escrito por extenso.** Os 6 links `wa.me/` do `index.html` (botão flutuante, 2 cards de preço, portfólio, CTA final e rodapé) trazem o número real. O `script.js` continua reescrevendo todos os `a[href*="wa.me/"]` no carregamento a partir da constante `WHATSAPP_NUMBER`, mas agora como **normalizador**: para trocar o número, edite a constante *e* rode um find/replace no HTML.

Até 09/2026 o HTML usava o placeholder `wa.me/WHATSAPP_NUMBER` e só o JS injetava o número. Não volte a esse padrão: crawlers de IA (GPTBot, ClaudeBot, PerplexityBot) e scrapers de preview de link não executam JavaScript, então o site ficava sem nenhuma forma de contato para eles — e sem NAP para o SEO local.

**A ordem das seções no `index.html`** é nav → hero → marquee → problem/solution → processo → precos → portfolio → faq → cta-final → footer. Os links da nav e do footer são âncoras (`#processo`, `#precos`, `#portfolio`, `#faq`); uma seção nova que precise ser navegável exige um `id` e âncoras correspondentes tanto na nav *quanto* na coluna de navegação do footer.

**O `style.css` segue a mesma ordem das seções do HTML**, com comentários-faixa `/* ── SEÇÃO ── */`, e cada `@media` da seção fica logo depois das regras dela, em vez de num bloco de breakpoints no final do arquivo. Siga essa organização. Breakpoints usados: 1000px, 900px, 800px, 600px.

**Os tokens de tema ficam no `:root`** (`--black*`, `--orange*`, `--gray-*`, `--line*`). Use-os; o site é dark-only por decisão de design, com o laranja `#FF6B1A` como único destaque. As fontes (Space Grotesk / Instrument Serif / JetBrains Mono) vêm de um `<link>` do Google Fonts — `<em>` dentro de títulos renderiza como a serifada em itálico de propósito.

**O scroll reveal é opt-in por elemento**: adicione `class="reveal"` e o IntersectionObserver do `script.js` aplica `.visible`. O observer também define um `transitionDelay` escalonado pelo índice no DOM (`i % 4`), então adicionar ou reordenar elementos `.reveal` desloca o escalonamento de todos os seguintes.

**Cursor customizado**: as divs `.cursor`/`.cursor-dot` seguem o mouse e o `cursor: none` só vale sob `html.js` dentro de `@media (hover: hover) and (pointer: fine)` — a mesma condição que o `script.js` checa antes de iniciar o `requestAnimationFrame`. Fora disso (sem JS, ponteiro grosso, ou `prefers-reduced-motion`) vale o ponteiro nativo e as duas divs somem. Mexer numa ponta exige mexer na outra, senão o usuário fica sem cursor nenhum. O `script.js` só liga o efeito de hover em `a, button` — um clicável feito com `div`, por exemplo, não aumenta o anel.

**Accordion do FAQ** mede o `scrollHeight` de `.faq-a-inner` e define `max-height` inline, então a marcação obrigatória é `.faq-item > .faq-q` (button) + `.faq-a > .faq-a-inner`. Só um item fica aberto por vez.

**A barra fixa do topo é `#nav`, não `nav`.** O seletor era de elemento e transformava *qualquer* `<nav>` da página em segunda barra fixa com blur e `space-between` — o que quebrou os breadcrumbs das páginas internas. Hoje as regras são `#nav`, `#nav.scrolled` e as do `@media (max-width: 800px)`. Não volte a usar o seletor de elemento: páginas com mais de um `<nav>` dependem disso.

**O breadcrumb das páginas internas** é `<nav class="crumbs" aria-label="Trilha de navegação">` com `<a href="/">Studio Web</a><span aria-hidden="true">/</span>` e o nome da página. O texto visível precisa bater com os `name` do `BreadcrumbList` no JSON-LD da mesma página.

**Cada página interna carrega o próprio bloco JSON-LD** com `WebPage` + `Service` + `BreadcrumbList` + `FAQPage`, e **referencia o negócio por `@id`** (`https://www.studiowebniteroi.com.br/#business`) em vez de redeclará-lo. Só o `index.html` define os nós `#business` e `#website` — duplicar a entidade cria duas concorrentes aos olhos do Google. O texto de cada pergunta e resposta do `FAQPage` tem que ser idêntico, caractere por caractere, ao que está visível no HTML.

**Classes das páginas internas** ficam no bloco `/* ── PÁGINAS DE CONTEÚDO ── */` do `style.css`: `.hero-doc` (hero sem os 100vh da home), `.crumbs`, `.prose`, `.doc-section`, `.chip-list`/`.chip`, `.compare*` e `.nota-fonte`. A tabela `.compare` vira pilha de cards abaixo de 600px, e como `display: block` mata os papéis implícitos de tabela, o HTML traz `role="table|row|rowheader|cell"` explícito e o rótulo de cada célula vem de `data-label`.

**Não invente prova social.** O negócio ainda não tem portfólio publicado: nada de depoimento, nome de cliente, número de atendidos, nota ou case. Estatística de mercado vai como faixa aproximada, sempre com aviso de que é estimativa e de que só os números do Studio Web são exatos — nunca com fonte citada que não exista.

## Deploy

Publicado na **Vercel** como arquivos estáticos puros, a partir da branch `main` deste repositório. O domínio canônico é **`https://www.studiowebniteroi.com.br/`** — com `www` e com barra final; o apex redireciona para ele.

Esse endereço aparece em cinco lugares que precisam continuar idênticos entre si, caractere por caractere: `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image` e as URLs dentro do bloco JSON-LD no fim do `index.html` (mais o `robots.txt` e o `sitemap.xml`). Se o domínio mudar, todos mudam juntos.

Não use `studioweb.com.br` — é um domínio diferente, que não resolve. Ele constava aqui e nas meta tags por engano, o que deixava o preview de link quebrado em toda partilha no WhatsApp.
