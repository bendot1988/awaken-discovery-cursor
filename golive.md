# Go-Live Checklist — Awaken Discovery

> **INTERNAL — not published.**
> This file lives at the project root, outside `src/pages/` and `public/`,
> so it isn't served in production (verified via `astro build` → does not appear in `dist/`).
> It's also `Disallow:`-ed in `public/robots.txt` as defence in depth.
> The legacy `TODO.md` is now only a pointer to this file.
>
> Last updated: **18 Jun 2026**.

---

## Quick summary

| Status | Total |
|---|---|
| ✅ Done | 30 |
| 🟡 Pending (code) | 1 |
| 🔵 Pending (client decision) | 2 |
| 🟣 Pending (external — Fillout/Mailchimp/domain) | 2 |

---

# Part A — workflow.design comments (#90 → #115)

## ✅ Done (confirmed with the client)

### 1. Home / hero — separate Anxiety vs Teachers (`#90`, `#114`)
- `src/data/site.ts` → `freeResources[]` with distinct `audience` and `footerSubtitle`:
  - **Teacher** → "Why You Can't Switch Off After Teaching"
  - **Anxiety** → "Finding Calm — Grounding Yourself During Anxiety"
  - **General** → "When You've Been Holding Too Much for Too Long"
- Footer, `/free-resources` and CTAs propagate from this data file.

### 2. About / Qualifications + Membership (+ logos) (`#93`, `#94`, `#95`)
- `/about#qualifications` with 4 blocks:
  - **Qualifications**: MA Counselling (York St John) + PGCE (De Montfort/Leicester) + BSc Hons Environmental Science (Nene) + Counselling Skills L1–3 (Focus).
  - **Memberships & accreditation**: BACP (MBACP) + NCPS + Online & Telephone Counselling — with **logos**.
  - **Areas of focus & specialisms**: 5 thematic clusters.
  - **Safeguarding & experience**: DBS + Selby College + York St John Communities Centre.

### 3. Pricing bulk/package — "dates and times" instead of "cadence" (`#96`)
- `src/pages/pricing.astro` — 4 bullets + lede + step 2 of the flow now say "dates and times". Zero occurrences of `cadence` in the body.

### 4. Single Session Pricing — rename "Individual Pricing" (`#97`)
- `src/data/site.ts` → `navItems`/`footerNavItems` use **"Single Session Pricing"** and **"Bundle Pricing"**. No remnants of "Individual Pricing" / "Bulk Pricing".

### 6. Therapy page image — tree photo (`#99`, `#100`)
- `/therapy` hero uses `src/assets/therapy/ally-tree-portrait.png`.

### 7. Teachers/free-guide rename (`#101`)
- Renamed across `/teachers`, `/finding-calm-teachers`, `/free-resources`, footer, style-guide and thank-you. Only `src/_archive/finding-calm-teachers.astro` keeps the old name — not served.

### 8. Products — old-site content + Therapy Journal video (`#102`, `#112`)
- `/products` fully rewritten: hero, **Therapy Journal for Couples** with video + Amazon UK CTA, and an "In development" grid for upcoming products.

### 9. Teacher resources card — dark green background (`#103`)
- `.sb-more` in `/teachers` uses `var(--color-dark-slate-gray)` with white text/CTA.

### 10. Footer free resources — fix naming mix (`#113`)
- Resolved by the same refactor as item 1.

### 11. Anxiety vs Teachers funnels separated (`#114`)
- Distinct data structure (`teacherGuidePath` × `anxietyGuidePath` × general).
- Distinct Fillout forms: anxiety = `jXo5e7D8Hwus`, teachers = `bzhC71AYFfus`, contact = `t5xKDhCRfyus`.
- Separate PDFs in `public/assets/pdf/`.

