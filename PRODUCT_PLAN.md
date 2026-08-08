# SciFi Short Stories

## Product

An independent, spoiler-free index of award-winning science fiction and fantasy short stories. Readers can browse award results and follow available stories to external reading sources.

## Live status

- Production: <https://scifi-shorts.pages.dev/>
- Current hosting: Cloudflare Pages through GitHub integration
- Source repository: <https://github.com/meetsha/scifi-shorts>
- Previous deployment: <https://scifi-short-story-collection.uiandgame.chatgpt.site/>
- Current deployed site content: introduced in commit `b3eec80` and verified on Cloudflare Pages
- Deployed scope: Hugo short-fiction results for 1955-2025, including a category-not-presented marker for 1957, and Nebula Best Short Story results for 1965-2025
- Deployed catalogue: 121 unique entries and 133 award records
- Deployed reading availability: 115 selected reading links, including 104 web pages and 11 PDFs; 3 winners remain unavailable
- Local working scope: Hugo short-fiction results for 1955-2025, including a category-not-presented marker for 1957, and Nebula Best Short Story results for 1965-2025
- Local working catalogue: 121 unique entries and 133 award records
- Local reading availability: 115 selected reading links, including 104 web pages and 11 PDFs; 3 winners remain unavailable
- Latest local milestone: Add quiet, locally stored finished-story tracking
- Local preview: <http://localhost:8000>

During an active working session, keep the local preview running on port `8000`. Stop it only when explicitly requested.

## Current experience

- Search by title, author, publication, award, or year
- Filter by Hugo, Nebula, or All Awards
- Sort newest or oldest first
- Browse 10 entries per page with synchronized top and bottom pagination
- Mark winner cards as finished with a compact checkbox beside the reading action
- Preserve catalogue state in the URL
- Show one card per unique story, including shared Hugo and Nebula winners
- Show one factual, spoiler-light introduction on every winner card
- Show **Read story** for selected web pages and **Read PDF** for selected PDF sources
- Show a fixed, disabled-style **NA** action when no reading link is available
- Link bracketed award-year labels directly to official award sources
- Link each author name to an all-awards catalogue view for that author
- Provide a concise About page and corrections contact
- Support desktop and mobile with a quiet terminal-library visual direction
- Use **SciFi Short Stories** as the product name throughout the site and repository documentation

## Product decisions

