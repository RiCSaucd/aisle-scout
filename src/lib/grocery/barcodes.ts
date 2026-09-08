import { CATALOG, PRODUCT_MAP, type CatalogItem } from "./catalog";
import { hashId } from "./pricing";

const L = [
  "0001101",
  "0011001",
  "0010011",
  "0111101",
  "0100011",
  "0110001",
  "0101111",
  "0111011",
  "0110111",
  "0001011",
];
const G = [
  "0100111",
  "0110011",
  "0011011",
  "0100001",
  "0011101",
  "0111001",
  "0000101",
  "0010001",
  "0001001",
  "0010111",
];
const R = [
  "1110010",
  "1100110",
  "1101100",
  "1000010",
  "1011100",
  "1001110",
  "1010000",
  "1000100",
  "1001000",
  "1110100",
];
const PARITY = [
  "AAAAAA",
  "AABABB",
  "AABBAB",
  "AABBBA",
  "ABAABB",
  "ABBAAB",
  "ABBBAA",
  "ABABAB",
  "ABABBA",
  "ABBABA",
];

export function eanChecksum(body12: string): string {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const d = Number(body12[i]);
    sum += i % 2 === 0 ? d : d * 3;
  }
  return String((10 - (sum % 10)) % 10);
}

export function upcFor(productId: string): string {
  const n = hashId(productId).toString().padStart(10, "0").slice(-10);
  const body = `20${n}`;
  return body + eanChecksum(body);
}

export function eanPattern(code: string): string {
  const digits = code.split("").map(Number);
  const first = digits[0] ?? 0;
  const parity = PARITY[first] ?? PARITY[0]!;
  let bits = "101";
  for (let i = 0; i < 6; i++) {
    const d = digits[i + 1] ?? 0;
    bits += (parity[i] === "A" ? L : G)[d]!;
  }
  bits += "01010";
  for (let i = 7; i < 13; i++) {
    bits += R[digits[i] ?? 0]!;
  }
  bits += "101";
  return bits;
}

export function normalizeUpc(raw: string): string {
  return raw.replace(/\D/g, "");
}

const BY_UPC: Record<string, string> = {};
for (const p of CATALOG) {
  const upc = upcFor(p.id);
  BY_UPC[upc] = p.id;
  BY_UPC[upc.slice(1)] = p.id;
}

export function lookupUpc(raw: string): CatalogItem | null {
  const digits = normalizeUpc(raw);
  if (!digits) return null;
  if (BY_UPC[digits]) return PRODUCT_MAP[BY_UPC[digits]] ?? null;
  if (digits.length === 12 && BY_UPC[`0${digits}`]) {
    return PRODUCT_MAP[BY_UPC[`0${digits}`]] ?? null;
  }
  if (digits.length === 13 && BY_UPC[digits.slice(1)]) {
    return PRODUCT_MAP[BY_UPC[digits.slice(1)]] ?? null;
  }
  if (digits.length >= 4 && digits.length <= 8) {
    const hits = CATALOG.filter((p) => upcFor(p.id).endsWith(digits));
    if (hits.length === 1) return hits[0]!;
  }
  return null;
}

export const SAMPLE_IDS = [
  "strawberries",
  "bananas",
  "eggs",
  "whole-milk",
  "chicken-breast",
  "shampoo",
  "toothpaste",
  "beer-12",
  "coffee",
  "paper-towels",
  "chips",
  "vodka-175",
] as const;

export const SAMPLE_PRODUCTS: CatalogItem[] = SAMPLE_IDS.map(
  (id) => PRODUCT_MAP[id],
).filter((p): p is CatalogItem => !!p);