### 12. About / Therapy — "Teacher" also added (`#115`)
- "Teacher" present in `/about`, `/about-therapy` (signature), `/anxiety` (trust strip + intro + disclosure), `/finding-calm-anxiety` (trust strip + intro). `/teachers` and `/finding-calm-teachers` intentionally keep "Ex-teacher".

### 5. Therapy pricing toggle — visibility (`#98`) — **done 15 Jun**
- Old pill switch (small `<label>`s in a rounded background) replaced by two large CTA-style cards (`/therapy#choose`):
  - Inline SVG icon (single figure / two figures) inside a sage tinted circle that fills with brand colour when selected;
  - Title + supporting line ("60 or 90-min sessions · From £60/£90");
  - Animated check-mark dot on the right (visible only when selected);
  - Border + shadow + slight lift on hover and on selected.
- Added a uppercase prompt above ("↓ Tap one of the two options below to see what each looks like") so the interaction is unmistakable.
- Mobile: stacks to a single column at ≤ 640px with shrunk icon/title.
- Radio mechanics preserved (`th-tab-input`, panels still wired) — no JS introduced.

---

# Part B — Technical pre-launch audit (original items 5 → 17)

## 🟢 Blockers resolved

### Audit #5. `/finding-calm-anxiety` — placeholders and form
- **Native form:** ✅ replaced by Fillout `jXo5e7D8Hwus` (today).
- **Image prompts removed** (today):
  - Dedicated Ally portrait (figcaption);
  - PDF mockup (replaced by the **real cover**, with a 3D book effect — `public/assets/images/finding-calm-anxiety-cover.png`);
  - Meet Ally figcaption;
  - Small portrait in the claim section;
  - Anxiety-specific testimonials TODO.
- **Result:** `grep` on the page returns 0 visible `{{IMAGE PROMPT}}` or `{{TODO}}`.

### Audit (extra). `/contact` — real page
- ✅ Replaced `ComingSoon` with a full page including Fillout `t5xKDhCRfyus`, "What to expect", "Other ways to begin" (Calendly), Testimonials and FAQ blocks.

### Audit (extra). `/style-guide` — noindex
- ✅ Confirmed today: `noindex={true}` in the `<Layout>` + `Disallow: /style-guide` in `public/robots.txt`. Not linked in any navigation.

## 🟢 Additional blockers resolved (10 Jun)

### Audit #6. `/finding-calm-teachers` — placeholders removed
- ✅ Removed the 3 `{{IMAGE PROMPT}}` (hero portrait, staffroom scene, second portrait) and the testimonials TODO. Orphan CSS (`.sl-img-todo`, `.sl-test-todo`) also removed.

### Audit #8. `/free-resources` — TODO replaced with real copy
- ✅ `{{TODO: more guides coming...}}` replaced with "More gentle guides are being shaped — they'll appear here as they're ready." (user-readable, no placeholder).

### Audit #9. `/anxiety` — "Anxiety Reflection Journal" CTA now clean
- ✅ TODO removed. The card now carries a visible sage **"Coming soon"** badge, keeping it live in a transparent way until Ally decides its final destination.

### Audit #10. `/teachers` — future-product TODOs replaced
- ✅ The 2 `<p class="sb-todo">` (Teacher Anxiety Journal + Sunday Reset) became elegant "In development" pills (`.sb-status`), matching the visual pattern on `/products`.

### Audit #16. Blog — `heroImageAlt` filled in across all 10 posts
- ✅ Each post now has descriptive alt text matching the real image (verified by inspecting the JPEGs themselves). Improves accessibility and SEO.

### Audit (extra). `/privacy` — DSAR form (UK GDPR)
- ✅ Fillout `wkUmW35GQous` embedded inside Section 10 ("Your Data Protection Rights"), right after the ICO callout, with the mini-title "Submit a data rights request" and a lede explaining the one-month deadline.
- Public anchor: `/privacy#data-request-form` (use in emails or the cookie banner if needed).
- **Note (🟣):** this form **must not go to Mailchimp** — submissions need to land directly in `awakendiscoverytherapy@gmail.com` (DSAR is not marketing).

