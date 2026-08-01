# Repository workflow

## Local preview

Keep the site running on port `8000` during an active session:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Stop it only when explicitly requested.

## Verification

- Use focused checks for documentation, copy, or styling-only changes.
- Run `npm test` when catalogue behavior changes.
- Run `npm run validate` when catalogue data or site configuration changes.
- Run `npm run build` before a release.
- Run `npm run check:links` only when explicitly requested because it makes live requests to every external catalogue URL.

## Product plan

Before every git commit:

1. Update `PRODUCT_PLAN.md` to reflect current decisions, completed work, remaining work, and local or deployed status.
2. Stage the plan update in the same commit as the related changes.

Do not create a commit while `PRODUCT_PLAN.md` is stale.