- Keep the catalogue factual, neutral, and spoiler-free
- Use award year, not publication year, for navigation
- Use each official archive's award-year label; Hugo and Nebula years are not normalized to a shared publication year
- Include Hugo's official Short Fiction predecessor category for 1960-1966
- Show 1957 as a distinct Hugo category-not-presented record because no equivalent category existed that year
- Use one card per unique story
- Keep the catalogue as a streamlined one-column list on desktop and mobile
- Place **Read story** and **NA** in a compact right-side action area on desktop while retaining full-width mobile actions
- Preserve separate award years and sources when a story won both awards
- Show award names in text as well as colour
- Render award sources as `[ HUGO · YEAR ]` and `[ NEBULA · YEAR ]`
- Keep square brackets plain and permanently underline the clickable inner label
- Do not repeat official award-source links beneath the card
- Use 10-entry numbered pagination rather than infinite scrolling so the longer story cards do not make each page feel excessive
- Use catalogue search for award-year lookup instead of a separate exact-year control
- Store catalogue state in URL parameters
- Keep publication as quiet secondary metadata
- Add one original, factual, spoiler-light hook of 12-20 words to every winning story
- Keep introductions permanently visible between story metadata and the reading action without adding a label or disclosure control
- Keep introductions out of search for now rather than presenting incomplete theme search
- Give each introduction an unresolved complication, contrast, or question rather than reducing it to flat plot metadata
- Make author names understated internal links that show all catalogue entries by that author
- When an author is selected, clear the award filter, retain the current sort order, update URL history, and do not focus the search field
- On mobile, keep author text cream but use a permanent phosphor underline and a 40px tap target so the link is discoverable without adding an icon or button
- Use a separate **Read story** action rather than linking the title
- Prefer author, publisher, and established publication sources while retaining selected archives and third-party full-text sources when they improve reader access
- Keep `data/stories.json` as the only live source of truth for reading links and their metadata
- Replace `storyUrl` with a nullable `reading` object containing `url`, `format`, and `sourceType`
- Use `web` and `pdf` as reading formats; show **Read story** for web pages and **Read PDF** for PDFs
- Use `publication`, `archive`, and `third-party` as factual source types; keep source type internal rather than adding confidence labels to story cards
- Treat `LINK_REVIEW.md` as a temporary migration artifact, not a synchronized catalogue; it was removed after migration
- Keep unavailable winners visible without purchase or borrowing substitutes
- Keep the 2015 Hugo No Award result visible with distinct compact status treatment
- Keep the 1957 Hugo category-not-presented record visible with the same compact treatment and distinct copy
- Keep special-result award metadata above the result sentence on desktop and mobile
- Keep the restrained near-black, monospaced terminal-library design
- Use the subtitle **Hugo and Nebula short story winners**
- Reduce mobile header padding and keep the title on one line down to the supported 320px minimum
- Remove the **Award results** heading and entry-range row
- Preserve a visually hidden catalogue heading and live result-count announcements for assistive technology
- Keep top and bottom pagination visible for one-page and empty filtered states so the layout remains stable
- On mobile, place **Page X of Y** between the Previous and Next controls
- Use a consistent 10px rhythm between catalogue dividers, pagination controls, and story cards across viewport sizes
- Keep the footer compact across viewport sizes while preserving a 44px About tap target
- Keep both HTML entry pages at the repository root
- Group browser JavaScript, CSS, and the favicon under `assets/`; keep runtime JSON under `data/`
- Keep the browser site dependency-free and directly served without a frontend framework or bundler
- Generate releases in ignored `dist/` using a dependency-free allowlist build script
- Keep repository-wide agent guidance in root `AGENTS.md`; use nested files only for genuinely narrower scope

## Roadmap

### 1. Finalize historical archive scope

- [x] Expand to complete historical coverage
- [x] Begin Hugo coverage in 1955
- [x] Begin Nebula coverage with the 1965 award year
- [x] Expand both awards together in reverse chronological batches
- [x] Use ten-year batches until the final partial historical batch
- [x] Document the difference between Hugo and Nebula award-year conventions

### 2. Expand beyond the 2001-2025 window

#### Batch 1: 1991-2000

- [x] Research Hugo and Nebula results against official award sources
- [x] Verify title, author, publication, award year, and source URL
- [x] Find reading links where verified public full text is available
- [x] Keep unavailable winners visible without purchase or borrowing substitutes
- [x] Merge stories that won both awards into one record
- [x] Update validators, tests, catalogue counts, and scope copy
- [x] Verify the expanded archive locally

#### Historical batches

- [x] Batch 2: 1981-1990 for both awards; merge the 1990 Nebula into the existing "Bears Discover Fire" record
- [x] Batch 3: 1971-1980 for both awards
- [x] Batch 4: 1955-1970 for Hugo and 1965-1970 for Nebula

### 3. Verify the expanded archive

- [x] Confirm the expected year coverage for each award
- [x] Confirm every award result appears exactly once, except legitimate ties
- [x] Confirm shared winners appear as one story with multiple award labels
- [x] Test search, award filtering, sorting, pagination, and Reset together
- [x] Test records with one award, multiple awards, no reading link, and No Award
- [x] Run data validation and review all reported problems
- [x] Complete the relevant manual checks for the changed features

### 4. Tidy the repository

Goal: make the repository easy to understand and maintain without changing the catalogue, interface, or deployed behaviour.

#### Research and decisions

