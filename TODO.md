# Awaken Discovery — Outstanding Items

Everything below is blocked on input, copy, assets or a product decision from Ally / Ben. The site is wired to render placeholders or graceful copy in the meantime — search the codebase for `{{TODO:` to jump to each spot.

## Content & assets (waiting on Ally)

- [ ] **Testimonials** — at least 3 to fill `Testimonials.astro` placeholders on the Homepage.
- [ ] **Accreditation / trust strip logos** — MBACP and any other badges to drop into the Homepage hero trust strip.
- [ ] **"Learn More About Ally" page copy** — `/about` currently renders a Coming Soon shell. Linked from Homepage, Teachers and Anxiety. Brief flags this as outstanding.
- [ ] **Hero / Anxiety background video** — stock or client-supplied calming footage. Placeholder block on `/anxiety` hero; static image in Homepage hero with an overlay note.
- [ ] **Brand imagery for Teachers page** — cups, books, Ally writing. Client has some already.
- [ ] **Product videos** — for the Wellbeing Products section once built.

## Pricing & products (waiting on confirmation)

- [ ] **Therapy block pricing** — confirm against the existing live page before committing a number. `pricingTiers` in [src/data/site.ts](src/data/site.ts) currently shows `{{TODO: price}}`.
- [ ] **Anxiety Reflection Journal URL** — product nearly done; need link to drop into Teachers + Anxiety pages.
- [ ] **Sunday Reset destination** — undecided whether monthly or weekly; need a page/booking URL.
- [ ] **Teacher decompression / realignment / membership systems** — still in development; will live under `/products`.

## Email signup (waiting on tooling)

- [ ] **Choose ESP** (Mailerlite / ConvertKit / Beehiiv / etc.) and wire the form in `EmailSignup.astro` to it.
- [ ] **PDF auto-send** of *When You've Been Holding Too Much for Too Long* on signup.
- [ ] **Nurture sequence** for new subscribers.
- [ ] **GDPR-compliant double opt-in** and unsubscribe handling.

## Legal & compliance

- [ ] **Privacy policy** — needs review against current GDPR. `/privacy` route not yet created.
- [ ] **Terms & Conditions** — needed for therapy block purchases. `/terms` route not yet created.

## Page builds (planned next sessions)

- [ ] **Teachers** — full page (currently Hero + Emotional Connection only). Needs Free Guide section, Meet Ally (teacher version), Support Beyond Survival Mode 4-card grid, Final CTA.
- [ ] **Anxiety** — full page (currently Hero + Emotional Connection only). Needs Free Guide section, Meet Ally (anxiety version), Continued Support 2-card grid, Final CTA.
- [ ] **About** — replace Coming Soon with full bio + therapeutic approach.
- [ ] **Products** — replace Coming Soon with product grid once items are live.
- [ ] **Pricing** — replace Coming Soon with full pricing breakdown.
- [ ] **Blog** — replace Coming Soon with article list + first posts.
- [ ] **Contact** — replace Coming Soon with booking calendar + enquiry form.

## PDF lead magnet (not started)

- [ ] **"When You've Been Holding Too Much for Too Long"** — 8-page gentle guide. Structure is in the brief (Page 4). Not currently linked; tied to email signup once ESP is chosen.

## Misc

- [ ] **Old "Finding Calm" teacher sales-letter** — archived to [src/_archive/finding-calm-teachers.astro](src/_archive/finding-calm-teachers.astro). Useful as source copy if/when we build a dedicated PDF landing page. No longer routed.
- [ ] **Canonical domain** — `awakendiscovery.co.uk` set as canonical origin in `siteMeta`. Confirm DNS / Netlify domain config when ready to switch from the `.netlify.app` URL.
- [ ] **Section 4b ("Areas of Emotional Support" list)** — omitted from the Homepage as the brief flagged it as duplicative of the 8 flip cards. Revisit if Ally wants it back.
