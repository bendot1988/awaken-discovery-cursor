# Awaken Discovery — Outstanding Items

Everything below is blocked on input, copy, assets or a product decision from Ally / Ben. The site is wired to render placeholders or graceful copy in the meantime — search the codebase for `{{TODO:` to jump to each spot.

## Content & assets (waiting on Ally)

- [ ] **Testimonials** — at least 3 to fill `Testimonials.astro` placeholders on the Homepage.
- [ ] **Accreditation / trust strip logos** — MBACP and any other badges to drop into the Homepage hero trust strip.
- [x] **"Learn More About Ally" page copy** — `/about` now live with brand intro, Meet Ally, approach pillars, accordion chapters, qualifications placeholders and closing CTA. Real photos for portrait + chapters + closing band. Qualifications block has TODOs waiting on credentials from the live site.
- [ ] **Hero / Anxiety background video** — stock or client-supplied calming footage. Placeholder block on `/anxiety` hero; static image in Homepage hero with an overlay note.
- [ ] **Brand imagery for Teachers page** — cups, books, Ally writing. Client has some already.
- [ ] **Product videos** — for the Wellbeing Products section once built.

## Pricing & products (waiting on confirmation)

- [x] **Pricing pages** — Split into two: `/pricing/individual` (single sessions, 6 cards across Individual / Couples tabs + full booking form) and `/pricing` (bulk session bundles + booking form). Header "Therapy" is a dropdown linking to therapy overview + both pricing pages. Booking form extracted to [src/components/BookingForm.astro](src/components/BookingForm.astro) and shared between both pricing pages.
- [x] **Therapy services page** — `/therapy` live with Individual / Couples tabs, narrative, benefits and three session-format cards per tab. Card "Book" CTAs jump to `/pricing/individual#book` (single-session booking form); bundle banners cross-sell to `/pricing` (bulk).
- [ ] **Single-session Stripe checkout** — six new products needed in Stripe (Ind 60 F2F £60, Ind 60 Online £60, Ind 90 F2F £90, Cou 60 F2F £90, Cou 60 Online £90, Cou 90 F2F £130). Replace the six `{{STRIPE_PRICE_*}}` placeholders in [src/pages/pricing/individual.astro](src/pages/pricing/individual.astro) with real `price_xxx` IDs. The shared `BookingForm` already wires the price IDs into its submit handler — once products exist, the same `/api/create-checkout-session` endpoint used for bulk should accept these IDs too.
- [ ] **Migrate `/pricing` (bulk) to shared BookingForm** — currently still uses its inline form (~700 lines of CSS/JS in [src/pages/pricing.astro](src/pages/pricing.astro)). Refactor to import `BookingForm` like `/pricing/individual` does, then delete the inline form + duplicated styles. Lower priority — works fine as-is, just technical debt.
- [ ] **Confirm 90-minute couples bulk pricing** — single 90-min couples session is £130. Existing bulk packs on `/pricing` (£486 for 6, £810 for 10) are based on the £90 60-min rate. Need a decision: should 90-min sessions count toward bulk packs, or are bulk packs 60-min only? (Currently the form labels are "60-min sessions" — flag in [src/pages/pricing.astro](src/pages/pricing.astro).)
- [ ] **Stripe integration for `/pricing#book`** — see the `{{TODO: STRIPE INTEGRATION ...}}` note inside the booking form. Needed: (1) create the four products in Stripe, replace `{{STRIPE_PRICE_*}}` placeholders with real `price_xxx` IDs; (2) build a `/api/create-checkout-session` server route; (3) wire the form's submit handler to redirect to Stripe Checkout; (4) build a `/api/booking-enquiry` route for the "speak first" path; (5) add Stripe webhook for `checkout.session.completed` confirmation.
- [ ] **Therapy block pricing** — confirm the four bulk prices on `/pricing` are correct (Individual £540/£324, Couples £810/£486) and that the £60/£90 single-session prices match the live site. `pricingTiers` in [src/data/site.ts](src/data/site.ts) is still used on the homepage and shows `{{TODO: price}}` — that needs the real numbers too.
- [ ] **Anxiety Reflection Journal URL + pricing** — product nearly done. Need: full price, discount price, discount %, deadline (replace `{{PRICE}} / {{DISCOUNTED_PRICE}} / {{X}} / {{DEADLINE}}` on `/finding-calm-anxiety/thank-you` and in Emails 5 + 7 of [docs/email-sequence-anxiety.md](docs/email-sequence-anxiety.md)). Also need link to drop into Teachers + Anxiety pages.
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
- [ ] **Anxiety** — `/anxiety` hub page still Hero + Emotional Connection only. Meet Ally / Continued Support / Final CTA still to add.
- [x] **Finding Calm anxiety guide funnel** — full sales page at `/finding-calm-anxiety` and journal-upsell thank-you at `/finding-calm-anxiety/thank-you`. Email opt-in form + nurture sequence stubbed; ESP wire-up TODOs flagged on the page. 7-email sequence copy lives in [docs/email-sequence-anxiety.md](docs/email-sequence-anxiety.md).
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