### Audit (extra). `/privacy` — 2026 rewrite from Ally's docx — **done 15 Jun**
Applied every highlighted addition from `Privacy Policy Updated 2026.docx` plus the few non-highlighted-but-new lines (e.g. "Identity verification may be required…"). Structural changes:
- **Section 1** – paragraph on professional/ethical/legal obligations and insurers.
- **Section 2** – new bullet ("Payment transaction references…") + paragraphs on Co-operative Bank/Mettle banking providers and on data from parents/guardians for minors.
- **Section 4** – three paragraphs: contact forms, free-resource consent, no automated decision-making/profiling.
- **Section 6** – three paragraphs on clinical supervision, anonymisation/pseudonymisation, and lawful disclosure without consent.
- **Section 8** – five paragraphs: regulated banking providers, OnTech, Mailchimp, no clinical AI use, scope of retained payment info.
- **Section 10** – post-ICO block (contact-me-first + 30-day acknowledgement + escalation right) + new inline sub-section **10A "Data Rights Requests and Complaints"** sitting underneath the existing DSAR Fillout form.
- **New Section 15 "Complaints Procedure"** – styled 5-step process (Submit → Acknowledge → Investigate → Outcome → Escalate to ICO) using new `.legal-steps` / `.legal-step-num` cards.
- **Section 16 "Contact"** (renumbered from old #15) – split contact channels + new "Last updated: June 2026 / Next review date: June 2027" callout (`.legal-callout--review`).
- Hero badge updated to **"June 2026"**.
- TOC grew from 15 → 16 entries.
- Smoke-tested: HTTP 200, all 16 numbered sections render in the right order; build 29 pages clean; no lints.
- Confirmed `CookieBanner.astro` already satisfies Ally's "Accept / Reject / Customise" requirement (dialog with Essential / Analytics / Marketing categories) — no code change needed there.

### Audit (extra). `/terms` — Bulk Buying Payments section — **done 15 Jun**
Applied Ally's `Terms and conditions for bulk buying.docx` as a new **Section 12 "Bulk Buying Payments"** inside `/terms` (chosen over a separate `/terms/bulk-buying` page to keep all commercial terms under one canonical URL). Structural changes:
- New TOC entry; section number `12` follows the existing zero-indexed pattern (00 → 12).
- 8 sub-clauses styled with new `.legal-subhead` / `.legal-subhead-num` rules: 12.1 Payment Policy, 12.2 Cooling-Off Period (14 days), 12.3 Non-Refundable After Sessions Begin, 12.4 Session Expiration (6 months), 12.5 Rescheduling Policy (incl. cancellation fee table £30/£45/£60/£70), 12.6 Exceptional Circumstances, 12.7 Changes to These Terms, 12.8 Contact.
- `lastUpdated` bumped from "29 May 2026" → **"June 2026"** to line up with the privacy review.
- Two faithful-but-tidy cleanups vs. the raw docx (flag with Ally for confirmation):
  1. **Numbering bug fixed** — the docx had `7. Exceptional Circumstances` before `6. Changes to Terms`; re-ordered to natural reading (12.6 then 12.7).
  2. **Orphan sentence merged** — Section 4 in the docx had a sentence fragment ("*If no session is attended within a continuous 6-month period.*") with no continuation; folded into the surrounding paragraph so the meaning still reads correctly.
  3. **Typo removed** — "*please contact: please contact me at…*" → single "*please contact awakendiscoverytherapy@gmail.com*".
- Smoke-tested: build 29 pages clean, no lints, sub-headings render as `.legal-subhead` blocks with italic 12.x numbering matching the brand palette.

### Audit #7. Thank-you pages — journal checkout (soft-hide) — **done 15 Jun**
Closed the last 🟡 blocker without needing Ally's price/checkout decision by switching both thank-you pages to a transparent "Coming soon" pattern. The journal narrative + bullet list of inside-the-journal content stays (it's good list-warming copy for when the product launches), but every visible placeholder and broken CTA is gone.
- **`src/pages/finding-calm-anxiety/thank-you.astro`**
  - Removed `<figcaption>` with `{{IMAGE PROMPT}}`.
  - Replaced the entire "Discount CTA" section (`Normally {{PRICE}}` / `{{X}}% off` / `Claim Your Journal — {{X}}% Off` / `{{TODO: wire CTA…}}`) with a "Coming soon · The Journal Is Still Being Shaped" block — honest, on-brand, no broken `href="#claim-journal"`.
  - Rewrote the P.S. so it no longer references `{{DEADLINE}}` or `{{X}}%`.
  - Layout description tightened from "plus a special offer on the Anxiety Reflection Journal" → "open your inbox to begin".
  - Dropped orphan CSS: `.ty-price-card`, `.ty-price-row`, `.ty-price-was`, `.ty-price-now`, `.ty-price-note`, `.ty-cta`, `.ty-todo`, `.ty-imagine`, `.ty-image-todo`.
