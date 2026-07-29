# SciFi Short Story Collection

A dependency-free static catalogue of Hugo and Nebula Best Short Story winners for award years
2001 through 2025. The data contains 46 unique entries and preserves the 2010 Nebula tie.

## Run locally

The catalogue uses `fetch`, so serve the directory instead of opening `index.html` directly:

```bash
python3 -m http.server 4173
```

Open <http://localhost:4173>.

## Checks

```bash
npm test
npm run validate
npm run check:links
```

`check:links` makes live requests to external story and award pages. A remote site may occasionally block automated requests even when a link works in a browser.

## Before deployment

Set `correctionsEmail` in `data/site.json` to a real monitored address. Data validation accepts `null` for local and deployment-ready builds, but a public release should not ship without a corrections channel.

The site is plain HTML, CSS, JavaScript, and JSON and can be hosted by any static file host.

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

Each award keeps its own year and official source. Different stories may share an award and year when the official result is a tie. `no-award` records remain award-specific and are not merged with stories or other awards.
