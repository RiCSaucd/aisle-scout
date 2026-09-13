# GitHub Actions in this repo

Aisle Scout uses the patterns that matter in 2026: reuse, least privilege, cancel-in-progress, and no long-lived cloud keys.

| File | What it is |
| --- | --- |
| [`ci.yml`](ci.yml) | Caller. Runs on `main`, PRs, and manual dispatch. |
| [`quality.yml`](quality.yml) | **Reusable** (`workflow_call`). Typecheck, tests, production build, artifact. |
| [`security.yml`](security.yml) | CodeQL every week + on PRs. Dependency review on PRs. |
| [`release.yml`](release.yml) | Tag `v1.2.3` or run manually to cut a GitHub Release. |
| [`../actions/setup-aisle`](../actions/setup-aisle/action.yml) | **Composite action**. Node 22 + `npm ci` with cache. |
| [`../dependabot.yml`](../dependabot.yml) | Weekly npm and Actions bumps, grouped so TanStack/Radix don’t spam you. |

## Why these shapes

- **Composite action** = shared *steps* (install Node, cache, `npm ci`). Jobs still decide what to run.
- **Reusable workflow** = shared *pipeline*. `ci.yml` calls `quality.yml` instead of copy-pasting three jobs.
- **Concurrency groups** cancel the previous run on the same branch so you don’t pay for stale pushes.
- **`permissions: contents: read`** by default. Release is the only workflow that writes. CodeQL writes `security-events`.
- **OIDC later** — when you hook Vercel or AWS, use `permissions: id-token: write` and a cloud role. Don’t put a long-lived token in repo secrets.

## How to run them

- Push to `main` or open a PR → CI + CodeQL.
- **Actions → CI → Run workflow** → optional skip of the production build.
- Tag a version: `git tag v0.1.0 && git push origin v0.1.0` → Release.
- Dependabot opens grouped PRs on Mondays.

GitHub will ask you to enable Actions the first time if the org has them off. Public repos get CodeQL and dependency review for free.
