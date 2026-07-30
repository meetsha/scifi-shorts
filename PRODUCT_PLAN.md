# SciFi Short Story Collection

## Product

An independent, spoiler-free index of award-winning science fiction and fantasy short stories. Readers can browse award results and follow available stories to the publisher, magazine, or author's website.

## Live status

- Production: <https://scifi-short-story-collection.uiandgame.chatgpt.site/>
- Hosting: ChatGPT Sites
- Current deployed release: Sites version 3, commit `a55c9e2`
- Scope: Hugo and Nebula Best Short Story results for award years 2001-2025
- Catalogue: 46 unique entries and 51 award records
- Reading availability: 29 verified reading links and 16 winners without verified online text
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
- Use one card per unique story
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
- Keep the restrained near-black, monospaced terminal-library design

## Roadmap

### 1. Finalize historical archive scope

- [ ] Decide whether 2001-2025 remains the permanent curated window or expands
- [ ] If expanding, decide whether Hugo coverage begins in 1955
- [ ] If expanding, decide whether Nebula coverage begins with the 1965 award year
- [ ] Document the difference between Hugo and Nebula award-year conventions

### 2. Expand beyond the 2001-2025 window

- [ ] Research the approved Hugo year range against official award sources
- [ ] Research the approved Nebula year range against official award sources
- [ ] Verify title, author, publication, award year, and source URL for every result
- [ ] Find and verify reading links where public full text is available
- [ ] Keep unavailable winners visible without purchase or borrowing substitutes
- [ ] Merge stories that won both awards into one record
- [ ] Preserve separate award years and official source links on shared winners
- [ ] Update page descriptions and About-page scope after loading the final dataset

### 3. Verify the expanded archive

- [ ] Confirm the expected year coverage for each award
- [ ] Confirm every award result appears exactly once, except legitimate ties
- [ ] Confirm shared winners appear as one story with multiple award labels
- [ ] Test search, award, year, sorting, pagination, and Reset together
- [ ] Test records with one award, multiple awards, no reading link, and No Award
- [ ] Run data validation and review all reported problems
- [ ] Complete the relevant manual checks for the changed features

### 4. Publish and maintain

- [x] Configure a monitored corrections contact
- [x] Choose ChatGPT Sites for the initial public deployment
- [x] Deploy the site publicly
- [x] Verify the production site on desktop and mobile
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
node --check app.js
```

Use `node --check app.js` only when JavaScript changed. Inspect the affected interface locally at the relevant desktop and mobile widths. Do not run the full application suite merely because CSS or copy changed.

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
6. Push that commit to the existing ChatGPT Sites source repository.
7. Package the build, save a new Sites version, and deploy it to the existing public project.
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
- [x] Added 29 verified reading links and honest unavailable states
- [x] Migrated to unique story records with award arrays, tie support, and duplicate validation
- [x] Built search, award and year filters, sorting, Reset, URL state, and pagination
- [x] Merged five shared winners while preserving both award years and sources
- [x] Implemented the quiet terminal-library design for desktop and mobile
- [x] Simplified the About page and configured corrections through `data/site.json`
- [x] Added 21 automated catalogue tests and dependency-free data validation
- [x] Fixed mobile Reset focus behavior
- [x] Replaced duplicate award-source actions with bracketed clickable award labels
- [x] Published and verified Sites version 3 on July 30, 2026
