# Improvement plan: what the strongest sites do, and what Sorlio Guides lacks

Reviewed on 14 October 2026, from public pages only:

1. frenchlearner.com, "Best French Learning Apps"
2. mezzoguild.com, French apps resource list
3. croissantverbs.com, "Best free apps to learn French"
4. o16iapps.com, French Books landing page
5. getlectura.com, "Best apps for French reading practice"

Page content was read through automated extraction, so details such as exact pricing, rating scales and author claims are as the pages presented them and were not checked independently.

## What these sites do well

| Pattern | Seen on | Why it works |
| --- | --- | --- |
| Summary table or "top picks" above the fold | Frenchlearner, Croissant Verbs, Lectura | Readers get the answer in seconds and can skip to the detail they need |
| Consistent per-product template: best for, pros, cons, platforms, price | Frenchlearner, Croissant Verbs | Makes long lists scannable and comparable |
| "Which should you choose?" decision blocks by goal | Frenchlearner, Lectura ("better fit if…") | Matches the search intent of comparison queries |
| Named author with a short bio and dates | Frenchlearner, Mezzo Guild, Croissant Verbs | Trust signal; readers and search engines can see who is responsible |
| Methodology or criteria stated openly | Lectura (criteria table), Croissant Verbs (testing claim) | Makes comparisons feel evidence-based. The testing claim cannot be used by us unless true |
| FAQ section with direct answers | Croissant Verbs, Lectura | Answers long-tail questions and suits rich results where eligible |
| Screenshots and app logos for every product | Croissant Verbs, o16i | Visual confirmation; looks like a real review |
| Related-content navigation and category hubs | Frenchlearner, Mezzo Guild | Keeps readers moving through the site |
| Sitemap-friendly pages for a single topic (e.g. a books page) | o16i | Creates a distinct, indexable product-discovery entry point |
| Clear, repeated app-store call to action | o16i, Croissant Verbs | Reduces friction once the reader is persuaded |

## What the sites do that we should not copy

- **Affiliate-heavy ranking.** Several sites rank products by which ones pay them, with heavy affiliate links. This undermines trust and conflicts with our disclosure. Do not add affiliate links.
- **Unverified testing claims.** One site claims "100+ hours of testing" and "thirty tools reviewed". We must not claim testing that did not happen.
- **Self-published "top" rankings.** Croissant Verbs ranks its own app third in a list of its own reviews while presenting it as a neutral comparison. We should keep Sorlio's position honest and state it plainly.
- **Undated or unsourced prices.** Pricing with mixed currencies and no date is common, and it goes stale quickly. We should show prices only when verified, with a "last checked" date.
- **Fake author credentials.** Our brief forbids invented bios. We should not copy the credential-heavy author boxes.

## What Sorlio Guides lacks

Ordered by expected impact on search and on reader trust.

1. **No quick answer at the top of comparison pages.** A "Quick verdict" box with the one-line pick for each learner type would match the summary tables competitors use.
2. **Comparison data is prose-heavy.** Our tables describe approach in general terms. Readers looking for a choice want consistent rows: best for, platforms, free access, paid access, last checked.
3. **No FAQ sections.** Each commercial and method guide should answer three to five real questions, visibly, with matching FAQ structured data.
4. **No visual evidence.** There are no screenshots, no app icons and no photos. The reader card on the homepage is an illustration, not a product view.
5. **No verified product data.** We have not confirmed pricing, plans or platform availability for any competitor. This is the largest gap, and it limits how specific we can be.
6. **No methodology statement for comparisons.** We should publish our criteria explicitly, so readers see how a comparison was made, without claiming testing that did not happen.
7. **No named author or editorial owner.** We can truthfully name the team and its role. We cannot invent people or credentials. A named reviewer, if one exists, would add real trust.
8. **Thin navigation.** There is no category hub page with descriptions, and no search. Three guides are not yet linked from the homepage cards.
9. **No evergreen utility pages.** Competitors use glossaries, word lists and quick tools. These bring repeat visits and links. We have none.
10. **Icon and brand were minimal.** Addressed in this change with a site mark, but the brand has no further identity yet.

## Plan

### Phase 1: Quick wins (no new facts required, about one week)

- **Quick verdict box** at the top of each comparison guide: one line per learner type, linked to the relevant section. Pure content; no new claims beyond what each article already says.
- **FAQ sections** (three to five questions each) on the four commercial and method guides, with FAQPage structured data that matches the visible text.
- **Homepage cards** for all twelve guides, grouped by category, plus a short "Which guide should I read?" block that uses the level test.
- **Methodology box** on the two comparison pages: the criteria used (for example reading content, vocabulary tools, listening, price model, platform), and a note that the comparison is based on public information and was not tested.
- **Visible "last checked" date** on each comparison guide.

### Phase 2: Verified product data (one to two weeks, needs manual checking)

- Build a **comparison data file** (`src/content/products/*.md` or JSON) for Sorlio, LingQ, Readlang, Beelinguapp, Duolingo and Croissant Verbs with: platforms, free access, paid access, price model, and source URL with a checked date.
- Each person verifies each field on the official site or store page, then sets the `checkedDate`. The build should fail if a field is older than a chosen threshold, so stale claims are visible.
- Render the comparison tables from this data, so one correction updates every guide.
- **Sorlio's own row must be checked against the live Google Play listing**, which our earlier fetches could not read.

### Phase 3: Visual evidence (one to two weeks, needs your assets)

- **Sorlio screenshots** (reader view, word lookup, saved words) for the app-comparison pages. These must be real screenshots from the app that you choose to share. Use at most a few, with alt text, compressed for performance.
- **Competitor logos** only where their brand terms allow; otherwise use text.
- Add a **simple product card** component showing the app icon, best-for line and the store button.

### Phase 4: Navigation and utility pages (ongoing)

- **Category hub pages** with a description and the guides in each category, linked from the header navigation.
- **Reading vocabulary glossary**: a short, original page explaining common high-frequency words with example sentences. It needs careful French checking.
- **Interactive level test** kept static at first (a checklist with the sample passages), then reviewed for whether it needs any JavaScript.
- **Search** is optional. Skip it until the site has more than about twenty guides.

### Phase 5: Trust and authorship (requires decisions from you)

- Decide whether a **named reviewer** exists. If a real French teacher or linguist will review the articles, add their name, role and a review date only with their agreement. Otherwise keep "published by the Sorlio team".
- Publish a short **editorial policy** page: how topics are chosen, how claims are checked, how corrections are handled. We already have the About page; expand it rather than duplicate it.

## Icon

A new site mark is in `public/icon.svg`: an open-book shape in the teal brand colour with a sun-yellow speech dot. It is used as the favicon, in the header and in the social share image (`public/og-default.svg`). It is a generic mark, not a Sorlio app icon, so it is clearly a Guides brand.

## Decisions needed from you

1. Do you want to share Sorlio screenshots for Phase 3? If so, which screens?
2. Can you confirm the Sorlio plan details (free and Premium features, price) from the Google Play listing, so the Sorlio row is verified?
3. Is there a named reviewer who will check the French and the learning claims? If not, we keep the current honest attribution.
4. Should the Guides site keep its neutral teal-and-cream identity, or would you like it to share more of the Sorlio app's colours?

## What not to do

- Do not add affiliate links or paid rankings.
- Do not add testing claims, user counts, ratings or testimonials without evidence.
- Do not invent authors, credentials or review dates.
- Do not add tracking scripts to match analytics-heavy competitors.
