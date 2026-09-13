import { createFileRoute } from "@tanstack/react-router";
import {
  bearerKey,
  CORS,
  readHouse,
  registerHouseKey,
  writeHouse,
} from "@/lib/grocery/house-api.server";
import type { CameraDevice, FridgeDevice } from "@/lib/grocery/house";

export const Route = createFileRoute("/api/v1/house")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        const key = bearerKey(request);
        if (!key) {
          return Response.json({ ok: false, error: "Missing house key" }, { status: 401, headers: CORS });
        }
        const snap = readHouse(key) ?? registerHouseKey(key);
        return Response.json({ ok: true, ...snap }, { headers: CORS });
      },
      POST: async ({ request }) => {
        const key = bearerKey(request);
        if (!key) {
          return Response.json({ ok: false, error: "Missing house key" }, { status: 401, headers: CORS });
        }
        let body: {
          action?: string;
          id?: string;
          setpointF?: number;
          doorOpen?: boolean;
          camera?: CameraDevice;
          fridges?: FridgeDevice[];
          cameras?: CameraDevice[];
        } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return Response.json({ ok: false, error: "Bad JSON" }, { status: 400, headers: CORS });
        }
        const snap = readHouse(key) ?? registerHouseKey(key);
        if (body.action === "register") {
          const next = writeHouse(key, {
            fridges: body.fridges ?? snap.fridges,
            cameras: body.cameras ?? snap.cameras,
            updatedAt: new Date().toISOString(),
          });
          return Response.json({ ok: true, ...next }, { headers: CORS });
        }
        if (body.action === "set-temp" && body.id && typeof body.setpointF === "number") {
          const fridges = snap.fridges.map((f) =>
            f.id === body.id ? { ...f, setpointF: body.setpointF as number, paired: true } : f,
          );
          const next = writeHouse(key, { ...snap, fridges });
          return Response.json({ ok: true, ...next }, { headers: CORS });
        }
        if (body.action === "door" && body.id && typeof body.doorOpen === "boolean") {
          const fridges = snap.fridges.map((f) =>
            f.id === body.id ? { ...f, doorOpen: body.doorOpen as boolean } : f,
          );
          const next = writeHouse(key, { ...snap, fridges });
          return Response.json({ ok: true, ...next }, { headers: CORS });
        }
        if (body.action === "camera" && body.camera) {
          const existing = snap.cameras.find((c) => c.id === body.camera?.id);
          const cameras = existing
            ? snap.cameras.map((c) => (c.id === body.camera?.id ? { ...c, ...body.camera, paired: true } : c))
            : [...snap.cameras, { ...body.camera, paired: true }];
          const next = writeHouse(key, { ...snap, cameras });
          return Response.json({ ok: true, ...next }, { headers: CORS });
        }
        return Response.json({ ok: false, error: "Unknown action" }, { status: 400, headers: CORS });
      },
    },
  },
});