- [x] Inventory website source, catalogue data, tests, validation scripts, documentation, generated output, and platform-specific adapters
- [x] Confirm that Vite is currently present as part of the ChatGPT Sites and Vinext build stack rather than as a standalone project decision
- [x] Review current Vite, npm, Node test-runner, and Git ignore conventions against the repository
- [x] Keep the project as a directly served static site without Vite or another frontend build tool
- [x] Keep `index.html` and `about.html` at the repository root, group browser JavaScript and CSS under `assets/`, and retain runtime JSON under `data/`
- [x] Generate an ignored `dist/` directory with a dependency-free allowlist build script so production output contains only public website assets
- [x] Remove the ChatGPT Sites, Next, Vinext, Vite, Worker, React, and TypeScript adapter stack from the tracked project
- [x] Keep `AGENTS.md` at the repository root for repository-wide guidance; add nested `AGENTS.md` files only when a subtree needs genuinely different instructions
- [x] Keep `README.md`, `PRODUCT_PLAN.md`, `AGENTS.md`, package metadata, and repository configuration at the root

#### Cleanup

- [x] Classify every retained file by a clear runtime, data, test, documentation, build, or repository-management responsibility
- [x] Remove obsolete adapters, configuration, dependencies, and scripts only after their references and replacement workflow are verified
- [x] Simplify `package.json` and regenerate `package-lock.json` to represent only deliberate tooling
- [x] Keep generated output, dependency folders, local platform state, editor files, and credentials out of Git
- [x] Use consistent names and locations for browser code, static data, tests, and maintenance scripts
- [x] Update imports, fetched asset paths, tests, and local commands after any file moves
- [x] Update `README.md`, this plan, and repository instructions to match the final structure

#### Verification

- [x] Confirm a clean dependency setup can be previewed, tested, validated, and built using only documented commands
- [x] Run the automated catalogue tests and data validation
- [x] Verify both pages and every moved browser asset load locally; retain existing automated coverage for catalogue controls
- [x] Confirm the production output contains only intended public assets
- [x] Confirm Git tracks no generated output, dependency folders, local platform state, credentials, or operating-system files

### 5. Improve code readability

Goal: make the existing static implementation easier to understand and extend without changing the catalogue, interface, data, or URL behaviour.

#### JavaScript and data contracts

- [x] Keep `app.js` focused on catalogue loading, control state, URL history, and event wiring
- [x] Extract story, message, and pagination DOM rendering into one `catalogue-view.js` module
- [x] Keep display labels with the view instead of creating a catch-all constants module
- [x] Define Hugo and Nebula archive coverage once and reuse it in validation and tests
- [x] Rename the shared No Award and Category Not Presented presentation class to `story-card--special-result`

#### Stylesheet cleanup

- [x] Keep one stylesheet and add clear sections for foundations, header, controls, catalogue cards, pagination, About, and responsive rules
- [x] Remove the unused `.back-link` component
- [x] Remove the redundant generic `h1` declarations and target `.site-title` where that behavior is intended
- [x] Remove repeated `box-sizing` declarations already supplied by the universal selector
- [x] Remove the unused `pagination--bottom` class token from the HTML
- [x] Confirm every remaining component selector is used by static markup or runtime-generated markup

#### Verification

- [x] Run JavaScript syntax checks, catalogue tests, and data validation
- [x] Verify search, filters, sorting, Reset, URL state, pagination, special results, and the About page locally
- [x] Confirm the refactor introduces no intended visual or product changes
- [x] Update repository documentation and this plan to reflect the final code boundaries

### 6. Migrate reviewed reading links

Goal: migrate the completed manual review into the canonical catalogue while keeping the public reading experience simple.

#### Decisions and review

- [x] Review all 118 winning-story records
- [x] Select 115 reading links and retain 3 intentional unavailable states
- [x] Keep `data/stories.json` as the only live source of truth after migration
- [x] Use a nullable `reading` object with `url`, `format`, and `sourceType`
- [x] Show format through the action copy: **Read story**, **Read PDF**, or **NA**
- [x] Store factual source type instead of a subjective confidence score
- [x] Keep source type out of the card interface for now
- [x] Keep `LINK_REVIEW.md` in place during migration and remove it afterward

