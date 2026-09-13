# Aisle Scout

Grocery price book for **32080 St. Augustine Beach**. Compare Aldi, Walmart, Target, Publix, Winn-Dixie, CVS, Walgreens, dollar stores, ABC, clubs, and local farms — then shop, scan, stock the fridge, or ship it.

## What’s in it

- **Price book** with BOGOs, Circle deals, rollbacks, and coupons
- **List blender** — paste a list, fuzzy-match the book, trip-plan the cheapest stops
- **Scanner** — UPC or camera, log the shelf tag, put the item in the fridge or cabinet
- **Pantry** — snap the fridge, expiry watch, cook from what you have
- **USDA Organic** floor plus St. Augustine farms and markets
- **Ship it** — Walmart+, Instacart, Shipt, Sam’s vs driving
- **House** — Bluetooth / house-key fridge temperature

Built for zip **32080**. Other zips get their own book when someone uses Aisle Scout there.

## Stack

TanStack Start, React, Tailwind, Zustand. Prices live in the local book; pantry and list persist in the browser.

## Run it

```bash
npm install
npm run dev
```

Shelf photos use `XAI_API_KEY` on the server when you want live vision. Without it, sample fridge and pantry stills still work.

## License

Private project unless you add one.
