# SciFi Short Story Collection

## Product

An independent, spoiler-free index of award-winning science fiction and fantasy short stories. Readers can browse award results and follow available stories to the publisher, magazine, or author's website.

## Current build

- Hugo Best Short Story results for award years 2001-2025
- 25 entries: 24 winners and the 2015 No Award result
- 16 verified reading links and 8 winners without a verified online text
- Search, exact-year filtering, sorting, and Reset
- 12 entries per page with responsive pagination
- Shareable URL state for search, award, year, sort, and page
- Story records with stable IDs and an `awards` array
- Hugo, Nebula, and All Awards controls; Nebula remains disabled until its data is added
- Static HTML, CSS, JavaScript, and JSON

## Product decisions

- Keep the catalogue factual, neutral, and spoiler-free
- Use one card per unique story
- Show multiple awards on the same card when a story won both
- Show award names in text as well as colour
- Use 12-entry numbered pagination rather than infinite scrolling
- Keep one exact award-year filter and do not add decade navigation yet
- Store catalogue state in URL parameters
- Keep publication as quiet secondary metadata
- Use a separate **Read story** action rather than linking the title
- Link only to verified full text on publisher, magazine, or author-controlled sites
- Show **NA** in a fixed reading-action slot when no verified public text is available
- Keep the quiet terminal-library visual direction

## Next

### 1. Prepare the combined Hugo and Nebula model

- [x] Allow legitimate ties and multiple winners in one award year
- [x] Reject duplicate award-year assignments within the same story
- [x] Report probable duplicate stories using normalized title and author matching
- [x] Search all award metadata displayed on a story card
- [x] Test ties, shared winners, award-specific years, sorting, and search
- [x] Document how shared stories and differing award years are represented
- [x] Describe the planned Hugo and Nebula scope without overstating current coverage
- [x] Show synchronized pagination above and below multi-page results
- [x] Replace the cryptic Collection 01 home link with the site name
- [x] Remove the duplicate homepage header navigation and link the main title home
- [x] Add a restrained cursor, underline, and glow treatment to the linked title
- [x] Keep About in a minimal footer with a reciprocal collection link
- [x] Reduce desktop pagination height and spacing while preserving its current style
- [x] Increase mobile page gutters and tighten pagination spacing
- [x] Reduce mobile pagination controls to 40px while preserving equal widths

### 2. Simplify About and finish minor website polish

- [x] Use the same clickable site title on the homepage and About page
- [x] Keep the header description to one line on both pages
- [x] Replace the verbose About sections with two concise paragraphs
- [x] Keep a small accessible About label instead of a second large page title
- [x] Remove the in-content return link and keep **Browse the collection** in the footer
- [x] Hide corrections information until a corrections email is configured
- [x] Reserve a fixed reading-action position on every winner card
- [x] Show a disabled-style **NA** placeholder when no reading link is available
- [x] Give the placeholder an accessible **Read story unavailable** label
- [x] Verify linked and unavailable cards on desktop and mobile
- [x] Give No Award records a signal-yellow warning indicator and distinct card treatment
- [x] Replace story-like No Award copy with **No story received the award**
- [x] Keep the award/year badge and a source-only action row

### 3. Add Nebula results for 2001-2025

- [ ] Research Nebula Best Short Story results for award years 2001-2025
- [ ] Verify every result against official Nebula Awards sources
- [ ] Include every winner in the 25-year window, including legitimate ties
- [ ] Verify title, author, publication, award year, and source URL
- [ ] Find and verify reading links where public full text is available
- [ ] Keep unavailable winners visible without purchase or borrowing substitutes
- [ ] Merge stories that also won a Hugo into their existing story records
- [ ] Preserve the separate Hugo and Nebula award years and source links
- [ ] Enable the Nebula filter after the records are present
- [ ] Update the homepage description and About-page scope
- [ ] Validate complete Nebula coverage for the 2001-2025 award-year window
- [ ] Test Nebula-only, Hugo-only, All Awards, and shared-winner views

### 4. Finalize historical archive scope

