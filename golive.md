# Go-Live Checklist — Awaken Discovery

> **INTERNAL — não publicado.**
> Este arquivo vive na raiz do projeto, fora de `src/pages/` e `public/`,
> portanto não é servido em produção (verificado via `astro build` → não aparece em `dist/`).
> Também está em `Disallow:` no `public/robots.txt` como defesa em profundidade.
> O antigo `TODO.md` agora é apenas um pointer para este arquivo.
>
> Última atualização: **10/Jun/2026**.

---

## Sumário rápido

| Estado | Total |
|---|---|
| ✅ Concluído | 19 |
| 🟡 Pendente (código) | 2 |
| 🔵 Pendente (decisão cliente) | 6 |
| 🟣 Pendente (externo — Fillout/Mailchimp/Domínio) | 3 |

---

# Parte A — Comentários do workflow.design (#90 → #115)

## ✅ Concluídos (confirmados com o cliente)

### 1. Home / hero — separar Anxiety vs Teachers (`#90`, `#114`)
- `src/data/site.ts` → `freeResources[]` com `audience` e `footerSubtitle` distintos:
  - **Teacher** → "Why You Can't Switch Off After Teaching"
  - **Anxiety** → "Finding Calm — Grounding Yourself During Anxiety"
  - **General** → "When You've Been Holding Too Much for Too Long"
- Footer, `/free-resources` e CTAs propagam a partir desse data file.

### 2. About / Qualifications + Membership (+ logos) (`#93`, `#94`, `#95`)
- `/about#qualifications` com 4 blocos:
  - **Qualifications**: MA Counselling (York St John) + PGCE (De Montfort/Leicester) + BSc Hons Environmental Science (Nene) + Counselling Skills L1–3 (Focus).
  - **Memberships & accreditation**: BACP (MBACP) + NCPS + Online & Telephone Counselling — com **logos**.
  - **Areas of focus & specialisms**: 5 clusters temáticos.
  - **Safeguarding & experience**: DBS + Selby College + York St John Communities Centre.

### 3. Pricing bulk/package — "dates and times" em vez de "cadence" (`#96`)
- `src/pages/pricing.astro` — 4 bullets + lede + step 2 do flow agora dizem "dates and times". Zero ocorrências da palavra `cadence` no corpo.

### 4. Single Session Pricing — renomear "Individual Pricing" (`#97`)
- `src/data/site.ts` → `navItems`/`footerNavItems` usam **"Single Session Pricing"** e **"Bundle Pricing"**. Nenhum resíduo de "Individual Pricing" / "Bulk Pricing".

### 6. Therapy page image — foto da árvore (`#99`, `#100`)
- Hero do `/therapy` usa `src/assets/therapy/ally-tree-portrait.png`.

### 7. Teachers/free guide rename (`#101`)
- Renomeado em `/teachers`, `/finding-calm-teachers`, `/free-resources`, footer, style-guide e thank-you. Apenas `src/_archive/finding-calm-teachers.astro` mantém o nome antigo — não é servido.

### 8. Products — site antigo + vídeo Therapy Journal (`#102`, `#112`)
- `/products` totalmente reescrita: hero, **Therapy Journal for Couples** com vídeo + CTA Amazon UK, e grid "In development" com próximos produtos.

### 9. Teacher resources card — fundo verde escuro (`#103`)
- `.sb-more` em `/teachers` usa `var(--color-dark-slate-gray)` com texto/CTA em branco.

### 10. Footer free resources — corrigir mistura de nomes (`#113`)
- Resolvido pelo mesmo refactor do item 1.

### 11. Funnels Anxiety vs Teachers separados (`#114`)
- Estrutura de dados distinta (`teacherGuidePath` × `anxietyGuidePath` × general).
- Forms Fillout distintos: anxiety = `jXo5e7D8Hwus`, teachers = `bzhC71AYFfus`, contato = `t5xKDhCRfyus`.
- PDFs separados em `public/assets/pdf/`.

### 12. About / Therapy — "Teacher also added" (`#115`)
- "Teacher" presente em `/about`, `/about-therapy` (signature), `/anxiety` (trust strip + intro + disclosure), `/finding-calm-anxiety` (trust strip + intro). `/teachers` e `/finding-calm-teachers` mantêm "Ex-teacher" intencionalmente.

## 🟡 Pendente

### 5. Therapy pricing toggle — visibilidade (`#98`)
- **Comentário:** "people struggle finding this button".
- **Estado:** continua como `<input type="radio"> + <label>` em `/therapy#choose`. Pouco discoverable.
- **Proposta:** transformar em dois botões grandes lado a lado (estilo CTA, sombra, ícones, hover claro) + microcopy explícito "Click to choose Individual or Couples Therapy". Considerar repetir o switch logo abaixo do hero.
- **Impacto:** apenas `/therapy` (`th-tabs`, `th-tab-switch`, `th-tab-label`).

