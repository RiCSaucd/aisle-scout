const PHOTOS: Record<string, string> = {
  strawberries: "/products/strawberries.jpg",
  bananas: "/products/bananas.jpg",
  avocados: "/products/avocados.jpg",
  eggs: "/products/eggs.jpg",
  "chicken-breast": "/products/chicken-breast.jpg",
  "whole-milk": "/products/whole-milk.jpg",
  shampoo: "/products/shampoo.jpg",
  "beer-12": "/products/beer-12.jpg",
};

export function photoFor(productId: string): string | undefined {
  if (PHOTOS[productId]) return PHOTOS[productId];
  const base = productId.replace(/-organic$/, "").replace(/-farm$/, "");
  return PHOTOS[base];
}