- **`src/pages/finding-calm-teachers/thank-you.astro`** — same operation, teacher-tone copy.
- **Smoke test (built `dist/`):**
  - `grep` for `{{TODO}} / {{IMAGE PROMPT}} / {{PRICE}} / {{DISCOUNTED_PRICE}} / {{DEADLINE}}` across the indexable site returns **zero matches**.
  - The only remaining `{{IMAGE PROMPT}}` is inside `/style-guide`, which is intentional demo content explaining the syntax — and `/style-guide` is `noindex` + `Disallow:` in `robots.txt` and not linked anywhere in nav.
- **Cross-ref:** `docs/email-sequence-anxiety.md` still has `{{PRICE}}`/`{{DEADLINE}}` in Emails 5 and 7 — left intentionally so Ally can fill them in when she configures Mailchimp; this file is not shipped (lives in `docs/`).

### Audit (extra). Ally launch Q&A applied — **done 18 Jun**
Client confirmed via WhatsApp (15 Jun). Code changes:

**Pricing & payments (confirmed)**
- Bundle prices unchanged and correct: Individual 10×£540 / 6×£324; Couples 10×£810 / 6×£486; singles £60/£90 (ind), £90/£130 (couples).
- Bundles are **60-minute sessions only** — copy added on `/pricing` cards, hero note, fine print, and `/pricing/individual` cross-sell.
- Bundle payment after consultation: **Stripe** — step 3 on `/pricing#book` now names Stripe explicitly.

**Calendly couples split (fixed)**
- `couples.sixtyFaceToFace` → `90-minutes-individual-1-2-1-clone-clone` (Calendly: "Reignite Connection - 60 Minute Couples Therapy Session")
- `couples.sixtyOnline` → `60-minutes-individual-1-2-1-clone-2` (Calendly: "60-Minutes Couple 1-2-1") — was incorrectly sharing the 90-min slug
- `couples.ninetyFaceToFace` → `reignite-connection-60-minute-couples-therapy-clone` (Calendly: "Reignite Connection - 90 Minute Couples Therapy")
- 90-min couples card on `/pricing/individual` + `/therapy` now says "Face to Face, Online or Phone" to match Calendly.

**Products (`/products`)**
- **Anxiety Reflection Journal** promoted from teaser → **available now** as PDF at **£18.99** / **$24.99** (`src/data/products.ts`). Featured section at `#anxiety-reflection-journal`. CTA → `/contact` until Ally shares Stripe payment link (`checkoutUrl` placeholder).
- **Grounded Wellness** affiliate restored: `https://www.groundedwellness.co.uk/?ref=ztu5yzm` (partner band on `/products`).
- Teasers kept for **Teachers Reflection Journal** + **Sunday Reset for Teachers** only (product-walkthroughs card removed).
- `/anxiety` journal card updated: "PDF available" badge + link to products.
- `/finding-calm-anxiety/thank-you` updated with live £18.99 offer + links to products/contact (aligned with email-sequence upsell).