---

# Parte B — Pre-Launch Audit técnico (itens 5 → 17 originais)

## 🟢 Bloqueadores resolvidos

### Audit #5. `/finding-calm-anxiety` — placeholders e form
- **Form nativo:** ✅ substituído pelo Fillout `jXo5e7D8Hwus` (hoje).
- **Image prompts removidos** (hoje):
  - Retrato dedicado da Ally (figcaption);
  - Mockup do PDF (substituído pela **cover real**, com efeito de livro 3D — `public/assets/images/finding-calm-anxiety-cover.png`);
  - Meet Ally figcaption;
  - Retrato pequeno na claim section;
  - TODO de testimonials anxiety-specific.
- **Resultado:** `grep` na página retorna 0 `{{IMAGE PROMPT}}` ou `{{TODO}}` visíveis.

### Audit (extra). `/contact` — página real
- ✅ Substituiu `ComingSoon` por página completa com Fillout `t5xKDhCRfyus`, blocos "What to expect", "Other ways to begin" (Calendly), Testimonials e FAQ.

### Audit (extra). `/style-guide` — noindex
- ✅ Confirmado hoje: `noindex={true}` no `<Layout>` + `Disallow: /style-guide` em `public/robots.txt`. Não linkado em nenhuma navegação.

## 🟢 Bloqueadores adicionais resolvidos (10/Jun)

### Audit #6. `/finding-calm-teachers` — placeholders removidos
- ✅ Removidos os 3 `{{IMAGE PROMPT}}` (hero portrait, sala de professor, segundo portrait) e o TODO de testimonials. CSS órfão (`.sl-img-todo`, `.sl-test-todo`) também removido.

### Audit #8. `/free-resources` — TODO substituído por copy real
- ✅ `{{TODO: more guides coming...}}` substituído por "More gentle guides are being shaped — they'll appear here as they're ready." (legível pelo usuário, sem placeholder).

### Audit #9. `/anxiety` — CTA "Anxiety Reflection Journal" agora limpa
- ✅ TODO removido. Card recebeu um badge sage **"Coming soon"** visível, mantendo o card no ar de forma transparente até a Ally decidir o destino final.

### Audit #10. `/teachers` — TODOs de produtos futuros substituídos
- ✅ Os 2 `<p class="sb-todo">` (Teacher Anxiety Journal + Sunday Reset) viraram pílulas "In development" elegíveis (`.sb-status`), no mesmo padrão visual do `/products`.

### Audit #16. Blog — `heroImageAlt` preenchido em todos os 10 posts
- ✅ Cada post agora tem alt text descritivo coerente com a imagem real (verificado via leitura das próprias jpegs). Melhora acessibilidade e SEO.

## 🟡 Bloqueadores ainda visíveis no site

### Audit #7. Thank-you pages — checkout do journal
- `src/pages/finding-calm-anxiety/thank-you.astro:85` → IMAGE PROMPT do journal.
- `src/pages/finding-calm-anxiety/thank-you.astro:163` → TODO `{{PRICE}} {{DISCOUNTED_PRICE}} {{X}} {{DEADLINE}}`.
- `src/pages/finding-calm-teachers/thank-you.astro:88` → IMAGE PROMPT do journal (teacher).
- `src/pages/finding-calm-teachers/thank-you.astro:169` → TODO de checkout (mesmos placeholders).

**Decisão necessária:** remover a oferta de journal por enquanto **OU** fornecer produto + preço + checkout (Amazon? Gumroad? Stripe?).
**Cross-ref:** [`docs/email-sequence-anxiety.md`](docs/email-sequence-anxiety.md) também tem os mesmos placeholders `{{PRICE}}`/`{{DISCOUNTED_PRICE}}`/`{{X}}`/`{{DEADLINE}}` em Emails 5 e 7.

## 🔵 Pendente — Decisão da cliente

### Audit #11. Produtos "In development" visíveis em `/products`
- Anxiety Reflection Journal, Teacher Anxiety Reflection Journal, Sunday Reset for Teachers, product walkthroughs.
- Cliente decide se ficam visíveis ou se escondemos até estar pronto.

### Audit #12. "My Grounded Wellness Link" (do site antigo) ficou fora
- Não temos o link exato nem confirmação se ainda deve aparecer. Precisa input da Ally.

### Audit #13. Música no vídeo do Therapy Journal
- Vídeo sem áudio. Decisão de música + licença com a cliente. Não bloqueia.

