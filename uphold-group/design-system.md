# Uphold Group — Design System v1.1

Construction labour hire & recruitment, Greater Sydney. Two audiences: **hosts** (builders who need a crew) and **workers** (trades and labourers who need a shift).

Honest black-on-white structure, one warm orange for action, full-bleed site photography, generous rounded geometry.

Files in this project:
- `Uphold Group Design System.dc.html` — tokens + component library
- `Uphold Group Wireframes.dc.html` — architecture, wireframes, UX annotations, both journeys
- `Uphold Group Landing.dc.html` — hi-fi homepage applying the system
- `seo-content-strategy.md` — SEO and content plan

---

## 1. Principles

1. **Proof over polish.** Real crews on real Sydney sites, real fill times, real names. Never stock hi-vis.
2. **One loud colour.** Orange means "do this next". More than two orange elements per viewport and the page has no priority.
3. **Plain words.** A site manager arrives at 6am one crew short. Short sentences, trade language used correctly, timing said out loud.
4. **Never a price.** No rate tables, no pricing page, no rates on job cards. Where a number would sit, state what the rate *includes* and offer a written quote the same day.
5. **Sydney, explicitly.** Every page states Greater Sydney. Region pages name their suburbs in body copy. No claims about cities we do not service.

---

## 2. Colour

| Token | Hex | oklch | Use |
|---|---|---|---|
| `--accent` | `#E85F2C` | `oklch(0.66 0.17 42)` | Primary buttons, active states, wordmark dot |
| `--accent-press` | `#C44A1C` | `oklch(0.56 0.16 42)` | Hover / active only |
| `--accent-tint` | `#FCEDE6` | `oklch(0.95 0.03 42)` | Icon wells, badges, soft highlights |
| `--ink` | `#111111` | — | Headings, host cards, dark surfaces |
| `--ink-70` | `#4A4A45` | — | Body copy |
| `--ink-45` | `#8A8A85` | — | Meta, captions (never under 14px) |
| `--surface-1` | `#FFFFFF` | — | Page ground |
| `--surface-2` | `#F4F4F2` | — | Cards, list rows, worker path |
| `--line` | `#E6E6E3` | — | Hairlines; input borders `#D8D8D3` |

**Semantic use of the two card surfaces:** ink `#111111` = host path (hire workers). Warm grey `#F4F4F2` = worker path (find work). Hold this consistently — it is how users tell the two journeys apart at a glance.

**Contrast.** Ink on Paper 17.4:1 · Ink-70 on Surface-2 8.6:1 · Orange on white 3.4:1 — permitted only for 32px+ display type or as a fill behind white text; never body copy or small links.

---

## 3. Typography

- **Primary — Archivo** (400/500/600/700). Fallback: Helvetica Neue, Helvetica, Arial.
- **Utility — JetBrains Mono** (400/500). Eyebrows, job numbers, licence and insurance chips, dates. Uppercase, 0.08em tracking, max 13px.

| Role | Size | Weight | Tracking | Line height |
|---|---|---|---|---|
| Display / H1 | 64–68px | 700 | −0.035em | 0.98 |
| Section / H2 | 40px | 700 | −0.03em | 1.05 |
| Card / H3 | 22–26px | 500 | −0.02em | 1.25 |
| Lead statement | 28–32px | 500 | −0.02em | 1.4 |
| Body | 16–17px | 400 | 0 | 1.55 (62ch measure) |
| Meta / eyebrow | 11–13px | 500 | 0.08em | 1.6 |

**Two-tone lead.** First clause in `--ink`, remainder in `--ink-45`. Once per page, used for the verification promise.

---

## 4. Space, radius, grid

- **Space (4pt):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Card padding 28. Section rhythm 96 / 112.
- **Radius:** 8 inputs · 16 media and rows · 20 cards · 24 audience cards · 28 hero and banner · 999 buttons, chips, avatars.
- **Grid:** 12 column, 24px gutter, 1240px max, 20–24px page margin. Split sections use 4 / 8 (label left, content right).
- **Breakpoints:** 480 / 768 / 1024 / 1280.

---

## 5. Components

