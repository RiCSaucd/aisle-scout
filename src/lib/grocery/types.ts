export const STORE_IDS = [
  "aldi",
  "walmart",
  "target",
  "publix",
  "winndixie",
  "cvs",
  "walgreens",
  "dollargeneral",
  "dollartree",
  "abc",
  "cstore",
  "costco",
  "sams",
] as const;
export type StoreId = (typeof STORE_IDS)[number];

export const STORE_KINDS = [
  "grocery",
  "pharmacy",
  "dollar",
  "liquor",
  "convenience",
  "club",
] as const;
export type StoreKind = (typeof STORE_KINDS)[number];

export const CATEGORIES = [
  "produce",
  "dairy",
  "meat",
  "bakery",
  "pantry",
  "frozen",
  "beverages",
  "household",
  "personal",
  "alcohol",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const LOCATIONS = ["fridge", "freezer", "pantry", "other"] as const;
export type PantryLocation = (typeof LOCATIONS)[number];

export type Unit = "each" | "lb" | "oz" | "gal" | "dozen" | "bunch" | "pack" | "loaf" | "bag";

export type Product = {
  id: string;
  name: string;
  brand?: string;
  category: Category;
  size: string;
  unit: Unit;
};

export type Store = {
  id: StoreId;
  name: string;
  short: string;
  kind: StoreKind;
  tagline: string;
  hours: string;
  miles: number;
  far?: boolean;
  membership?: boolean;
  bulk?: boolean;
  zip: string;
  sells: string;
  locations: { name: string; address: string; city: string; zip: string }[];
};

export type PromotionKind =
  | "bogo"
  | "bogo50"
  | "sale"
  | "coupon"
  | "rollback"
  | "circle"
  | "aldi-finds";

export type Promotion = {
  id: string;
  productId: string;
  storeId: StoreId;
  kind: PromotionKind;
  label: string;
  salePrice?: number;
  couponValue?: number;
  minQty?: number;
  startsOn: string;
  endsOn: string;
  details: string;
  requiresClip?: boolean;
};

export type InventoryItem = {
  id: string;
  productId: string;
  qty: number;
  location: PantryLocation;
  expiresOn?: string;
  lowAt: number;
  notes?: string;
};

export type ListItem = {
  id: string;
  productId: string;
  qty: number;
  preferredStore: StoreId | "cheapest";
  checked: boolean;
  notes?: string;
};

export type PriceLog = {
  id: string;
  productId: string;
  storeId: StoreId;
  price: number;
  observedAt: string;
  note?: string;
};

export type TripStop = {
  storeId: StoreId;
  items: { productId: string; qty: number; cost: number; note: string }[];
  total: number;
};

export type TripPlan = {
  mode: "one-store" | "split" | "two-stop";
  label: string;
  stops: TripStop[];
  total: number;
  receivedExtra: number;
  vsMostExpensive: number;
};

export const MARKET_ZIP = "32080";
export const MARKET_CITY = "St. Augustine Beach";