**Naming**
- "Teacher Anxiety Reflection Journal" → **"Teachers Reflection Journal"** on `/products`, `/teachers`, teacher thank-you.

**Homepage Section 4b**
- Ally couldn't recall "Areas of Emotional Support" — **left out** (flip cards remain; no change).

### Audit #17. SEO titles & descriptions sweep — **done 15 Jun**
Rewrote `<title>` and `<meta description>` across the 7 main pages so each one (i) leads with the brand or product, (ii) names Ally where helpful, (iii) fits Google's display limits (≤ 65 chars title, 140–160 chars description) and (iv) drops keyword-stuffing.
- **`/` (siteMeta)** — was `"Therapy • Emotional Wellbeing • Teacher Support • Anxiety Help"` (no brand, no Ally, bullet-stuffed). Now: **"Counselling & Psychotherapy with Ally · Awaken Discovery"** + description naming Ally, MBACP/NCPS and York.
- **`/anxiety`** — title now mentions Ally ("Anxiety Support · Counselling with Ally · Awaken Discovery"); description appended "— with Ally Donoghue".
- **`/teachers`** — "Teacher Support" → **"Therapy for Teachers"** (more searchable); description appended "from Ally Donoghue, ex-teacher and counsellor".
- **`/products`** — title expanded to include "Journals & Guides"; description tightened (UK Amazon mentioned explicitly).
- **`/free-resources`** — "Free Resources" → **"Free Guides for Anxiety & Teachers"** (intent-rich); description kept.
- **`/finding-calm-anxiety`** — title trimmed from 83 → 62 chars: "Finding Calm · Free Anxiety Grounding Guide · Awaken Discovery".
- **`/finding-calm-teachers`** — title trimmed from 84 → 59 chars: "Why You Can't Switch Off After Teaching · Awaken Discovery".
- `/contact` left as is (already correct).

## 🟡 Blockers still visible on the site

