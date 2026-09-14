# Uphold Group — SEO & content strategy

Construction labour hire & recruitment · Greater Sydney only · rates never published.

---

## 1. The market you are competing in

Australian labour hire search is a **two-sided, local, urgent** market. Australian labour hire is legally defined as an employer supplying its own employees to another workplace for profit, which is why hosts search for a *provider* and workers search for a *shift* — two different intents landing on the same domain.

Category leaders in Australia now open with an explicit audience split — AWX, for example, asks visitors to choose "After work?" for jobs or "Need a crew?" for workforce solutions before anything else. Sydney-specific competitors (Hunter Labour Hire, People 2U, TradeConnex, JV Recruitment) compete on trade-by-trade pages, response speed, and worker registration in minutes with SMS role alerts. Assume every competitor has a jobs board, a trade page set and Google reviews. Your differentiators are **Sydney-only focus**, **verification rigour**, and **speed of response**.

---

## 2. Keyword architecture

Three intent clusters. One page per intent — never mix host and worker intent on one page.

### A. Host / commercial intent (money pages)
| Cluster | Example queries | Page |
|---|---|---|
| Core service | labour hire sydney · construction labour hire sydney · labour hire company sydney | Home + Labour hire hub |
| Engagement type | casual labour hire sydney · temporary construction staff · permanent construction recruitment sydney | Casual / Contract / Permanent |
| Trade | labourers for hire sydney · scaffolders labour hire · traffic control hire sydney · formwork carpenters sydney · plant operator hire | One page per trade (6–12) |
| Region | labour hire parramatta · labour hire inner west · labour hire liverpool · labour hire northern beaches | One page per Greater Sydney region (8) |
| Urgency | same day labour hire sydney · emergency labourers sydney · labour hire near me | Home + region pages |

### B. Worker intent (supply pages)
labouring jobs sydney · construction jobs no experience sydney · white card jobs sydney · traffic control jobs sydney · hoist operator jobs · trades assistant jobs near me → **Jobs board + one indexable page per live role.**

### C. Research / authority intent (top of funnel, AI-citable)
what is labour hire · labour hire vs subcontractor · do I need a labour hire licence in NSW · how to check a labour hire provider · what tickets does a labourer need · portable long service leave NSW.

**Deliberately not targeted:** any "labour hire rates" or "hourly rate" query. That traffic is price-shopping and the business does not publish rates. Instead, own the adjacent question — *"what's included in a labour hire charge rate"* — and answer it without figures.

---

## 3. Site architecture

```
/                            Home (dual entry)
/labour-hire/                Host hub
  /casual-labour-hire/       /contract-crews/  /permanent-recruitment/  /payroll-on-hire/
/trades/                     Index
  /labourers/  /carpenters-formwork/  /scaffolders-riggers/
  /traffic-control/  /plant-operators/  /warehouse-logistics/
/sydney/                     Region index
  /sydney-cbd/  /inner-west/  /parramatta-western-sydney/  /north-shore-hills/
  /northern-beaches/  /eastern-suburbs/  /south-west-liverpool/  /sutherland-st-george/
/jobs/                       Board + /jobs/{role-suburb-id}/
/workers/                    Register · pay & super · safety & inductions
/compliance/                 Insurance, verification, WHS
/projects/                   Case studies
/insights/                   Articles
/request-labour/             3-step host form
/contact/
```

**Rules**
- Every trade page: tickets held · typical scope · what to brief us · 3 FAQs · host CTA + worker CTA. No rates.
- Every region page needs named suburbs in body copy, at least one local project and at least one local job, or it does not ship. Thin duplicated region pages are the single biggest risk in this category.
- Trade × region crosses (`/trades/labourers/parramatta/`) only where there is genuine repeat work to describe.
- One canonical phone number, one NAP, everywhere.

---

## 4. On-page requirements

- **Title pattern:** `Labour Hire Parramatta | Construction Labourers & Trades | Uphold Group`. Keep "Sydney" or the region in every title.
- **H1** states service + geography once. No keyword stacking.
- **First 100 words** must contain: what we supply, that we are Sydney-only, and how fast we respond.
- **Internal linking:** the trade accordion on the homepage is the primary link path to trade pages; region tiles are the path to region pages. Every trade page links to the 8 regions and vice versa.
- **Copy length:** host pages 500–800 words, region pages 400–600 with real local detail, trade pages 600–900.
- **No rates anywhere**, including image alt text, FAQs, meta descriptions and job listings.

---

## 5. Structured data