- [ ] Decide the Hugo start year
- [ ] Choose between the current 2001 cutoff, another recent-year cutoff, or complete Best Short Story coverage beginning in 1955
- [ ] Decide the Nebula start year
- [ ] Choose between a recent-year cutoff or complete Best Short Story coverage beginning with the 1965 award year
- [ ] Confirm whether the first public release requires both Hugo and Nebula data
- [ ] Confirm that No Award results remain visible where applicable
- [ ] Document the difference between Hugo and Nebula award-year conventions

### 5. Expand beyond the 2001-2025 window

- [ ] Research the approved Hugo year range against official award sources
- [ ] Research the approved Nebula year range against official award sources
- [ ] Verify title, author, publication, award year, and source URL for every result
- [ ] Find and verify reading links where public full text is available
- [ ] Keep unavailable winners visible without purchase or borrowing substitutes
- [ ] Merge stories that won both awards into one record
- [ ] Preserve separate award years and official source links on shared winners
- [ ] Update page descriptions and About-page scope after the final dataset is loaded

### 6. Verify the combined archive

- [ ] Confirm the expected year coverage for each award
- [ ] Confirm every award result appears exactly once, except legitimate ties
- [ ] Confirm shared winners appear as one story with multiple award labels
- [ ] Test search, award, year, sorting, pagination, and Reset together
- [ ] Test records with one award, multiple awards, no reading link, and No Award
- [ ] Run data validation and review all reported problems
- [ ] Run the external-link checker and manually review blocked or redirected links
- [ ] Complete the manual release checklist below

### 7. Publish and maintain

- [ ] Choose a monitored corrections email
- [ ] Set `correctionsEmail` in `data/site.json`
- [ ] Choose a static hosting provider
- [ ] Deploy the site publicly
- [ ] Choose and connect a domain
- [ ] Add canonical URLs and sitemap details
- [ ] Verify the production site on desktop and mobile
- [ ] Schedule periodic award-data and external-link reviews

### Later possibilities

- [ ] Decide whether to include nominees
- [ ] Consider original summaries
- [ ] Consider themes and reading-time estimates
- [ ] Consider curated collections
- [ ] Consider saved lists

## Test instructions

### Run locally

From the project directory:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open <http://127.0.0.1:4173>.

### Automated checks

```bash
npm test
npm run validate
npm run check:links
```

`npm run check:links` makes live requests to external sites. A remote site may block automated requests even when its link works in a browser, so failures require manual review.

### Manual release checklist

- [ ] Confirm the default view shows at most 12 entries
- [ ] Confirm top and bottom pagination show Previous, numbered pages, and Next on desktop
- [ ] Confirm top and bottom pagination show Previous, page status, and Next on mobile
- [ ] Confirm pagination updates the URL and survives refresh
- [ ] Confirm browser Back and Forward restore the previous catalogue state
- [ ] Confirm search works across title, author, publication, award, and year
- [ ] Confirm award, exact year, sort order, and search work together
- [ ] Confirm changing any filter returns to page 1
- [ ] Confirm Reset restores the default view and URL
- [ ] Confirm unavailable stories and No Award records remain readable
- [ ] Confirm dual winners show both award labels and both official sources
- [ ] Confirm keyboard focus is visible on every control and link
- [ ] Confirm there is no horizontal overflow at 375px, 768px, and 1280px
- [ ] Confirm the homepage, About page, JavaScript, CSS, and JSON assets load successfully

## Completed work

- [x] Established the name, product scope, link policy, and independent-project documentation
- [x] Added and verified Hugo Best Short Story results for 2001-2025
- [x] Added 16 verified reading links and honest unavailable states
- [x] Built search, exact-year filtering, sorting, result counts, Reset, and failure states
- [x] Implemented the quiet terminal-library design for desktop and mobile
- [x] Added the About page, corrections configuration, Open Graph metadata, and theme metadata
- [x] Migrated the catalogue to unique story records with award arrays
- [x] Added award-aware controls, labels, source links, 12-entry pagination, and URL state
- [x] Added data validation, live link checking, and 16 automated catalogue tests
- [x] Prepared the shared Hugo and Nebula model with tie support and duplicate review
- [x] Simplified the About page and aligned linked and unavailable story actions
- [x] Verified the current build at mobile, tablet, and desktop widths
