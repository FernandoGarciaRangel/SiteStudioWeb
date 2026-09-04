# Pendências e próximos passos

Continuação da auditoria de SEO e encontrabilidade por IA de 03/09/2026.
Este arquivo fica fora do deploy (ver `.vercelignore`).

---

## Onde estamos

Das 36 correções do diagnóstico, **28 estão aplicadas e mescladas na `main`** —
tudo que era edição de arquivo no repositório, em 13 commits. O site foi de **1
para 7 URLs indexáveis**.

O que ainda falta se divide em três grupos: o que depende de um clique no painel
da Vercel, o que depende de você criar alguma coisa (imagem, conta, caso real), e
duas decisões editoriais.

> **Nada disso está publicado ainda.** A `main` local está à frente do GitHub. O
> deploy só acontece no `git push`, e é ele que leva as 7 páginas ao ar.

---

## 1. Publicar

### 1.1 Enviar para o GitHub

```
git push origin main
```

A Vercel publica sozinha a partir da `main`. Este é o único passo que torna todo
o resto visível — as 6 páginas novas, o `robots.txt`, o `sitemap.xml` e as
correções da home não existem para ninguém até aqui.

### 1.2 Trocar o redirect do apex para 308 · *item 0.2*

Hoje `studiowebniteroi.com.br` (sem `www`) devolve **307 Temporary**. Um redirect
temporário diz ao Google que a mudança pode voltar atrás, então ele mantém as
duas URLs no índice e não consolida a autoridade numa só.

**Vercel → Settings → Domains** → marque o apex como redirect para o `www` com a
opção **Permanent (308)**.

### 1.3 Confirmar que os crawlers de IA não estão bloqueados · *item 0.4*

**Vercel → Project → Firewall**: nenhuma regra deve estar barrando tráfego
automatizado. Se houver, o `robots.txt` que libera GPTBot, ClaudeBot e
PerplexityBot não adianta nada — o bloqueio acontece antes, no edge.

Duas semanas depois do deploy, confira em **Observability → Logs** filtrando por
`GPTBot`, `ClaudeBot`, `PerplexityBot` e `OAI-SearchBot`. Se nenhum apareceu, o
bloqueio está em algum lugar.

---

## 2. Pendências, em ordem de impacto

### 2.1 Portfólio e prova social · *item 4.3* — **a maior de todas**

As 7 páginas levam ao mesmo `Projetos em desenvolvimento`. Quem chegar pela busca
de maquiadora ou de fotógrafo encontra uma seção vazia, e a decisão de contratar
depende exatamente do que não está lá.

Em ordem de preferência:

1. **Dois ou três casos reais**, mesmo que sejam projetos-piloto feitos de graça
   para conhecidas do ramo. Print, link e uma linha de resultado. Resolvem a prova
   social *e* dão o material visual das páginas de nicho — na de maquiadora, que é
   decisão 100% visual, isso pesa mais que em qualquer outra.
2. **Conceitos rotulados como demonstração** — "exemplo de página para manicure".
   Servem de portfólio e de material de venda, e são honestos.
3. **Remover a seção**, e aí as âncoras `#portfolio` na nav *e* na coluna de
   navegação do rodapé saem junto.

Quando houver depoimentos reais, eles entram como `Review` e `AggregateRating` no
JSON-LD do `index.html`. Só com avaliações verificáveis.

### 2.2 Perfil da Empresa no Google · *item 4.4* — ~40 min, grátis

A maior alavanca local que existe, e é externa ao site. É o que coloca o Studio
Web no mapa e no bloco local de "criação de sites perto de mim", e é a fonte que
alimenta o Knowledge Graph — uma das bases sobre as quais assistentes de IA
verificam se uma entidade existe de fato.

- Cadastre como **prestador de serviço com área de atendimento** (não precisa
  expor endereço residencial).
- Categoria principal: "Web designer" ou "Serviço de design de sites".
- Área: Niterói, São Gonçalo, Maricá, Rio de Janeiro.
- Telefone, nome e site **idênticos, caractere por caractere**, ao que está no
  JSON-LD do `index.html`: `Studio Web`, `+5521991088053`,
  `https://www.studiowebniteroi.com.br/`. Divergência de NAP entre site e perfil é
  o erro clássico que trava SEO local.
- Peça avaliação a cada cliente entregue.

### 2.3 Imagem social, favicon e logo · *item 2.4*

O `logo.png` **não é PNG** — são bytes JPEG de 1092×1092 e 69 KB, servidos como
`image/png`. Ele faz cinco papéis ao mesmo tempo, e agora o problema se multiplica
por 7 páginas: todas compartilham o mesmo preview quadrado, que o
`twitter:card: summary_large_image` corta nas laterais.

Três arquivos:

| arquivo | tamanho | uso |
|---|---|---|
| `og-image.jpg` | 1200×630 | `og:image` e `twitter:image` das 7 páginas |
| `favicon.png` | 96×96, PNG de verdade | `<link rel="icon">` (corrigir o `type`) |
| `logo-96.webp` | 96×96 | nav e rodapé |

Sugestão para a `og-image.jpg`: logo + nome + "Landing pages em Niterói · a partir
de R$ 450".

Ao trocar, atualizar também `og:image:width` e `og:image:height`, que hoje
declaram os 1092×1092 reais. Depois, forçar recoleta em
`developers.facebook.com/tools/debug` — o WhatsApp cacheia preview por dias.