**Button.** Height 44 (large 52, small 36), pill radius, 15px/500. Variants: primary (orange), secondary (ink), outline, quiet, disabled. `↗` on conversion actions. Circular 44px for carousel nav. **Click-to-call is a first-class button**, always beside the primary CTA.

**Nav.** Wordmark left, pill-group nav centre (active = white pill on `--surface-2`), phone number + primary CTA right. Nav order: Hire workers · Find work · Trades · Sydney regions · Compliance.

**Audience cards (two doors).** The most important component. Two cards directly under the hero: ink card "Need a crew", grey card "Looking for work". Mono eyebrow, 26–34px title, 40ch paragraph, arrow-circle affordance pinned bottom. Stacked host-first on mobile.

**Trade accordion.** One row open at a time. Active row: ink surface, white title, `--ink-45` body, orange 44px circle. Collapsed rows: `--surface-2`, title only. The orange circle is the internal link to that trade page — the site's main SEO link path.

**Stat card.** `--surface-2`, radius 20, 44px tinted icon well top, number (34px/700) + 13px label bottom. Four across. Operational metrics only — fill time, fill rate, workers on the books, LTI. Never dollars.

**Inclusions list.** Replaces any rate table: bordered card, mono header "Included in every hour charged", one line per inclusion, mono footnote "quoted per site and per classification · never published".

**Region tile.** `--surface-2`, radius 16, region name 18px/600 + suburb list 13px `--ink-45`. Eight tiles, one per Greater Sydney region, each linking to its landing page.

**Job row.** Role (17px/600) · suburb + region · engagement type · shift or ticket note · orange Apply pill. **No rate column** — pay is confirmed at interview.

**Testimonial card.** `--surface-2`, radius 20, 17px quote, hairline divider, avatar + name + role/suburb, mono month right. Manual carousel, next card peeks. No autoplay.

**Form fields.** Mono uppercase label, 8px radius, `#D8D8D3` border. Required/error uses orange border + orange helper. Chips for start urgency (Tomorrow 6am / This week / Ongoing) and trade selection.

**FAQ card.** Bordered, radius 20, 18px/600 question + 15px answer. Answers written as standalone paragraphs so they can be lifted whole into search and AI summaries.

**CTA banner.** Radius 28, photo bleeding right, copy left, orange button + outline phone button.

---

## 6. UX rules

- **Conversion path.** CTA reachable within one screen at all times: sticky header on desktop, fixed bottom bar with click-to-call on mobile. Host request = 3 steps × 2 fields. Worker registration = 2 steps, no CV, no password, ticket photos from the camera roll.
- **Trust order.** Claim → proof → action. Insurance and verification evidence sits above the fold for hosts.
- **Confirmation.** Name the consultant, the callback window, and promise the written quote by email. Never end on a generic "thanks".
- **Motion.** 160ms ease hover; 240ms `cubic-bezier(0.2,0.8,0.2,1)` accordion; entrances 12px rise + fade, once, 60ms stagger. No parallax, no autoplay.
- **Accessibility.** 44px minimum targets (phones, sunlight, gloves). 2px `#E85F2C` focus ring, 2px offset. Gradient scrims under overlay text. No hover-only affordances. Respect `prefers-reduced-motion`.

### Do
Two-tone lead paragraphs · full-bleed crew photo above the headline · ink card for the host path · operational numbers set large · suburbs named in body copy.

### Don't
Dollar figures anywhere · gradient backgrounds · drop shadows on cards · orange body text · icon-only navigation · stock hi-vis · cities we do not service.

---

## 7. Homepage section order

1. Nav (pill group, phone, CTA)
2. Hero photo, full bleed, 21:9
3. Headline + support paragraph + insurance/verification chips
4. **Two doors** — Need a crew / Looking for work
5. Centred two-tone verification promise
6. Trades accordion (label left / six rows right)
7. Operational stats, four cards
8. How hiring works, three steps
9. What one rate includes (no figures)
10. Sydney regions, eight tiles
11. Projects mosaic
12. Live jobs, three rows
13. Testimonials carousel
14. Compliance FAQ, four cards
15. CTA banner "Short a crew for Monday?"
16. Footer: address, ABN, insurance, both link columns, Acknowledgement of Country