#### Data and implementation

- [x] Add validation for complete `reading` objects and `null` unavailable states
- [x] Support `web` and `pdf` formats
- [x] Support `publication`, `archive`, and `third-party` source types
- [x] Import every reviewed `Site link` into the matching winner record
- [x] Confirm each review entry matches exactly one catalogue record by title and author, with award metadata as a safeguard
- [x] Leave No Award and Category Not Presented records unchanged
- [x] Update story-card actions to render **Read story**, **Read PDF**, or **NA**
- [x] Add concise About-page copy explaining that reading links open external sources and may change
- [x] Update catalogue counts, README data-contract documentation, and completed-work notes

#### Verification

- [x] Confirm 118 winner records contain either a complete `reading` object or `null`
- [x] Confirm 115 selected reading links and 3 intentional unavailable states after migration
- [x] Confirm every PDF and web-page action uses the correct label and accessible name
- [x] Confirm linked, PDF, unavailable, shared-winner, and special-result cards render correctly
- [x] Run catalogue tests and data validation
- [x] Perform focused desktop and mobile checks without rerunning the full external-link sweep
- [x] Remove `LINK_REVIEW.md` after confirming it is no longer needed

### 7. Improve author discovery

Goal: make author names a small, design-consistent discovery tool without making story cards feel busier.

- [x] Render each winner's author as a keyboard-accessible internal catalogue link
- [x] Show all stories by the selected author across both awards and all years
- [x] Preserve the current sort order while returning to page one
- [x] Update URL history so browser Back restores the previous catalogue state
- [x] Avoid focusing the search field or opening the mobile keyboard
- [x] Style author links with the existing thin underline, phosphor hover/focus colour, and restrained glow
- [x] Run focused interaction, keyboard, desktop, and mobile checks
- [x] Strengthen mobile author-link discoverability with a permanent phosphor underline and 40px tap target
- [x] Preserve the existing card hierarchy and compensate for the larger tap target in metadata spacing

### 8. Add story introductions

Goal: help readers understand each story's opening premise without turning the catalogue into a review site or making cards difficult to scan.

#### Data and editorial rules

- [x] Merge `STORY_INTRO_DRAFTS.json` into winner records in `data/stories.json` by exact `id`
- [x] Store the final text in an `intro` field and keep `data/stories.json` as the only live source of truth
- [x] Rewrite every winner introduction as one original, factual, spoiler-light sentence of 12-20 words
- [x] Set `intro` to `null` for No Award and Category Not Presented records
- [x] Keep introductions free of recommendations, source attribution, endings, late-story revelations, and unsupported clickbait
- [x] End each introduction with a genuine unresolved complication, contrast, or question when the premise supports one
- [x] Remove the temporary drafts and one-off research brief after successful migration

#### Card and pagination changes

- [x] Display the introduction between author/publication metadata and the reading action
- [x] Keep it permanently visible without an **Intro**, **Premise**, or **Summary** label
- [x] Style it as comfortable soft-cream body copy within the existing monospaced terminal-library design
- [x] Preserve the compact right-side reading action on desktop and the full-width action on mobile
- [x] Reduce pagination from 12 to 10 entries per page to offset the taller cards
- [x] Keep introduction text out of search for now; retain current title, author, publication, award, and year search behavior

#### Verification

- [x] Validate exact winner coverage, unique IDs, catalogue order, record shape, one-sentence structure, and the 12-20-word limit
- [x] Test winner and special-result records, both pagination boundaries, filtering, sorting, Reset, and URL state
- [x] Check card hierarchy, readable line lengths, action alignment, and page density on desktop and mobile
- [x] Run catalogue tests, data validation, and the production build without running the external-link checker
- [x] Update README data-contract documentation and completed-work notes

### 9. Publish and maintain

