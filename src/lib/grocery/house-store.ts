import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  generateApiKey,
  nid,
  seedCameras,
  seedFridges,
  tickFridge,
  type CameraDevice,
  type FridgeDevice,
  type HouseEvent,
} from "./house";

type HouseState = {
  apiKey: string;
  ensureKey: () => string;
  revealKey: boolean;
  setRevealKey: (v: boolean) => void;
  rotateKey: () => string;
  fridges: FridgeDevice[];
  cameras: CameraDevice[];
  events: HouseEvent[];
  setSetpoint: (id: string, setpointF: number) => void;
  toggleDoor: (id: string) => void;
  tick: () => void;
  pairFridge: (id: string) => void;
  pairBluetooth: (device: {
    id: string;
    name: string;
    brand: string;
    zone: FridgeDevice["zone"];
    setpointF: number;
  }) => void;
  pairCamera: (id: string) => void;
  addCamera: (name: string, place: CameraDevice["place"]) => void;
  setCameraFrame: (id: string, frame: string) => void;
  applyRemote: (patch: { fridges?: FridgeDevice[]; cameras?: CameraDevice[] }) => void;
  logEvent: (text: string) => void;
};

function note(text: string): HouseEvent {
  return { id: nid("ev"), at: new Date().toISOString(), text };
}

export const useHouseStore = create<HouseState>()(
  persist(
    (set, get) => ({
      apiKey: "",
      ensureKey: () => {
        if (get().apiKey) return get().apiKey;
        const apiKey = generateApiKey();
        set({
          apiKey,
          events: [note("Issued a house key."), ...get().events].slice(0, 20),
        });
        return apiKey;
      },
      revealKey: false,
      setRevealKey: (v) => set({ revealKey: v }),
      rotateKey: () => {
        const apiKey = generateApiKey();
        set({
          apiKey,
          revealKey: true,
          events: [note("Rotated the house key. Old key is dead."), ...get().events].slice(0, 20),
        });
        return apiKey;
      },
      fridges: seedFridges(),
      cameras: seedCameras(),
      events: [
        note("Kitchen fridge paired on the house key."),
        note("Fridge camera sent a still."),
      ],
      setSetpoint: (id, setpointF) => {
        set({
          fridges: get().fridges.map((f) => (f.id === id ? { ...f, setpointF } : f)),
          events: [note(`Set ${id} to ${setpointF}°F.`), ...get().events].slice(0, 20),
        });
      },
      toggleDoor: (id) => {
        const f = get().fridges.find((x) => x.id === id);
        const open = !f?.doorOpen;
        set({
          fridges: get().fridges.map((x) => (x.id === id ? { ...x, doorOpen: open } : x)),
          events: [note(`${f?.name ?? id} door ${open ? "opened" : "closed"}.`), ...get().events].slice(
            0,
            20,
          ),
        });
      },
      tick: () => {
        set({ fridges: get().fridges.map(tickFridge) });
      },
      pairFridge: (id) => {
        set({
          fridges: get().fridges.map((f) => (f.id === id ? { ...f, paired: true } : f)),
          events: [note(`Paired ${id}.`), ...get().events].slice(0, 20),
        });
      },
      pairBluetooth: (device) => {
        const existing = get().fridges.find((f) => f.id === device.id);
        const next: FridgeDevice = existing
          ? {
              ...existing,
              paired: true,
              link: "bluetooth",
              brand: device.brand,
              bleName: device.name,
              name: `${device.brand} ${device.name}`,
            }
          : {
              id: device.id,
              name: `${device.brand} ${device.name}`,
              zone: device.zone,
              paired: true,
              currentF: device.setpointF + 0.4,
              setpointF: device.setpointF,
              minF: device.zone === "freezer" ? -10 : 33,
              maxF: device.zone === "freezer" ? 10 : 42,
              doorOpen: false,
              link: "bluetooth",
              brand: device.brand,
              bleName: device.name,
            };
        set({
          fridges: existing
            ? get().fridges.map((f) => (f.id === device.id ? next : f))
            : [...get().fridges, next],
          events: [note(`Bluetooth paired ${device.brand} ${device.name}.`), ...get().events].slice(0, 20),
        });
      },
      pairCamera: (id) => {
        set({
          cameras: get().cameras.map((c) =>
            c.id === id ? { ...c, paired: true, lastSeen: new Date().toISOString() } : c,
          ),
          events: [note(`Paired camera ${id}.`), ...get().events].slice(0, 20),
        });
      },
      addCamera: (name, place) => {
        const cam: CameraDevice = {
          id: nid("cam"),
          name,
          paired: true,
          place,
          lastSeen: new Date().toISOString(),
        };
        set({
          cameras: [...get().cameras, cam],
          events: [note(`Added ${name}.`), ...get().events].slice(0, 20),
        });
      },
      setCameraFrame: (id, frame) => {
        set({
          cameras: get().cameras.map((c) =>
            c.id === id
              ? { ...c, lastFrame: frame, lastSeen: new Date().toISOString(), paired: true }
              : c,
          ),
          events: [note("Camera sent a still."), ...get().events].slice(0, 20),
        });
      },
      applyRemote: (patch) => {
        set({
          fridges: patch.fridges ?? get().fridges,
          cameras: patch.cameras ?? get().cameras,
        });
      },
      logEvent: (text) => {
        set({ events: [note(text), ...get().events].slice(0, 20) });
      },
    }),
    {
      name: "aisle-house-v1",
      skipHydration: true,
      partialize: (s) => ({
        apiKey: s.apiKey,
        fridges: s.fridges,
        cameras: s.cameras,
        events: s.events,
      }),
    },
  ),
);

export function rehydrateHouse(): void {
  void useHouseStore.persist.rehydrate();
}