_None._ All `{{TODO}}` / `{{IMAGE PROMPT}}` / `{{PRICE}}` placeholders are gone from the indexable site (closed 15 Jun, see Audit #7 entry above).

## 🟡 Pending (code)

### Anxiety Reflection Journal — Stripe checkout URL
- PDF is live on site at £18.99 / $24.99 with CTA → `/contact` as fallback.
- Ally confirmed Stripe for payments but did **not** share the journal PDF payment link in chat.
- Once received: set `checkoutUrl` in `src/data/products.ts` → auto-switches CTA to "Buy the PDF Journal" on `/products` and thank-you.

## 🔵 Pending — client decision

### Audit #13. Music on the Therapy Journal video
- Video has no audio. Music + licence decision with the client. Not a blocker.

### Legacy — unanswered in Ally's reply
- **Double opt-in** for Mailchimp (asked in launch message, no answer yet).
- **Cookie banner** wording — quick eyes before go-live.

## ✅ Client decisions now closed (15 Jun WhatsApp)

| Topic | Ally's answer | Applied |
|---|---|---|
| Bundle pricing | Confirmed £540/£324, £810/£486 | ✅ already correct |
| Bundle session length | 60-min only | ✅ copy on `/pricing` |
| Payment mechanism | Stripe | ✅ `/pricing#book` step 3 |
| Calendly couples | Separate durations, clear Book Now | ✅ slug split in `calendly.ts` |
| Products visibility | Anxiety PDF live; teasers for Teachers Journal + Sunday Reset | ✅ `/products` |
| Grounded Wellness | `?ref=ztu5yzm` | ✅ affiliate band |
| Homepage Section 4b | "I can't even remember" | ✅ left out |

## 🔵 Removed from pending (was client decision, now done)
- ~~Audit #11 in-development products~~ → resolved (see above)
- ~~Audit #12 Grounded Wellness~~ → resolved
- ~~Calendly duplicate slug~~ → resolved
- ~~90-min bulk pricing~~ → bundles are 60-min only
- ~~Confirm pricing values~~ → confirmed
- ~~Bundle payment mechanism~~ → Stripe
- ~~Section 4b homepage~~ → leave as is

## 🟣 Pending — external validations

### Audit #14. Manual smoke test of external links
Before going live, open each of these in production:
- Calendly (`tasterSession`, `individual.*`, `couples.*` in `src/data/calendly.ts`);
- Fillout embeds (4 IDs: `jXo5e7D8Hwus` anxiety, `bzhC71AYFfus` teachers, `t5xKDhCRfyus` contact, `wkUmW35GQous` DSAR/privacy);
- Amazon (`/products` → "Therapy Journal for Couples");
- Grounded Wellness affiliate (`/products`);
- findahelpline.com (`/finding-calm-teachers`);
- Internal Privacy / Terms;
- PDFs at `/assets/pdf/finding-calm-anxiety.pdf` and `/assets/pdf/finding-calm-teachers.pdf`;
- Netlify / final-domain redirects.

### Audit #15. Fillout → Mailchimp wiring
For each **lead-magnet** form (anxiety + teachers + general):
- Form sends to the correct Mailchimp audience;
- Correct PDF is delivered (anxiety vs teacher);
- Correct redirect/thank-you after submit;
- Audience tags (anxiety / teacher / general);
- Decision on double opt-in.

For `t5xKDhCRfyus` (contact) and `wkUmW35GQous` (DSAR/privacy): **does not** go to Mailchimp — just a direct email notification to Ally + simple thank-you/redirect.

### PDF URLs in Fillout
- Currently point to `awakendiscovery.netlify.app/assets/pdf/...`.
- **Swap** to the final domain after cutover (`awakendiscovery.com` / `.co.uk`).

### `siteMeta.canonicalOrigin`
- `src/data/site.ts` points to `https://awakendiscovery.co.uk` — confirm the final domain before publishing.

## 🟣 Removed from pending (was flagged, now fixed)
- ~~Calendly slugs — couples duplicate~~ → split 18 Jun (see Ally Q&A entry above).

### Cookie banner
- `CookieBanner.astro` is already wired up. Confirm wording and categories with the client before go-live.

---

# Part C — Priority summary for go-live

| # | Action | Status | Next step |
|---|---|---|---|
| 1 | `/contact` real page | ✅ done | — |
| 2 | Fillout form on `/finding-calm-anxiety` | ✅ done | — |
| 3 | Remove all visible `{{TODO}}` and `{{IMAGE PROMPT}}` | ✅ done | Indexable site is clean (15 Jun evening) |
| 4 | Thank-you pages (journal/checkout) | ✅ done | Anxiety journal live at £18.99; teachers journal still "coming soon" |
| 5 | Qualifications + CPD on `/about` | ✅ done | — |
| 6 | Decide on "In development" products | ✅ done | Anxiety PDF live; Teachers Journal + Sunday Reset teasers (15 Jun Ally) |
| 7 | Test Fillout → Mailchimp → PDF → thank-you | 🟣 | External pending |
| 8 | Test external links + PDFs on final domain | 🟣 | Post-DNS cutover |
| 9 | Noindex `/style-guide` | ✅ done | — |
| 10 | Review alt texts (blog) + basic SEO | ✅ done | 10 `heroImageAlt` filled in (10 Jun); titles/descriptions sweep done (15 Jun) |
| 11 | Therapy pricing toggle visibility (`#98`) | ✅ done | Two large CTA cards with icons + microcopy (15 Jun) |

---

## Operational notes
- Each resolved item → tick + file/commit reference.
- New workflow.design items → append at the end of Part A with the comment number.
- `TODO.md` is now only a pointer to this file (15 Jun 2026).