- [x] Configure a monitored corrections contact
- [x] Choose ChatGPT Sites for the initial public deployment
- [x] Deploy the site publicly
- [x] Verify the production site on desktop and mobile
- [x] Deploy and smoke-test the complete historical archive
- [x] Choose Cloudflare Pages with GitHub integration as the next hosting target
- [x] Push the cleaned repository to GitHub
- [x] Connect the GitHub repository to Cloudflare Pages
- [x] Configure Cloudflare Pages to run `npm run build` and publish `dist/`
- [x] Verify the Cloudflare Pages deployment before changing the public domain
- [ ] Choose and connect a custom domain
- [ ] Add canonical URLs and sitemap details
- [ ] Define the process for adding new annual award results

### 9. Track finished stories

Goal: let readers quietly record which stories they have finished without adding another prominent catalogue control.

- [x] Add a compact checkbox immediately to the right of the existing **Read story**, **Read PDF**, or **NA** action on both desktop and mobile
- [x] Keep the checkbox visually unlabeled but clearly interactive through its pointer, hover, focus, and pressed states; provide an accessible name that describes marking the story as finished
- [x] Keep the checkbox and reading action on one row; give the checkbox the same height and bordered control treatment as the reading action without weakening that primary action
- [x] Store finished state locally by stable story ID; opening a reading link never marks a story automatically, and catalogue Reset or navigation never clears finished state
- [x] When checked, use the existing green accent and subtly quiet the completed card while keeping its text legible, its reading action fully usable, and its dimensions unchanged
- [x] Restore the normal card treatment immediately when unchecked
- [x] Include all winner cards, including those with **NA** reading actions, while excluding **No Award** and **Category Not Presented** results
- [x] Keep reading-action labels free of a trailing external-link arrow
- [x] Do not add a progress summary, finished-story filter, or additional catalogue row in this first version
- [x] Verify persistence, safe storage failure, keyboard accessibility, and the checked and unchecked layouts on desktop and mobile

### Later possibilities

- [ ] Decide whether to include nominees
- [ ] Consider themes and reading-time estimates
- [ ] Consider curated collections
- [ ] Consider saved lists

## Working process

- Update this plan before implementation when a product or design decision changes
- Update completed checkboxes after implementation and verification
- Before every commit, update this plan to reflect current decisions, completed work, remaining work, and local or deployed status; stage the plan update in the same commit
- Keep the local site running throughout an active session
- Stop the local server only when explicitly requested
- For minor visual or copy changes, run focused local checks only
- Do not deploy or test the public site unless deployment is explicitly requested
- Do not run the full external-link checker unless it is explicitly requested
- Match testing effort to the files and behavior that changed

## Test instructions

### Local preview

From the project directory:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://localhost:8000>. Leave this process running during the session.
If it is already running, reuse the existing server instead of starting another one.

### Minor visual or copy changes

Run only focused checks:

```bash
git diff --check
node --check assets/js/app.js
```

Run the JavaScript check only when JavaScript changed. Inspect the affected interface locally at the relevant desktop and mobile widths. Do not run the full application suite merely because CSS or copy changed.

### Logic or catalogue changes

Run the checks relevant to the change:

```bash
npm test
npm run validate
```

Run `npm test` when catalogue behavior changes. Run `npm run validate` when story data or site configuration changes.

### External-link checks

Run this command only when explicitly requested:

```bash
npm run check:links
```

This command makes live requests to every external reading and award-source URL. It is not part of routine visual changes or deployments.

### Production build

Run before deployment:

```bash
npm run build
```

Fix build failures before publishing.

## Deployment steps

1. Keep the local preview running.
2. Review the pending diff and select tests based on what changed.
3. Increment the query-string cache version for any changed versioned static asset.
4. Run the production build.
5. Commit the exact validated source state.
6. Push that commit to the GitHub repository connected to the selected static host.
7. Let the host run `npm run build` and publish only `dist/`.
8. Wait for deployment to report success.
9. Test the deployed URL using the focused production checklist below.
10. Leave the local preview running unless explicitly asked to stop it.

The cache query value is only a browser cache-busting identifier. It is not the product or Sites version number.

