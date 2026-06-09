# Go-Live Checklist — Awaken Discovery

> **INTERNAL — não publicado.**
> Este arquivo vive na raiz do projeto, fora de `src/pages/` e `public/`,
> portanto não é servido em produção (verificado via `astro build` → não aparece em `dist/`).
> Também está em `Disallow:` no `public/robots.txt` como defesa em profundidade.
>
> Última auditoria de código: **09/Jun/2026**.

---

## Sumário rápido

| Estado | Total |
|---|---|
| ✅ Concluído | 14 |
| 🟡 Pendente (código) | 6 |
| 🔵 Pendente (decisão cliente) | 3 |
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

## 🟡 Bloqueadores ainda visíveis no site

### Audit #6. `/finding-calm-teachers` — 3 IMAGE PROMPTS + 1 TODO
| Linha | Conteúdo |
|---|---|
| `src/pages/finding-calm-teachers/index.astro:76` | IMAGE PROMPT — portrait da Ally no hero |
| `src/pages/finding-calm-teachers/index.astro:103` | IMAGE PROMPT — professor/escola após expediente |
| `src/pages/finding-calm-teachers/index.astro:191` | IMAGE PROMPT — segundo portrait da Ally |
| `src/pages/finding-calm-teachers/index.astro:280` | TODO — "lift teacher-specific testimonials" |

**Ação proposta:** remover figcaptions e o `<p>` do TODO de testimonials (mesmo padrão que apliquei no `/finding-calm-anxiety` hoje). Imagens da Ally já existentes podem ser reusadas como fallback.

### Audit #7. Thank-you pages — checkout do journal
- `src/pages/finding-calm-anxiety/thank-you.astro:85` → IMAGE PROMPT do journal.
- `src/pages/finding-calm-anxiety/thank-you.astro:163` → TODO `{{PRICE}} {{DISCOUNTED_PRICE}} {{X}} {{DEADLINE}}`.
- `src/pages/finding-calm-teachers/thank-you.astro:88` → IMAGE PROMPT do journal (teacher).
- `src/pages/finding-calm-teachers/thank-you.astro:169` → TODO de checkout (mesmos placeholders).

**Decisão necessária:** remover a oferta de journal por enquanto **OU** fornecer produto + preço + checkout (Amazon? Gumroad? Stripe?).

### Audit #8. `/free-resources` — TODO visível
- `src/pages/free-resources.astro:87` → `{{TODO: more guides coming — drop new items into the freeResources array...}}`.

**Ação proposta:** remover o `<p>` do TODO (a mensagem é para o dev, não pro usuário). Cards sem imagem real continuam OK como estão — o placeholder visual atual é sóbrio.

### Audit #9. `/anxiety` — CTA Anxiety Reflection Journal desactivado
- `src/pages/anxiety.astro:241` → `<a class="cs-link" href="#" aria-disabled="true">`.
- `src/pages/anxiety.astro:246` → `{{TODO: Anxiety Reflection Journal — Ally to complete; show picture clips only for now}}`.

**Decisão necessária:**
- (a) manter como "Coming soon" com badge claro e remover o TODO;
- (b) remover a card por enquanto;
- (c) ligar a Amazon/produto real se já existe.

### Audit #10. `/teachers` — 2 TODOs de produtos futuros
- `src/pages/teachers.astro:217` → "Teacher Decompression / Realignment / Membership product page".
- `src/pages/teachers.astro:232` → "Sunday Reset schedule + URL final".

**Ação proposta:** trocar `<p class="sb-todo">` por copy de "in development" visível ao usuário (similar ao `/products`) ou remover o `<p>` e deixar só o card. Card já está em verde escuro (item #9 da Parte A).

### Audit #16. Blog — `heroImageAlt` vazio em todos os posts
- 10 arquivos em `src/content/blog/*.md` com `heroImageAlt: ""`.

**Ação proposta:** preencher `heroImageAlt` em cada um (1 frase descritiva por imagem). Posso fazer isso em lote olhando cada hero image.

## 🔵 Pendente — Decisão da cliente

### Audit #11. Produtos "In development" visíveis em `/products`
- Anxiety Reflection Journal, Teacher Anxiety Reflection Journal, Sunday Reset for Teachers, product walkthroughs.
- Cliente decide se ficam visíveis ou se escondemos até estar pronto.

### Audit #12. "My Grounded Wellness Link" (do site antigo) ficou fora
- Não temos o link exato nem confirmação se ainda deve aparecer. Precisa input da Ally.

### Audit #13. Música no vídeo do Therapy Journal
- Vídeo sem áudio. Decisão de música + licença com a cliente. Não bloqueia.

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
| 3 | Remover todos os `{{TODO}}` e `{{IMAGE PROMPT}}` visíveis | 🟡 parcial | Falta `/finding-calm-teachers`, thank-yous, `/free-resources`, `/anxiety`, `/teachers` |
| 4 | Decidir thank-you pages (journal/checkout) | 🟡 | Decisão cliente: oferta ou remover |
| 5 | Qualifications + CPD em `/about` | ✅ feito | — |
| 6 | Decidir produtos "In development" | 🔵 | Cliente decide visibilidade |
| 7 | Testar Fillout → Mailchimp → PDF → thank-you | 🟣 | Pendente externo |
| 8 | Testar links externos + PDFs no domínio final | 🟣 | Pós-DNS cutover |
| 9 | Noindex `/style-guide` | ✅ feito | — |
| 10 | Revisar alt texts (blog) + SEO básico | 🟡 | Posso preencher os 10 `heroImageAlt` em lote |

---

## Notas operacionais
- Cada item resolvido → tick + referência ao arquivo/commit.
- Itens novos do workflow.design → adicionar ao final da Parte A com o número do comentário.
- `TODO.md` na raiz tem itens antigos parcialmente desactualizados — consolidar com este arquivo numa próxima limpeza.
