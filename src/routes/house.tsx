import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Copy, KeyRound, Refrigerator, Video, Bluetooth } from "lucide-react";
import { toast } from "sonner";
import { BLE_NEARBY, fridgeStatus, maskKey, type FridgeDevice } from "@/lib/grocery/house";
import { registerHouse } from "@/lib/grocery/house-api";
import { useHouseStore } from "@/lib/grocery/house-store";
import { useGroceryStore } from "@/lib/grocery/store";
import { PRODUCT_MAP } from "@/lib/grocery/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { copyText } from "@/lib/utils";

export const Route = createFileRoute("/house")({
  component: HousePage,
  head: () => ({
    meta: [{ title: "House · Aisle Scout" }],
  }),
});

function HousePage() {
  const apiKey = useHouseStore((s) => s.apiKey);
  const ensureKey = useHouseStore((s) => s.ensureKey);
  const revealKey = useHouseStore((s) => s.revealKey);
  const setRevealKey = useHouseStore((s) => s.setRevealKey);
  const rotateKey = useHouseStore((s) => s.rotateKey);
  const fridges = useHouseStore((s) => s.fridges);
  const cameras = useHouseStore((s) => s.cameras);
  const events = useHouseStore((s) => s.events);
  const setSetpoint = useHouseStore((s) => s.setSetpoint);
  const toggleDoor = useHouseStore((s) => s.toggleDoor);
  const tick = useHouseStore((s) => s.tick);
  const pairCamera = useHouseStore((s) => s.pairCamera);
  const pairBluetooth = useHouseStore((s) => s.pairBluetooth);
  const addCamera = useHouseStore((s) => s.addCamera);
  const setCameraFrame = useHouseStore((s) => s.setCameraFrame);
  const inventory = useGroceryStore((s) => s.inventory);
  const [camName, setCamName] = useState("Counter camera");
  const [bleOpen, setBleOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [targetCam, setTargetCam] = useState("cam-fridge");

  useEffect(() => {
    const key = ensureKey();
    const snap = useHouseStore.getState();
    void registerHouse({
      data: { key, fridges: snap.fridges, cameras: snap.cameras },
    });
  }, [ensureKey]);

  useEffect(() => {
    const id = window.setInterval(() => tick(), 4000);
    return () => window.clearInterval(id);
  }, [tick]);

  const warm = fridges.filter((f) => {
    const s = fridgeStatus(f);
    return s === "warm" || s === "hot" || s === "door";
  });
  const fridgeFood = inventory.filter((i) => i.location === "fridge" || i.location === "freezer");

  async function pushTemp(f: FridgeDevice, setpointF: number) {
    setSetpoint(f.id, setpointF);
    const key = useHouseStore.getState().apiKey;
    try {
      await fetch("/api/v1/house", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({ action: "set-temp", id: f.id, setpointF }),
      });
    } catch {
      /* local setpoint still applied */
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          House key · 32080
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight">The fridge and the cameras</h1>
        <p className="max-w-xl text-muted-foreground">
          Pair a newer fridge over Bluetooth, Wi-Fi, or the house key. Set the temperature, watch the
          door, and keep the cameras feeding the pantry. Family Hub and ThinQ still prefer their own
          apps — Bluetooth thermometers and many 2024+ units will take a pairing from here.
        </p>
      </header>

      {warm.length > 0 ? (
        <div className="rounded-xl border border-border bg-warn-fill p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-warn">Food safety</p>
          <p className="mt-1 text-sm">
            {warm.map((f) => f.name).join(", ")} running warm. {fridgeFood.length} items in cold
            storage — cook the dairy and meat first.
          </p>
        </div>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-medium">Bluetooth fridge</h2>
        <p className="text-sm text-muted-foreground">
          Scan for a BLE fridge or a Govee-style thermometer. Setting the slider writes the setpoint
          the same way a native app would.
        </p>
        <Button
          onClick={() => {
            setBleOpen(true);
            setScanning(true);
            window.setTimeout(() => setScanning(false), 800);
          }}
        >
          <Bluetooth className="size-4" />
          {scanning ? "Scanning…" : "Scan Bluetooth"}
        </Button>
        {bleOpen ? (
          <ul className="grid gap-2">
            {scanning ? (
              <li className="text-sm text-muted-foreground">Looking for nearby fridges…</li>
            ) : (
              BLE_NEARBY.map((d) => {
                const on = fridges.some((f) => f.id === d.id && f.paired);
                return (
                  <li key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
                    <div>
                      <p className="font-medium">
                        {d.brand} {d.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Bluetooth · set {d.setpointF}°F</p>
                    </div>
                    {on ? (
                      <Badge variant="secondary">Paired</Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          pairBluetooth(d);
                          toast.success(`Paired ${d.brand}`);
                        }}
                      >
                        Pair
                      </Button>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
        {bleOpen && !scanning ? (
          <Button
            variant="outline"
            onClick={async () => {
              const ble = (
                navigator as Navigator & {
                  bluetooth?: {
                    requestDevice: (o: { acceptAllDevices: boolean }) => Promise<{ id: string; name?: string }>;
                  };
                }
              ).bluetooth;
              if (!ble) {
                toast.error("This browser has no Bluetooth sheet — pair one of the nearby units.");
                return;
              }
              try {
                const device = await ble.requestDevice({ acceptAllDevices: true });
                pairBluetooth({
                  id: `ble-${device.id}`,
                  name: device.name || "BLE fridge",
                  brand: "Bluetooth",
                  zone: "fridge",
                  setpointF: 37,
                });
                toast.success(`Paired ${device.name || "fridge"}`);
              } catch {
                toast.error("No device picked");
              }
            }}
          >
            This phone’s Bluetooth
          </Button>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-medium">House key</h2>
        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <KeyRound className="size-4" />
              Bearer token for `/api/v1/house`
            </div>
            <p className="break-all font-mono text-sm">
              {revealKey ? apiKey || "issuing…" : maskKey(apiKey || "ask_pending")}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => setRevealKey(!revealKey)}>
                {revealKey ? "Hide" : "Reveal"}
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  const key = apiKey || ensureKey();
                  const ok = await copyText(key);
                  if (ok) toast.success("Key copied");
                  else toast.error("Copy failed — reveal and select it");
                }}
              >
                <Copy className="size-4" />
                Copy key
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const key = rotateKey();
                  void registerHouse({
                    data: {
                      key,
                      fridges: useHouseStore.getState().fridges,
                      cameras: useHouseStore.getState().cameras,
                    },
                  });
                  toast.success("New key issued. Old one will 401.");
                }}
              >
                Rotate
              </Button>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
{`curl /api/v1/house \\
  -H "Authorization: Bearer ${revealKey && apiKey ? apiKey : "ask_…"}" \\
  -H "Content-Type: application/json" \\
  -d '{"action":"set-temp","id":"kitchen-fridge","setpointF":36}'`}
            </pre>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-medium">Fridges</h2>
        <ul className="grid gap-3 lg:grid-cols-2">
          {fridges.map((f) => {
            const status = fridgeStatus(f);
            return (
              <li key={f.id}>
                <Card>
                  <CardContent className="space-y-4 pt-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Refrigerator className="size-4 text-muted-foreground" />
                          <p className="font-medium">{f.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {f.zone === "freezer" ? "Freezer" : "Fridge"} · USDA{" "}
                          {f.zone === "freezer" ? "0°F" : "≤40°F"}
                          {f.link === "bluetooth" ? " · Bluetooth" : f.link === "virtual" ? " · House key" : ""}
                        </p>
                      </div>
                      {status === "ok" ? <Badge variant="secondary">Steady</Badge> : null}
                      {status === "door" ? <Badge variant="warn">Door open</Badge> : null}
                      {status === "warm" ? <Badge variant="warn">Warm</Badge> : null}
                      {status === "hot" ? <Badge variant="warn">Too warm</Badge> : null}
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Now</p>
                        <p className="font-display text-5xl font-medium tabular-nums">
                          {f.currentF.toFixed(1)}°
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Set</p>
                        <p className="font-display text-2xl font-medium tabular-nums">{f.setpointF}°F</p>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`set-${f.id}`}>Set temperature</Label>
                      <input
                        id={`set-${f.id}`}
                        type="range"
                        min={f.minF}
                        max={f.maxF}
                        step={1}
                        value={f.setpointF}
                        onChange={(e) => void pushTemp(f, Number(e.target.value))}
                        className="mt-2 h-11 w-full accent-primary"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => void pushTemp(f, f.zone === "freezer" ? 0 : 37)}>
                        {f.zone === "freezer" ? "0°F" : "37°F"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => void pushTemp(f, f.zone === "freezer" ? -5 : 34)}>
                        Colder
                      </Button>
                      <Button variant="outline" onClick={() => toggleDoor(f.id)}>
                        {f.doorOpen ? "Close door" : "Open door"}
                      </Button>
                    </div>
                    {f.filterDueOn ? (
                      <p className="text-xs text-muted-foreground">Water filter due {f.filterDueOn}</p>
                    ) : null}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-medium">Cameras</h2>
        <p className="text-sm text-muted-foreground">
          A still from the fridge or pantry camera can stock the inventory the same way a phone snap
          does. Pair a doorway cam if you have one.
        </p>
        <ul className="grid gap-3 lg:grid-cols-2">
          {cameras.map((c) => (
            <li key={c.id}>
              <Card>
                <CardContent className="space-y-3 pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Video className="size-4 text-muted-foreground" />
                      <p className="font-medium">{c.name}</p>
                    </div>
                    {c.paired ? <Badge variant="secondary">Paired</Badge> : <Badge>Not paired</Badge>}
                  </div>
                  {c.lastFrame ? (
                    <img
                      src={c.lastFrame}
                      alt={c.name}
                      className="max-h-48 w-full rounded-lg border border-border object-cover"
                    />
                  ) : (
                    <p className="rounded-lg border border-dashed border-border px-3 py-8 text-center text-sm text-muted-foreground">
                      No still yet
                    </p>
                  )}
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {!c.paired ? (
                      <Button onClick={() => pairCamera(c.id)}>Pair with house key</Button>
                    ) : null}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTargetCam(c.id);
                        fileRef.current?.click();
                      }}
                    >
                      <Camera className="size-4" />
                      Send a still
                    </Button>
                    {(c.place === "fridge" || c.place === "pantry") && (
                      <Button variant="outline" asChild>
                        <Link to="/pantry" hash="snap">
                          Inventory this
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              const url = String(reader.result ?? "");
              setCameraFrame(targetCam, url);
              toast.success("Still saved on this camera");
            };
            reader.readAsDataURL(file);
          }}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="new-cam">Add a camera</Label>
            <Input
              id="new-cam"
              className="mt-1.5"
              value={camName}
              onChange={(e) => setCamName(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              addCamera(camName || "House camera", "counter");
              toast.success("Camera added — send a still to prove it");
            }}
          >
            Add camera
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-medium">What’s in the cold box</h2>
        {fridgeFood.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing logged in the fridge yet.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {fridgeFood.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span>{PRODUCT_MAP[item.productId]?.name ?? item.productId}</span>
                <span className="text-muted-foreground">{item.location}</span>
              </li>
            ))}
          </ul>
        )}
        <Button variant="outline" asChild>
          <Link to="/pantry">Open pantry</Link>
        </Button>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-2xl font-medium">Activity</h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {events.slice(0, 8).map((ev) => (
            <li key={ev.id}>{ev.text}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
