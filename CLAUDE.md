# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Site de página única (landing page) do **Studio Web**, negócio de Niterói/RJ que vende landing pages para autônomos e pequenos negócios. Todo o texto visível ao usuário é em **português do Brasil** — mantenha copy nova em pt-BR, no mesmo tom informal e direto do que já existe. Respostas e comentários também em português.

## Como rodar

Site estático, sem build, sem dependências e sem suíte de testes. Não há nada para instalar ou compilar.

- Abra o `index.html` direto, ou use o Live Server do VS Code (`.vscode/settings.json` fixa a porta **5501** → http://127.0.0.1:5501/index.html).
- Qualquer servidor estático serve, ex.: `python -m http.server 5501`.
- As mudanças aparecem ao recarregar; não existe HMR, bundler nem minificador no fluxo.

## Estrutura

Quatro arquivos, todos na raiz: `index.html`, `style.css`, `script.js`, `logo.png`. Não introduza framework, gerenciador de pacotes ou etapa de build sem ser pedido — o formato sem dependências, com um arquivo por responsabilidade, é proposital.

## Convenções que importam

**Os links de WhatsApp são montados em runtime.** Todos os CTAs do `index.html` usam o placeholder literal `https://wa.me/WHATSAPP_NUMBER?text=...`; o `script.js` reescreve todos os `a[href*="wa.me/"]` no carregamento, substituindo pela constante `WHATSAPP_NUMBER` no topo do `script.js`. Para trocar o número, edite só essa constante — nunca cole um número real no HTML, porque ele será sobrescrito de qualquer forma.

**A ordem das seções no `index.html`** é nav → hero → marquee → problem/solution → processo → precos → portfolio → faq → cta-final → footer. Os links da nav e do footer são âncoras (`#processo`, `#precos`, `#portfolio`, `#faq`); uma seção nova que precise ser navegável exige um `id` e âncoras correspondentes tanto na nav *quanto* na coluna de navegação do footer.

**O `style.css` segue a mesma ordem das seções do HTML**, com comentários-faixa `/* ── SEÇÃO ── */`, e cada `@media` da seção fica logo depois das regras dela, em vez de num bloco de breakpoints no final do arquivo. Siga essa organização. Breakpoints usados: 1000px, 900px, 800px, 600px.

**Os tokens de tema ficam no `:root`** (`--black*`, `--orange*`, `--gray-*`, `--line*`). Use-os; o site é dark-only por decisão de design, com o laranja `#FF6B1A` como único destaque. As fontes (Space Grotesk / Instrument Serif / JetBrains Mono) vêm de um `<link>` do Google Fonts — `<em>` dentro de títulos renderiza como a serifada em itálico de propósito.

**O scroll reveal é opt-in por elemento**: adicione `class="reveal"` e o IntersectionObserver do `script.js` aplica `.visible`. O observer também define um `transitionDelay` escalonado pelo índice no DOM (`i % 4`), então adicionar ou reordenar elementos `.reveal` desloca o escalonamento de todos os seguintes.

**Cursor customizado**: `body`, `a` e `button` usam `cursor: none` e as divs `.cursor`/`.cursor-dot` seguem o mouse. Isso é desativado em `@media (hover: none) and (pointer: coarse)`. Elementos interativos novos não podem reintroduzir o cursor nativo no desktop, e o `script.js` só liga o efeito de hover em `a, button` — um clicável feito com `div`, por exemplo, não aumenta o anel do cursor.

**Accordion do FAQ** mede o `scrollHeight` de `.faq-a-inner` e define `max-height` inline, então a marcação obrigatória é `.faq-item > .faq-q` (button) + `.faq-a > .faq-a-inner`. Só um item fica aberto por vez.

## Deploy

Publicado na **Vercel** como arquivos estáticos puros, a partir da branch `main` deste repositório. O domínio canônico é **`https://www.studiowebniteroi.com.br/`** — com `www` e com barra final; o apex redireciona para ele.

Esse endereço aparece em cinco lugares que precisam continuar idênticos entre si, caractere por caractere: `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image` e as URLs dentro do bloco JSON-LD no fim do `index.html` (mais o `robots.txt` e o `sitemap.xml`). Se o domínio mudar, todos mudam juntos.

Não use `studioweb.com.br` — é um domínio diferente, que não resolve. Ele constava aqui e nas meta tags por engano, o que deixava o preview de link quebrado em toda partilha no WhatsApp.
