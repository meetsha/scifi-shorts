# SciFi Short Story Collection

A dependency-free static catalogue of the Hugo short-fiction lineage from 1955 and Nebula Best
Short Story from 1965, through 2025. The data contains 121 unique entries, preserves the 2010
Nebula tie, and merges stories that won both awards.

The Hugo category was named Short Fiction from 1960 through 1966. No equivalent category was
presented in 1957, so that year is represented by a distinct category-not-presented record.

## Run locally

The catalogue uses `fetch`, so serve the directory instead of opening `index.html` directly:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://localhost:8000>.

The two HTML entry pages stay at the repository root. Browser JavaScript, CSS, and the favicon
live under `assets/`; runtime catalogue files live under `data/`.

## Checks

```bash
npm test
npm run validate
```

Run `npm run check:links` only when a full external-link review is explicitly requested. It makes
live requests to every story and award page, and remote sites may block automated requests even
when a link works in a browser.

## Build

Create a clean static release in the ignored `dist/` directory:

```bash
npm run build
```

The dependency-free build script copies only the two HTML pages, browser assets, and runtime data.
Repository documentation, tests, and maintenance scripts are not included in `dist/`.

## Site configuration

Set `correctionsUrl` in `data/site.json` to a monitored contact page. Data validation accepts `null` for local and deployment-ready builds, but a public release should not ship without a corrections channel.

The site is plain HTML, CSS, JavaScript, and JSON and can be hosted by any static file host.

## Repository structure

- `index.html` and `about.html`: browser entry pages
- `assets/`: browser JavaScript, CSS, and the favicon
- `data/`: runtime catalogue and site configuration
- `scripts/`: dependency-free build and validation tools
- `tests/`: catalogue behavior tests
- `dist/`: generated static release; never edit or commit it

## Catalogue data model

`data/stories.json` stores one record per unique story. Each record has an `awards` array so a story that wins both awards is not duplicated:

```json
{
  "id": "example-story-example-author",
  "resultType": "winner",
  "title": "Example Story",
  "author": "Example Author",
  "publication": "Example Magazine",
  "storyUrl": null,
  "awards": [
    {
      "award": "hugo",
      "year": 2024,
      "sourceUrl": "https://example.com/hugo"
    },
    {
      "award": "nebula",
      "year": 2023,
      "sourceUrl": "https://example.com/nebula"
    }
  ]
}
```

Each award keeps its own year and official source. Different stories may share an award and year
when the official result is a tie. `no-award` and `not-presented` records remain award-specific and
are not merged with stories or other special results.

Award years follow the labels used by each official archive. Hugo pages use the ceremony year;
Nebula pages use SFWA's award-year label, even when the presentation took place the following year.
