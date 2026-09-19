# Aisle Scout

Grocery price book for **32080 St. Augustine Beach**. Compare Aldi, Walmart, Target, Publix, Winn-Dixie, CVS, Walgreens, dollar stores, ABC, clubs, and local farms — then shop, scan, stock the fridge, or ship it.

**Source:** [github.com/RiCSaucd/aisle-scout](https://github.com/RiCSaucd/aisle-scout) (public, all rights reserved).  
**Live web:** Grok preview in this chat. Vercel is ready to host as soon as the team billing card is valid ([Vercel billing](https://vercel.com/teams/hatcheric950-8386s-projects/settings/billing)). Do not overwrite the existing Netlify site (`nexus-lead-desk`).

## What’s in it

- **Price book** with BOGOs, Circle deals, rollbacks, and coupons
- **List blender** — paste a list, fuzzy-match the book, trip-plan the cheapest stops
- **Scanner** — UPC or camera, log the shelf tag, put the item in the fridge or cabinet
- **Pantry** — snap the fridge, expiry watch, cook from what you have
- **USDA Organic** floor plus St. Augustine farms and markets
- **Ship it** — Walmart+, Instacart, Shipt, Sam’s vs driving
- **Live listings** — home opens Walmart #579, Instacart, Publix, Target, Aldi, Flipp ads, and Shipt for 32080. **Refresh Walmart #579** calls Walmart I/O (RSA-signed product search) when `WALMART_CONSUMER_ID` + `WALMART_PRIVATE_KEY` are set; **Send to Instacart** POSTs `/idp/v1/products/products_link` when `INSTACART_API_KEY` is set. Scanned shelf tags always beat those feeds.

Built for zip **32080**. Other zips get their own book when someone uses Aisle Scout there.

## Patent, brand, funding

Not legal advice. The public repo started a **US 12-month grace period**. File a **provisional** with a patent attorney before you advertise hard. Checklist: [`docs/IP.md`](docs/IP.md). Investor one-pager: [`docs/PITCH.md`](docs/PITCH.md). Do not print “Patent pending” until USPTO gives you a filing receipt.

## Stack

TanStack Start, React, Tailwind, Zustand. Prices live in the local book; pantry and list persist in the browser.

## Run it

```bash
npm install
npm run dev
```

Shelf photos use `XAI_API_KEY` on the server when you want live vision. Without it, sample fridge and pantry stills still work.

## GitHub Actions

Push to `main` or open a PR and GitHub runs typecheck, tests, a production build, and CodeQL. Tag `v0.1.0` for a Release.

The interesting bits (reusable workflow, composite setup action, concurrency, Dependabot groups, OIDC notes) live in [`.github/workflows/README.md`](.github/workflows/README.md).

## App Store & Google Play

Capacitor wraps this same app (`com.aislescout.app`). Privacy policy is `/legal`. Step-by-step for Xcode and Android Studio is in [`store/README.md`](store/README.md). Apple ($99/yr) and Google Play ($25) developer accounts are still required to list.

## License

All rights reserved. See [`LICENSE`](LICENSE). Public on GitHub is not permission to clone the product.
