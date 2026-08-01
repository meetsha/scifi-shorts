# SciFi Short Story Collection

## Product

An independent, spoiler-free index of award-winning science fiction and fantasy short stories. Readers can browse award results and follow available stories to the publisher, magazine, or author's website.

## Live status

- Production: <https://scifi-short-story-collection.uiandgame.chatgpt.site/>
- Current hosting: ChatGPT Sites
- Next hosting target: Cloudflare Pages through GitHub integration; not yet configured
- Current deployed release: Sites version 5, commit `436c5a7`
- Deployed scope: Hugo short-fiction results for 1955-2025, including a category-not-presented marker for 1957, and Nebula Best Short Story results for 1965-2025
- Deployed catalogue: 121 unique entries and 133 award records
- Deployed reading availability: 37 verified reading links and 81 winners without verified online text
- Local working scope: Hugo short-fiction results for 1955-2025, including a category-not-presented marker for 1957, and Nebula Best Short Story results for 1965-2025
- Local working catalogue: 121 unique entries and 133 award records
- Local reading availability: 37 verified reading links and 81 winners without verified online text
- Latest local milestone: Complete the code-readability refactor and stylesheet cleanup
- Local preview: <http://localhost:8000>

During an active working session, keep the local preview running on port `8000`. Stop it only when explicitly requested.

## Current experience

- Search by title, author, publication, award, or year
- Filter by Hugo, Nebula, or All Awards
- Filter by exact award year
- Sort newest or oldest first
- Browse 12 entries per page with synchronized top and bottom pagination
- Preserve catalogue state in the URL
- Show one card per unique story, including shared Hugo and Nebula winners
- Show **Read story** when verified full text is available
- Show a fixed, disabled-style **NA** action when no verified text is available
- Link bracketed award-year labels directly to official award sources
- Provide a concise About page and corrections contact
- Support desktop and mobile with a quiet terminal-library visual direction

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
- Use 12-entry numbered pagination rather than infinite scrolling
- Keep one exact-year filter and do not add decade navigation yet
- Store catalogue state in URL parameters
- Keep publication as quiet secondary metadata
- Use a separate **Read story** action rather than linking the title
- Link reading actions only to verified full text on publisher, magazine, or author-controlled sites
- Keep unavailable winners visible without purchase or borrowing substitutes
- Keep the 2015 Hugo No Award result visible with distinct warning treatment
- Keep the 1957 Hugo category-not-presented record visible with the same warning treatment and distinct copy
- Keep the restrained near-black, monospaced terminal-library design
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
- [x] Test search, award, year, sorting, pagination, and Reset together
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

### 6. Publish and maintain

- [x] Configure a monitored corrections contact
- [x] Choose ChatGPT Sites for the initial public deployment
- [x] Deploy the site publicly
- [x] Verify the production site on desktop and mobile
- [x] Deploy and smoke-test the complete historical archive
- [x] Choose Cloudflare Pages with GitHub integration as the next hosting target
- [ ] Push the cleaned repository to GitHub
- [ ] Connect the GitHub repository to Cloudflare Pages
- [ ] Configure Cloudflare Pages to run `npm run build` and publish `dist/`
- [ ] Verify the Cloudflare Pages deployment before changing the public domain
- [ ] Choose and connect a custom domain
- [ ] Add canonical URLs and sitemap details
- [ ] Define the process for adding new annual award results

### Later possibilities

- [ ] Decide whether to include nominees
- [ ] Consider original summaries
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

- [ ] Test search, award, year, sort, and Reset
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
- [x] Built search, award and year filters, sorting, Reset, URL state, and pagination
- [x] Merged twelve shared winners while preserving both award years and sources
- [x] Implemented the quiet terminal-library design for desktop and mobile
- [x] Simplified the About page and configured corrections through `data/site.json`
- [x] Added 21 automated catalogue tests and dependency-free data validation
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