| Schema | Where | Notes |
|---|---|---|
| `EmploymentAgency` (+ `LocalBusiness`) | Home, contact | NAP, `areaServed` = Greater Sydney + the 8 regions, opening hours matching the hire desk (5:30am–8pm) |
| `JobPosting` | Every live job | `hiringOrganization`, `jobLocation` (suburb), `employmentType`, `validThrough`. Omit `baseSalary` — it is optional, and omitting it is consistent with not publishing rates |
| `FAQPage` | Home, trade, compliance | Mirrors visible FAQ blocks only |
| `Service` | Trade + engagement pages | `serviceType`, `areaServed` |
| `BreadcrumbList` | All | Reinforces the trade/region hierarchy |
| `Review` / `AggregateRating` | Testimonials | Only for genuine, attributable reviews |

**Expire job postings.** Stale `JobPosting` markup is both an SEO liability and the fastest way to lose worker trust.

---

## 6. Local SEO (the real growth lever)

1. **Google Business Profile** for the Alexandria office: primary category *Employment agency*, secondary *Construction company*. Service areas set to the 8 regions, not "Australia".
2. **Photos monthly** — real crews, real sites, geotagged where possible. This category is starved of authentic imagery.
3. **Reviews as an operating habit:** ask every host after the first successful week and every worker after their first month. Target 40+ reviews mentioning suburbs and trades. Reply to all.
4. **Citations:** ABN lookup, industry associations (RCSA), local chambers, Sydney construction directories. Identical NAP.
5. **Google Posts** weekly with live roles — free, indexed, and it demonstrates activity.

---

## 7. Current trends worth building for (2026)

- **AI answer engines.** Hosts increasingly ask an assistant to shortlist providers. What gets cited: self-contained, dated, factual paragraphs. So: a `/compliance/` page that states insurances and verification steps in plain sentences, FAQ answers that stand alone, and "last reviewed" dates on every evergreen page. This is why the compliance FAQ sits on the homepage and not in a PDF.
- **Compliance as a search topic.** Labour hire licensing now runs in Victoria, Queensland, South Australia and the ACT, while NSW, WA, Tasmania and the NT have no general scheme — and in scheme states it is a separate offence for a host to engage an unlicensed provider. Sydney hosts are increasingly aware of this and arrive asking. Publish a short, accurate `/compliance/` page: NSW has no state licence, here is what we hold instead (icare workers compensation, $20M public liability, Fair Work compliance, WHS plan, ticket verification). Being the provider that explains this earns links and citations.
- **Speed as the product.** "Same day" and "4-hour replacement" claims belong in H2s and meta descriptions, not buried in body copy.
- **Mobile-first, literally.** Both audiences arrive on phones, in sunlight, sometimes in gloves. Click-to-call beside every CTA; a worker registration flow that accepts photos of tickets from the camera roll.
- **SMS-first worker supply.** Competitors already text matching roles before they hit job boards. Make "we text you roles near your suburb" the registration promise.
- **Video and site reels.** 15–30 second site clips on GBP, YouTube Shorts and the jobs board lift both host trust and worker registrations.
- **Core Web Vitals.** LCP under 2.0s on 4G. The hero image is the LCP element — preload it, serve AVIF/WebP, no carousel above the fold.

---

## 8. Content calendar (first 6 months)

| Month | Asset | Intent |
|---|---|---|
| 1 | `/compliance/` — what we hold in NSW and how we verify tickets | Authority, AI citation |
| 1 | 6 trade pages | Commercial |
| 2 | 8 Sydney region pages, each with a real project | Local |
| 2 | "What's included in a labour hire charge rate" (no figures) | Intercepts price search |
| 3 | "Labour hire vs subcontractor: which do you need?" | Top of funnel |
| 3 | Worker guide: tickets you need to work on a Sydney site | Supply |
| 4 | 3 project case studies with crew composition and duration | Proof, sales enablement |
| 4 | "How to check a labour hire provider before you engage them" | Link bait |
| 5 | Sydney construction pipeline update (quarterly, evergreen refresh) | Authority, PR |
| 6 | Worker guide: pay, super and portable long service leave in NSW | Supply, retention |

---

## 9. Measurement

**Host side:** calls from organic (call tracking, not just form fills), request-labour completions, request → first booking rate, rankings for `labour hire {region}`, share of organic sessions landing on trade and region pages.

**Worker side:** registrations completed, registration start → finish rate on mobile, applications per live job, `JobPosting` impressions in Google Jobs.

**Both:** GBP calls, direction requests and review velocity — in a same-day service business these usually outperform sitewide ranking averages as a predictor of revenue.
