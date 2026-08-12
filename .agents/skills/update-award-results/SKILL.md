---
name: update-award-results
description: Verify and prepare annual Hugo Short Story or Nebula Best Short Story catalogue updates in the SciFi Short Stories repository. Use when checking whether a newly announced award result is already represented, adding or merging official winner records, handling ties or special results, or performing the one-time trial required before scheduling the recurring award check. Do not use for unrelated catalogue copy, layout, or source-link cleanup.
---

# Update Award Results

Maintain `data/stories.json` from official award results while preserving the catalogue's data contract and review gates.

## Establish the target

1. Work from the repository root.
2. Read `AGENTS.md`, the catalogue data model in `README.md`, and the relevant verification rules in `PRODUCT_PLAN.md`.
3. Identify the award and archive year. Preserve the year used by the official archive:
   - Use the Hugo ceremony year.
   - Use the Nebula award-year label, even when the ceremony occurs the following calendar year.
4. Inspect existing work with `git status --short`. Preserve unrelated changes.
5. Run the bundled status helper:

   ```bash
   node .agents/skills/update-award-results/scripts/check-award-year.mjs \
     --repo . --award nebula --year 2025
   ```

Treat `FOUND` only as a catalogue-presence check. Never call the catalogue current until its assignments match the official result, including every tie.

## Verify the official result

Read [references/award-sources.md](references/award-sources.md) before researching a result.

1. Browse the official award archive or official winner announcement.
2. Confirm the exact category, archive year, winner title, author, publication, and every tie.
3. Prefer agreement between the official archive and announcement. If official pages conflict, stop with `NEEDS_REVIEW`; do not guess.
4. If no official result exists yet, make no data change and report `NO_OFFICIAL_RESULT`.
5. Never infer `no-award` or `not-presented`; add either only when the official record explicitly says so.

## Prepare catalogue records

For each official result:

1. Match an existing winner by normalized title and author.
2. When it already exists, append the new award assignment to its `awards` array. Do not duplicate the story.
3. Otherwise, add one winner record with the schema documented in `README.md`.
4. Use the official result page as `awards[].sourceUrl`.
5. Find a legal, complete reading route when available. Prefer the original publication, then an authorized archive or reprint. Set `reading` to `null` when no suitable route is verified; never delay recording an official winner solely because a reading link is unavailable.
6. Classify `reading.sourceType` as `publication`, `archive`, or `third-party` based on the actual host.
7. Write an original, factual, spoiler-light `intro` of 12–20 words and exactly one sentence. Base it on the story or reliable publisher material; do not invent plot details.
8. Preserve all ties as separate records or award assignments.

Use a temporary JSON array of the expected records with the helper when useful:

```bash
node .agents/skills/update-award-results/scripts/check-award-year.mjs \
  --repo . --award nebula --year 2025 --expected /path/to/expected.json
```

`UPDATE_NEEDED` may propose `ADD_RECORD` or `MERGE_AWARD`. `NEEDS_REVIEW` means the official set and catalogue disagree in a way that must not be auto-deleted or silently replaced.

## Apply and verify

1. Edit only the canonical data and documentation genuinely affected by the result.
2. Do not update public year ranges, catalogue-count snapshots, sitemap dates, or descriptions; they are deliberately evergreen or data-derived.
3. Run:

   ```bash
   npm test
   npm run validate
   npm run build
   ```

4. Do not run `npm run check:links` unless the user explicitly requests the live external-link sweep.
5. Re-run the status helper with the verified expected records. Require `UP_TO_DATE`.
6. Inspect the final diff for accidental edits and duplicate award assignments.

## Report and stop

Report exactly one status:

- `UP_TO_DATE`: the official result and catalogue match; no edit was needed.
- `NO_OFFICIAL_RESULT`: the official winner is not yet published.
- `UPDATE_READY`: the verified update and checks succeeded; human review remains.
- `NEEDS_REVIEW`: official sources conflict, metadata is ambiguous, or catalogue records disagree unexpectedly.
- `BLOCKED`: required official pages or repository checks could not be accessed.

List the official sources, changed records, reading-link status, and verification commands. Do not commit, push, deploy, open a pull request, or create/update a schedule unless the user separately asks.
