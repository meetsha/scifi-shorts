# SciFi Short Story Collection

A dependency-free static catalogue of Hugo Best Short Story results from 2001 through 2025.

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