## Production test checklist

Run these checks after an explicitly requested deployment:

- [ ] Confirm the homepage and every changed route load
- [ ] Confirm JavaScript, CSS, JSON, and other changed assets load
- [ ] Confirm the expected catalogue count appears
- [ ] Confirm the changed behavior works on desktop
- [ ] Confirm the changed behavior works at the relevant mobile width
- [ ] Confirm there is no new horizontal overflow
- [ ] Confirm there are no browser console errors

Run these only when the related behavior changed:

- [ ] Test search, award, sort, and Reset
- [ ] Confirm Reset does not focus search or open the mobile keyboard
- [ ] Test top and bottom pagination
- [ ] Test URL state, refresh, Back, and Forward behavior
- [ ] Test About and home navigation
- [ ] Test linked, unavailable, shared-winner, and No Award cards

Do not include the external-link checker in production smoke testing unless it was explicitly requested.

## Completed work

- [x] Established the name, neutral catalogue scope, link policy, and independent-project documentation
- [x] Added and verified Hugo and Nebula Best Short Story results for 2001-2025
- [x] Added 37 verified reading links and honest unavailable states
- [x] Migrated to unique story records with award arrays, tie support, and duplicate validation
- [x] Built search, award filtering, sorting, Reset, URL state, and pagination
- [x] Merged twelve shared winners while preserving both award years and sources
- [x] Implemented the quiet terminal-library design for desktop and mobile
- [x] Simplified the About page and configured corrections through `data/site.json`
- [x] Added 28 automated catalogue tests and dependency-free data validation
- [x] Fixed mobile Reset focus behavior
- [x] Replaced duplicate award-source actions with bracketed clickable award labels
- [x] Published and verified Sites version 3 on July 30, 2026
- [x] Expanded the local archive through 1991 with 19 additional stories and 20 award records
- [x] Completed historical Hugo coverage from 1955 with a category-not-presented marker for 1957
- [x] Completed historical Nebula coverage from its 1965 award year
- [x] Added 55 historical entries and 61 award records across the final three batches
- [x] Added a distinct 1957 Hugo category-not-presented record so the historical gap is explicit
- [x] Published and smoke-tested Sites version 4 with complete historical coverage on July 30, 2026
- [x] Rebalanced and deployed desktop story cards with wider right-aligned actions while preserving the mobile layout
- [x] Tidied the repository into root HTML entry pages, grouped browser assets, runtime data, maintenance scripts, and tests
- [x] Removed the ChatGPT Sites, Next, Vinext, Vite, Worker, React, and TypeScript adapter stack
- [x] Reduced the lockfile from 321 package entries to one dependency-free project entry and added an allowlisted `dist/` build
- [x] Split catalogue coordination, pure data logic, and DOM rendering into explicit JavaScript boundaries
- [x] Audited the stylesheet, removed dead and redundant rules, and documented its component sections
- [x] Completed a manual reading-source review for all 118 winners, selecting 115 links and retaining 3 unavailable states
- [x] Migrated reading links into canonical `reading` objects with format and source-type metadata
- [x] Published the cleaned repository at `meetsha/scifi-shorts` on GitHub
- [x] Deployed commit `b3eec80` to Cloudflare Pages and completed focused desktop and mobile smoke testing on August 3, 2026
- [x] Added internal author catalogue links with URL history support
- [x] Improved mobile author-link discoverability with a permanent phosphor underline and 40px tap target
- [x] Excluded the local `stories/` research folder from version control
- [x] Added 118 spoiler-light, 12-20-word story hooks, validated their editorial limits, and reduced pagination to 10 entries
- [x] Updated 29 reading links to z-lib.gl and added an optional reading `note` field for the one collection link
- [x] Removed the separate award-year control and moved Reset beside Sort order to reduce the controls by one row
- [x] Renamed the product to **SciFi Short Stories**, standardized catalogue and footer spacing, kept pagination stable, restored hidden accessibility context, compacted special results, and removed the Reader mode tip
