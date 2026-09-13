export type FridgeZone = "fridge" | "freezer";
export type FridgeLink = "virtual" | "bluetooth" | "wifi" | "api";

export type FridgeDevice = {
  id: string;
  name: string;
  zone: FridgeZone;
  paired: boolean;
  currentF: number;
  setpointF: number;
  minF: number;
  maxF: number;
  doorOpen: boolean;
  filterDueOn?: string;
  link?: FridgeLink;
  brand?: string;
  bleName?: string;
};

export type CameraDevice = {
  id: string;
  name: string;
  paired: boolean;
  place: "fridge" | "pantry" | "door" | "counter";
  lastFrame?: string;
  lastSeen?: string;
};

export type HouseEvent = {
  id: string;
  at: string;
  text: string;
};

export const FRIDGE_SAFE_MAX = 40;
export const FREEZER_SAFE_MAX = 5;

export const BLE_NEARBY = [
  {
    id: "ble-samsung",
    name: "Bespoke 4-Door",
    brand: "Samsung",
    zone: "fridge" as const,
    setpointF: 37,
  },
  {
    id: "ble-lg",
    name: "InstaView ThinQ",
    brand: "LG",
    zone: "fridge" as const,
    setpointF: 36,
  },
  {
    id: "ble-ge",
    name: "Profile Smart",
    brand: "GE",
    zone: "fridge" as const,
    setpointF: 37,
  },
  {
    id: "ble-govee",
    name: "Fridge thermometer",
    brand: "Govee BLE",
    zone: "fridge" as const,
    setpointF: 38,
  },
];

export function generateApiKey(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return `ask_${[...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

export function maskKey(key: string): string {
  if (key.length < 8) return "ask_••••";
  return `${key.slice(0, 7)}••••${key.slice(-4)}`;
}

export function seedFridges(): FridgeDevice[] {
  return [
    {
      id: "kitchen-fridge",
      name: "Kitchen fridge",
      zone: "fridge",
      paired: true,
      currentF: 37.2,
      setpointF: 37,
      minF: 33,
      maxF: 42,
      doorOpen: false,
      filterDueOn: "2026-11-01",
      link: "virtual",
    },
    {
      id: "kitchen-freezer",
      name: "Freezer drawer",
      zone: "freezer",
      paired: true,
      currentF: 1.4,
      setpointF: 0,
      minF: -10,
      maxF: 10,
      doorOpen: false,
      link: "virtual",
    },
  ];
}

export function seedCameras(): CameraDevice[] {
  return [
    {
      id: "cam-fridge",
      name: "Fridge camera",
      paired: true,
      place: "fridge",
      lastFrame: "/samples/fridge.jpg",
      lastSeen: new Date().toISOString(),
    },
    {
      id: "cam-pantry",
      name: "Pantry camera",
      paired: true,
      place: "pantry",
      lastFrame: "/samples/pantry.jpg",
      lastSeen: new Date().toISOString(),
    },
    {
      id: "cam-door",
      name: "Kitchen doorway",
      paired: false,
      place: "door",
    },
  ];
}

export function fridgeStatus(f: FridgeDevice): "ok" | "warm" | "hot" | "door" {
  if (f.doorOpen) return "door";
  const cap = f.zone === "freezer" ? FREEZER_SAFE_MAX : FRIDGE_SAFE_MAX;
  if (f.currentF > cap + 4) return "hot";
  if (f.currentF > cap) return "warm";
  return "ok";
}

export function tickFridge(f: FridgeDevice): FridgeDevice {
  const drift = f.doorOpen ? 0.55 : (f.setpointF - f.currentF) * 0.18;
  const noise = (Math.random() - 0.5) * 0.08;
  const next = Math.round((f.currentF + drift + noise) * 10) / 10;
  const clamped = Math.min(f.maxF + 8, Math.max(f.minF - 4, next));
  return { ...f, currentF: clamped };
}

export function nid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
