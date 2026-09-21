# Aisle Scout business plan

**How this app makes money: local retail media, four steps, no van.**

Confidential operating plan for the founder and investors. Not legal, tax, or securities advice. Figures for ZIP **32080** and St. Johns County use Census / ACS, county economic-development, and 2026 retail-media benchmarks. Revenue tables are **targets**, not booked sales.

Live product: [aisle-scout.netlify.app](https://aisle-scout.netlify.app)  
Code: [github.com/RiCSaucd/aisle-scout](https://github.com/RiCSaucd/aisle-scout)

---

## 1. One-sentence thesis

Aisle Scout is the **in-aisle price book** for St. Augustine Beach. Shoppers scan the tag. That price beats Walmart.com. **Advertisers who cannot buy Instacart or Walmart Connect** — farms, ABC Fine Wine, dollar stores, then regional CPG — pay to stand next to that trusted moment.

We do **not** take a cut of groceries. We do **not** run a subscription. We sell **attention at the list and in the aisle**, in one zip, then the next.

---

## 2. Why ads, not delivery or subscriptions

Instacart’s FY2025 advertising was about **$1.065B**. US retail media is on the order of **$55–71B in 2026**. Grocery **delivery** eats roughly $16 of pick + last-mile on a $100 basket against 1–3% store margin. That is why Aisle Scout will never own a van.

Subscriptions fight Flipp (free flyers), GroceryChop (free comparison), and Ibotta (cash back). A $5/month grocery app in a $92k-income beach zip still loses to “I’ll just open Publix.” Ads that **help a farm sell Saturday strawberries** do not ask the shopper to pay.

The money that actually exists next to our product:

| Buyer | Why they cannot use Instacart Ads | What they buy from us |
| --- | --- | --- |
| Pier / Amp / Sunday market stalls | No SKU feed, no national media team | Featured stall, “this week at the Amp,” Saturday push |
| ABC Fine Wine (A1A) | Category ads on Instacart go to national brands | “Cheapest 12-pack in 32080” slot, weekend list |
| Dollar General / Dollar Tree | Weak on Instacart; strong for soap, spices, kids snacks | Household-aisle takeover |
| Local CPG (salsa, coffee, beer, honey) | $15 Instacart display CPM floor + agency | Sponsored product on the list when the shopper already needs salsa |
| Later: regional CPG | Want incrementality in a rich county | Geo-fenced 32080 + 32084 placements with scan proof |

Instacart’s published **display/video floor is about $15 CPM**. Walmart Connect grocery CTR is cited ~0.6–0.8%. We cannot match their scale. We can match **intent**: the shopper already opened milk, strawberries, or beer.

---

## 3. The market we actually live in

### 3.1 ZIP 32080 (the wedge)

| Fact | Figure | Source / note |
| --- | --- | --- |
| People | ~21,000–22,000 | Census / ACS for 32080 |
| Households | ~10,600 | Census DHC |
| Persons / household | ~2.05 | Small, older, beach |
| Median household income | ~$92,000 | ACS |
| Typical home | ~$541,000 | 2026 ZHVI-style |
| City of St. Augustine Beach | ~6,860 people, 3,133 HH, median age 55.7 | Place-level Census |

Food-at-home spend in a 2-person Florida household is on the order of **$6,500–8,500 / year**. Conservative 32080 grocery **TAM ≈ $70–90M / year**. We do not need a percent of that. We need to sit in front of the **10,600 households** and the **2.8 million county visitors** who buy milk, beer, and farm produce while they are here.

### 3.2 St. Johns County (the year-2 canvas)

| Fact | Figure |
| --- | --- |
| Population | ~335k (2024 Census est.) → ~346k (2025) → ~359k (2026 unofficial) |
| Households | ~109k–116k |
| Median household income | ~$106k–$110k |
| Retail sales (2022) | **$5.42B** ($17.6k per capita) |
| Visitors (CY 2025) | **2.79 million**, **$1.59B** direct spend |
| Growth | Among the fastest large Florida counties; income in-migration |

32084 (St. Augustine / Vilano / some mainland) and Nocatee / 32081 are the natural second and third books. Ponte Vedra is richer and later — more CPG, more ABC, more farms that already drive to the Amp.

### 3.3 Stores already in the book

Publix Anastasia Plaza, Winn-Dixie, Aldi, Walmart #579, Target, CVS, Walgreens, Dollar General, Dollar Tree, ABC, c-stores, Costco/Sam’s (far/bulk), plus farms and markets: **Pier, Amphitheatre, Sunday market, Schooner, Bee Hill, Wesley, County Line, Springs**.

Year-1 ad inventory is **not** Publix or Walmart (they have their own networks). Year-1 inventory is everyone those networks ignore.

---

## 4. Product moat (what we sell)

The thing advertisers buy is not a banner. It is **proof we are in the aisle**.

1. Shopper scans a shelf tag or UPC.  
2. That log is stored as a **shelf log**.  
3. Live Walmart I/O / website quotes are **discarded** for that SKU + store if a shelf log exists.  
4. The list, trip plan, and “who wins this week” use the tag.

That is the technical story for the patent attorney. For a farm stall it means: “When someone in 32080 needs strawberries, we can put your Saturday crate next to the Publix BOGO and the Walmart rollback, **with a price a human typed under fluorescent lights**.”

Instacart list-push stays a **button**, not the business. If we become “open Instacart,” we lose the book and we lose the ad slot.

---

## 5. The four steps

### Step 1 — 32080 density (months 0–6)

**Goal:** Become the only price book that is true on A1A Beach Blvd.

| KPI | Month 3 | Month 6 |
| --- | --- | --- |
| Weekly active shoppers (WAU) | 250 | 1,000 |
| Scanned / keyed shelf tags | 1,500 | 10,000 |
| SKUs with a 32080 tag this week | 80 | 250 |
| Farm stalls with a live price | 4 | 12 |
| Organic-toggle users | 40 | 150 |

**How density is built (not scraped):**

- Founder + one contractor walk Aldi, Publix, Walmart 579, ABC, Dollar General **twice a week**. Phone scanner, 20 minutes a store.  
- Saturday Amp + Wednesday Pier: log stall prices in public. That is both content and inventory.  
- Shopper scans earn a “Scout” streak (no cash, no points that look like Ibotta). Status, not subsidy.  
- Never ingest a website HTML table. Deep links and official APIs only. Tags always win.

**Why this is the business:** A local sponsor will not pay until the book is **embarrassingly specific** — “County Line eggs $6, Pier tomatoes $3.50, Publix BOGO berries.” Generic “groceries near you” is GroceryChop. Density is unsellable by a national network.

**Spend this step:** time and gas, not Super Bowl ads. Meta/X geo-fenced to 32080 only, **$40–80/day**, creative is a photo of a real tag.

### Step 2 — Pre-seed $150–250k (close by month 4)

**Use of a $200k round (midpoint):**

| Line | $ | What it buys |
| --- | --- | --- |
| IP (provisional + “Aisle Scout” trademark 9 + 35) | 20,000 | Filing date, name |
| Brand, photo, App Store / Play listing | 40,000 | Looks like a store, not a prototype |
| St. Johns ads (32080 + 32084) | 50,000 | Density, not brand vanity |
| Founder draw + 1 contractor (prices, farms, support) | 70,000 | 12 months of walking aisles |
| Legal, Apple $99, Play $25, hosting, Walmart/Instacart keys | 20,000 | Stay legal and live |

**Milestones the check is bought against:**

- 1,000 WAU in St. Johns  
- 10,000 scanned tags  
- 8 paying local sponsors (even if small)  
- Walmart I/O + Instacart keys live  
- Second zip **book** started (32084), not launched as a campaign  

We raise to **buy density and a name**, not a national sales team.

### Step 3 — Year-1 revenue = local retail media

**No subscriptions.** Four ad products, sold on a rate card a farm can understand.

#### Product A — Featured stall (farms & markets)

| | |
| --- | --- |
| Who | Pier, Amp, Sunday, Bee Hill, County Line, Wesley, Schooner, Springs |
| Unit | One stall, one week, on Home + Farms + list if the SKU matches |
| Price | **$150–400 / week** (Amp Saturday at the high end; midweek Pier lower) |
| Analog | Market stall is **$42–$55 / day** at St. Johns Opportunity market. We are cheaper than a second booth, more targeted than a Record print ad. |

12 stalls × 20 paid weeks × $250 average ≈ **$60k** if we sold the whole book. Year-1 target is **30% of that: $18k**.

#### Product B — Aisle takeover (ABC, dollar, c-store)

| | |
| --- | --- |
| Who | ABC Fine Wine; Dollar General; Dollar Tree; beach c-stores |
| Unit | Category lock: beer, wine, soap, spices, snacks — 4 weeks |
| Price | **$400–900 / month** |
| Why they pay | They lose the “full grocery” trip to Publix. We insert them on **shampoo, salsa, 12-pack** when Publix is not the win. |

3 advertisers × $600 × 8 months ≈ **$14.4k** year-1 target.

#### Product C — List native (local CPG)

What a **St. Johns maker** (honey, salsa, coffee, bakery, beer, kombucha) already pays elsewhere, 2026:

| Channel | What they pay | What they get |
| --- | --- | --- |
| Meta / IG geo to 32080 | **$8–15 CPM**, **$0.50–$3 CPC**, typical **$300–1,500 / mo** | Reach, weak grocery attribution |
| Jacksonville Google (blended) | ~**$0.70 CPC** DMA average | Search, not the aisle |
| JAX / St. Johns Town Center / Nocatee DOOH | **$8–25 CPM**; **$2.5k–$12k / mo** per unit | Awareness, not a list |
| Grocery in-store screens (network floor) | ~**$0.66–$1.20 CPM** | Cheap wallpaper |
| Instacart display / video | **~$15 CPM floor**; ~$0.72 CPC cited | Most locals never clear the feed |
| Amp / Pier stall | **$42–$55 / day**; Saturday sales often **$500–$2,000** | They already buy this |
| Local foodie / newsletter analog | **$350–$500 / mo** ROS or newsletter | City-level, not SKU-level |
| Regional craft (beer magazine ¼ page) | **~$700** per insert | Drinkers, not 32080 shoppers |

**What they can actually write a check for**

- Stall / cottage brand (~$80–250k sales): **$200–500 / month** is 3–5% of a slow month. Ceiling, not opener.
- Coffee / bakery with a shop: **$300–1,500 / month** already on Meta. Aisle Scout is a **slice**, not a replacement.
- ABC-distributed beer / regional salsa: **$1,500–5,000 / month** media is normal; **$800–1,500** for a 32080 geo test is a rounding error next to Publix slotting.

**Aisle Scout rate card (sell weeks until 1,000 WAU)**

| Unit | Open | Target once 1k WAU | Do not exceed |
| --- | --- | --- | --- |
| List native (row when the list already has salsa / beer / coffee) | **$350–600 / mo** | **$8–12 CPM** | Instacart’s **~$15 CPM** until we are two zips |
| Home “local makers” tile | **$250–400 / mo** | same CPM | Never covers a scanned price |
| Saturday Amp/Pier push add-on | **$150–250** | — | One per week |
| 4-week launch pack (tile + native + one push) | **$900–1,200** | — | First invoice a maker will actually pay |
| Regional Florida CPG (year 2) | — | **$12–18 CPM** or **$1,000–2,500 / mo** geo | Agency RFP |

Year-1 target stays **2 brands × ~$500 × 6 months ≈ $6k**. The rate card is the asset; volume comes after density. Rule unchanged: **a scanned shelf price is never replaced by a sponsored price.**


#### Product D — Saturday push (owned audience)

Plain text / in-app: “Amp 8:30. Strawberries $4. Bee Hill eggs.” No spam list until we have permission. Sold as a **$200 add-on** to Product A.

**Year-1 ad revenue target: $35–55k.** That does not pay back the round. It **proves a rate card**. Gross margin on these units is 85%+ (no print, no screens). The constraint is sales time, not COGS.

**What we refuse in year 1:** national CPG agency RFPs, grocery-chain co-op that wants us to scrape competitors, anything that puts a logo over a **shelf price we did not scan**.

### Step 4 — Year-2: second zip + Instacart as a feature

**Second book: 32084** (city / Vilano / mainland Publix and Aldi). Same scanner ritual. Same rule: tags win.

Instacart **products_link** is the escape hatch for people who will not drive. It is labeled “Send to Instacart,” not “Shop Aisle Scout delivery.” We do **not** take Instacart’s order fee. We keep the **ad slot on our list** before they leave.

| KPI | End of year 2 |
| --- | --- |
| Zips with a living book | 2 (32080 + 32084); 32081/Nocatee in beta |
| WAU | 4,000–6,000 |
| Paying sponsors | 25–40 |
| First regional CPG | 2–4 (Florida salsa, beer, dairy) |
| Ad revenue | **$180–280k** |

Year-2 mix:

- Local sponsors still ~50% of revenue (farms + ABC + dollar).  
- Regional CPG ~35% (native list + geo 32080/084).  
- Programmatic leftover ~15% only if it does not sit on top of a scanned tag.

**County path (year 3, not this raise):** 109k households, visitor overlay, then the story looks like a **tiny Flipp + tiny retail media network** for independents. That is when a seed round for a Florida sales hire makes sense. Not before.

---

## 6. Unit economics (how a dollar of ads is made)

Until 1,000 WAU, **do not sell CPM**. Sell **weeks**.

| WAU | Sessions / month (2.5× / week) | Native slots / session | Impressions / month | Revenue at $15 CPM | Better: 10 sponsors × $400 |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 250 | 2,500 | 2 | 5,000 | $75 | $4,000 |
| 1,000 | 10,000 | 3 | 30,000 | $450 | $4,000 |
| 5,000 | 50,000 | 4 | 200,000 | $3,000 | $8,000 + CPG |

Lesson: **sponsors beat CPM until we are a county.** The $15 Instacart floor is a **year-2 ceiling we grow into**, not year-1 pricing.

Fill rate cap: **one paid unit per screen**. Shopper trust dies if the book looks like a circular. House rule: **scanned price is never replaced by a sponsored price.** The ad is *next to* the winner, or “also at the Amp Saturday.”

---

## 7. Go-to-market (St. Johns only)

**Shoppers**

- Geo ads: 32080, then 32084. Creative = a real tag photo, not stock fruit.  
- Farmers market table: Saturday Amp, Wednesday Pier. QR to Add to Home Screen.  
- HOA / condo boards on Anastasia Island (older, high grocery spend per person).  
- Visitors: “in town for the weekend” list blender — high ABC and farm intent, low loyalty. County had **2.79M visitors in 2025**.

**Advertisers (founder sells, no agency)**

1. Walk the stall. Show the Farms screen with **their** name. Ask for $200 this Saturday.  
2. ABC manager on A1A: 12-pack comparison vs Publix Liquors vs Walmart. Four-week takeover.  
3. Dollar General: soap, spices, kids snacks vs Publix.  
4. Only then: a Jacksonville CPG broker with one Florida SKU.

Script: *“Instacart wants a feed and $15 CPM. We have people who already opened strawberries in 32080. Two hundred dollars. Saturday.”*

---

## 8. Two-year picture (targets)

Assumes the $200k raise lands by month 4. Cash is not a forecast of profit in year 1.

| | Year 1 | Year 2 |
| --- | --- | --- |
| WAU (Q4) | 1,000 | 5,000 |
| Zips | 1 | 2 |
| Ad revenue | $40k | $220k |
| Other revenue | $0 | $0 (still no sub, no delivery take) |
| OpEx (ex-founder if unpaid extra) | ~$180k | ~$240k (same team + light contractor) |
| Result | Prove rate card, burn the round on density | Approach cash-flow light if CPG lands; else raise seed on county |

If year-1 ad revenue is **under $15k** with 1,000 WAU, the rate card is wrong or density is fake — fix before a second zip.

---

## 9. Risks (and the rule that kills them)

| Risk | What we do |
| --- | --- |
| Publix / Walmart copy “your tag vs our app” | We stay the **independent book**. We do not need their permission to log a public shelf. |
| Scrapers undercut us | We do not scrape. Their prices will be wrong in the aisle. That is the demo. |
| Shoppers never scan | Contractor walks the four big stores anyway. User scans are bonus density. |
| Farms will not pay | Then the Farms screen stays as **trust content**. Ads start at ABC/dollar. |
| Instacart becomes the habit | Keep list-push as an exit. Never home-screen it. |
| Patent / name | Provisional + trademark in the raise. Public GitHub already started a US grace period (mid-Sep 2026). |
| “Make it national” | Refuse. Second zip only after 10k tags and 8 sponsors. |

---

## 10. What this company is not

- Not Instacart.  
- Not Flipp.  
- Not Ibotta.  
- Not a coupon clipper.  
- Not a smart-fridge hardware company (House API is a later wedge, not year-1 revenue).  
- Not a subscription.  
- Not a Florida-wide van.

It is a **zip-shaped retail media network** whose inventory is a price book people trust because a human scanned the tag.

---

## 11. Founder checklist (next 90 days)

1. Three USPTO patent-bar consults; file provisional; file “Aisle Scout” trademark.  
2. Walk Aldi, Publix, Walmart 579, ABC, DG twice a week; Amp Saturday; Pier Wednesday.  
3. Sell **one** $200 Saturday stall and **one** $400 ABC month — even if the buyer is a friend. Rate card becomes real.  
4. Keep [aisle-scout.netlify.app](https://aisle-scout.netlify.app) as the live demo in every meeting.  
5. Raise the $150–250k on this document, not on a national TAM slide.

One-pager: [`docs/PITCH.md`](PITCH.md). IP checklist: [`docs/IP.md`](IP.md).
