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

- [x] **Booking pathway via Calendly** — all "Book" / "Begin Therapy" / "Free Consultation" CTAs across the site now link directly to Ally's Calendly events (7 events mapped in [src/data/calendly.ts](src/data/calendly.ts)). The previous Stripe + custom BookingForm pipeline has been retired — `BookingForm.astro` is archived in [src/_archive/](src/_archive/BookingForm.astro), and both `/pricing/individual` and `/pricing` now point to Calendly. **All bookings (single sessions and consultations) flow through Calendly.** For bulk bundles, `/pricing` now shows a 3-step "Enquire" section that routes through the free 20-min taster before any payment.
- [x] **Pricing pages** — Split into two: `/pricing/individual` (single sessions, 6 cards across Individual / Couples tabs, each linking direct to its Calendly event) and `/pricing` (bulk session bundles + Enquire section). Header "Therapy" is a dropdown linking to therapy overview + both pricing pages.
- [x] **Therapy services page** — `/therapy` live with Individual / Couples tabs, narrative, benefits and three session-format cards per tab. Each session-format card "Book" CTA links direct to its corresponding Calendly event.
- [ ] **Duplicate Calendly slug for couples** — Ally's live site (and our [src/data/calendly.ts](src/data/calendly.ts)) currently uses the same Calendly event (`reignite-connection-60-minute-couples-therapy-clone`) for both *60min Couples Online or Phone* and *90min Couples Face-to-Face*. Looks like a copy-paste from when Ally cloned events. She needs to either create a separate event for one of these, or confirm the duplication is intentional. Flagged with her.
- [ ] **Confirm 90-minute couples bulk pricing** — single 90-min couples session is £130. Existing bulk packs on `/pricing` (£486 for 6, £810 for 10) are based on the £90 60-min rate. Need a decision: should 90-min sessions count toward bulk packs, or are bulk packs 60-min only? (Currently the cards say "60-min sessions" — flag in [src/pages/pricing.astro](src/pages/pricing.astro).) Bulk bundles are now handled via post-consultation payment link (no Stripe integration), so this is purely a copy/positioning decision.
- [ ] **Therapy block pricing** — confirm the four bulk prices on `/pricing` are correct (Individual £540/£324, Couples £810/£486) and that the £60/£90 single-session prices match Ally's current rates. `pricingTiers` in [src/data/site.ts](src/data/site.ts) is the source of truth for the homepage cards.
- [ ] **Bulk payment mechanism** — after the free Calendly chat, Ally needs a way to actually charge for bulk bundles (her existing Stripe account? PayPal invoice? Bank transfer? GoCardless? Calendly's own paid event feature?). The site now says "I'll send a secure payment link" — clarify what that link is in practice. No code work needed on the site once decided.
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