### 2.4 Search Console e Bing Webmaster Tools · *item 2.5*

Sem isso, os outros 27 itens viram opinião: é o único jeito de saber se foi
indexado, por quais termos aparece e se há erro de rastreamento.

- **Search Console**: verificação por **domínio** (registro TXT no Registro.br,
  onde a zona está em `d.sec.dns.br`) — cobre apex, `www` e subdomínios de uma vez.
  Submeta `https://www.studiowebniteroi.com.br/sitemap.xml` e use **Inspeção de
  URL → Solicitar indexação** na home e nas 6 páginas novas.
- **Bing Webmaster Tools**: importa a verificação do Google em um clique, e
  alimenta o Copilot e parte do índice do ChatGPT.

### 2.5 Escolher a analytics · *item 7.1*

O código já está pronto no `script.js`: cada um dos links `wa.me/` dispara um
evento com a origem do clique (`botao-flutuante`, `precos`, `portfolio`,
`cta-final`, `rodape`). Ele funciona com Plausible, Umami, Vercel Analytics ou
GA4 — **falta só incluir o snippet do provedor escolhido no `<head>`**.

Recomendação: Plausible ou Umami. São leves, sem cookie e sem banner de
consentimento, e o relatório é legível. O Vercel Analytics é um clique, já que o
projeto está lá.

Isso te diz qual CTA converte, que é a informação que paga a próxima iteração da
página — e vira case, porque você passa a vender a métrica que usa.

### 2.6 Citações externas · *item 4.7*

Modelos de linguagem citam quem é citado. Um site novo sem menção externa nenhuma
não tem como ser corroborado.

- LinkedIn com o site no campo de website
- GetNinjas ou Workana
- Diretórios locais de Niterói
- Link do site na bio do Instagram

Depois, some todos ao array `sameAs` do JSON-LD do `index.html` — é assim que se
diz ao Google que esses perfis são a mesma entidade.

### 2.7 Medir performance na URL servida · *item 6.4*

Depois do deploy, rode o PageSpeed Insights em `pagespeed.web.dev` na aba
**Celular**, e trate o que aparecer. É a única medição que vale, porque mede o
site servido e não o arquivo local.

### 2.8 Acompanhar aparições em IA · *item 7.2* — mensal, ~10 min

Não existe um Search Console para isso. O método manual funciona bem para um
negócio local: pergunte no ChatGPT, Claude, Perplexity e no modo IA do Google —
*"quem faz landing page para autônomos em Niterói?"*, *"quanto custa uma landing
page no Rio de Janeiro?"*, *"onde contratar site para manicure?"* — e anote se
aparece e com quais dados.

---

## 3. Decisões editoriais em aberto

Nenhuma bloqueia nada; todas são de uma linha para reverter.

### 3.1 "Conversar pessoalmente" — `/criacao-de-site-em-niteroi/`

A página diz, em três lugares, que *"se você preferir conversar pessoalmente antes
de fechar, é só combinar pelo WhatsApp — estar na mesma cidade facilita"*. É um
compromisso sobre como você opera, e não veio de você. Se não quiser atender
presencialmente: sai do FAQ visível, do texto correspondente dentro do `FAQPage`
no JSON-LD, e do terceiro item de "por que daqui".

### 3.2 "Antes e depois" — contradição deliberada entre duas páginas

`/landing-page-para-maquiadora/` diz que **pode** usar antes e depois.
`/landing-page-para-personal-trainer/` **desaconselha**.

A distinção é real — maquiagem mostra técnica, treino promete resultado corporal
que depende de fatores individuais e exige autorização de imagem — e está
justificada dentro de cada resposta. Mas as duas páginas ficam no mesmo site.

### 3.3 O `h1` da maquiadora

*"Quem casa em outubro te escolhe em março."* É a copy mais forte das sete
páginas e também a mais arriscada; o mês é ilustrativo. A alternativa segura é
*"Sua agenda de noivas fechada com meses de antecedência"*.

### 3.4 Nichos que ainda não têm página

O marquee da home lista sete públicos. Têm página: manicure, maquiadora,
fotógrafo, personal trainer. Faltam: **salões de beleza** (descartado por ora —
manicure e maquiadora cobrem quem trabalha dentro de um, e as duas dizem isso
explicitamente), **designers** e **confeitarias**.

Se for criar mais, o critério que funcionou foi mudar o **eixo** do negócio, não
o vocabulário. Sobreposição de frases medida entre as quatro atuais: 6,1% a
15,5%. Acima de ~20% contra uma página existente, elas se canibalizam e nenhuma
ranqueia.

---

## 4. Referência rápida

**Domínio canônico:** `https://www.studiowebniteroi.com.br/` — com `www` e barra
final. Existe um `studioweb.com.br` parecido que **é de terceiros**; nunca deve
aparecer no código.

**As 7 páginas:**

```
/                                     home
/criacao-de-site-em-niteroi/          intenção local
/quanto-custa-uma-landing-page/       página de resposta
/landing-page-para-manicure/
/landing-page-para-maquiadora/
/landing-page-para-fotografo/
/landing-page-para-personal-trainer/
```

**Ao criar uma página nova**, além do arquivo: URL no `sitemap.xml` (com barra
final), linha na seção `## Páginas` do `llms.txt`, e link na coluna "Páginas" do
rodapé de **todas** as outras páginas. Ver `CLAUDE.md` para as convenções.

**Rodar local:** `python -m http.server 5501` na raiz do repositório.