### Legacy do `TODO.md` — pendências da cliente ainda em aberto
1. **Duplicate Calendly slug para Couples** — `src/data/calendly.ts` usa o mesmo evento para *60min Couples Online/Phone* e *90min Couples Face-to-Face*. Confirmar com a Ally se é intencional ou se ela vai criar um evento separado. (Também consta em "Calendly slugs — bug sinalizado" abaixo.)
2. **90-minute couples bulk pricing** — sessão avulsa de 90min é £130; os bundles em `/pricing` (£486×6, £810×10) foram calculados em cima do £90 da sessão de 60min. Decisão de copy: 90min entram nos bundles ou bundles são só 60min? Cards atuais dizem "60-min sessions".
3. **Confirmar valores das tarifas** — `pricingTiers` em `src/data/site.ts` precisa ser sanity-checked com Ally: £540/£324 (Individual), £810/£486 (Couples), £60/£90 nas sessões avulsas.
4. **Mecanismo de pagamento dos bundles** — fluxo atual diz "I'll send a secure payment link" depois da consulta gratuita. Ally precisa confirmar o quê esse link é (Stripe? GoCardless? PayPal? Calendly pago?). Sem trabalho de código no site enquanto não houver decisão.
5. **Seção 4b "Areas of Emotional Support"** — omitida da homepage no brief original (considerada duplicada das 8 flip cards). Revisar se Ally quer ressuscitar.

## 🟣 Pendente — Validações externas

### Audit #14. Smoke test manual de links externos
Antes de publicar, abrir cada um destes em produção:
- Calendly (`tasterSession`, `individual.*`, `couples.*` em `src/data/calendly.ts`);
- Fillout embeds (3 IDs: `jXo5e7D8Hwus`, `bzhC71AYFfus`, `t5xKDhCRfyus`);
- Amazon (`/products` → "Therapy Journal for Couples");
- findahelpline.com (`/finding-calm-teachers`);
- Privacy / Terms internos;
- PDFs em `/assets/pdf/finding-calm-anxiety.pdf` e `/assets/pdf/finding-calm-teachers.pdf`;
- Redirects de Netlify / domínio final.

### Audit #15. Fillout → Mailchimp wiring
Para cada form:
- Form envia para audience certo no Mailchimp;
- PDF correto é entregue (anxiety vs teacher);
- Redirect/thank-you correto após submit;
- Tags por audience (anxiety / teacher / general);
- Decisão sobre double opt-in.

### URLs dos PDFs no Fillout
- Hoje apontam para `awakendiscovery.netlify.app/assets/pdf/...`.
- **Trocar** para domínio final após cutover (`awakendiscovery.com` / `.co.uk`).

### `siteMeta.canonicalOrigin`
- `src/data/site.ts` aponta para `https://awakendiscovery.co.uk` — confirmar domínio final antes de publicar.

### Audit #17. Revisão de SEO titles/descriptions
Páginas a revisar após mudanças recentes de naming:
- `/`
- `/anxiety`
- `/teachers`
- `/finding-calm-anxiety`
- `/finding-calm-teachers`
- `/products`
- `/free-resources`
- `/contact` (acabou de ser criada — titles já populados)

### Calendly slugs — bug sinalizado
- `src/data/calendly.ts` comenta que `couples.sixtyOnline` e `couples.ninetyFaceToFace` parecem apontar para o mesmo evento (copy-paste no site antigo). Confirmar com a Ally e separar.

### Cookie banner
- `CookieBanner.astro` já está montado. Confirmar com a cliente a redação e categorias antes do go-live.

---

# Parte C — Resumo prioritário para o go-live

| # | Ação | Estado | Próximo passo |
|---|---|---|---|
| 1 | `/contact` página real | ✅ feito | — |
| 2 | Form Fillout em `/finding-calm-anxiety` | ✅ feito | — |
| 3 | Remover todos os `{{TODO}}` e `{{IMAGE PROMPT}}` visíveis | 🟡 parcial | Falta apenas as duas thank-you pages (item 4) |
| 4 | Decidir thank-you pages (journal/checkout) | 🟡 | Decisão cliente: oferta ou remover |
| 5 | Qualifications + CPD em `/about` | ✅ feito | — |
| 6 | Decidir produtos "In development" | 🔵 | Cliente decide visibilidade |
| 7 | Testar Fillout → Mailchimp → PDF → thank-you | 🟣 | Pendente externo |
| 8 | Testar links externos + PDFs no domínio final | 🟣 | Pós-DNS cutover |
| 9 | Noindex `/style-guide` | ✅ feito | — |
| 10 | Revisar alt texts (blog) + SEO básico | ✅ feito | 10 `heroImageAlt` preenchidos (10/Jun) |

---

## Notas operacionais
- Cada item resolvido → tick + referência ao arquivo/commit.
- Itens novos do workflow.design → adicionar ao final da Parte A com o número do comentário.
- `TODO.md` agora é apenas um pointer para este arquivo (10/Jun/2026).
