import type { CameraDevice, FridgeDevice } from "./house";

export type HouseSnapshot = {
  fridges: FridgeDevice[];
  cameras: CameraDevice[];
  updatedAt: string;
};

const rooms = new Map<string, HouseSnapshot>();

export function registerHouseKey(key: string, snapshot?: HouseSnapshot): HouseSnapshot {
  const existing = rooms.get(key);
  const next: HouseSnapshot = snapshot ??
    existing ?? {
      fridges: [],
      cameras: [],
      updatedAt: new Date().toISOString(),
    };
  if (snapshot) next.updatedAt = new Date().toISOString();
  rooms.set(key, next);
  return next;
}

export function readHouse(key: string): HouseSnapshot | null {
  return rooms.get(key) ?? null;
}

export function writeHouse(key: string, snapshot: HouseSnapshot): HouseSnapshot {
  const next = { ...snapshot, updatedAt: new Date().toISOString() };
  rooms.set(key, next);
  return next;
}

export function bearerKey(request: Request): string | null {
  const header = request.headers.get("authorization") ?? "";
  const m = header.match(/^Bearer\s+(ask_[a-f0-9]{32})$/i);
  if (m?.[1]) return m[1];
  const q = new URL(request.url).searchParams.get("key");
  if (q && /^ask_[a-f0-9]{32}$/i.test(q)) return q;
  return null;
}

export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
