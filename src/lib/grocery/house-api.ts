import { createServerFn } from "@tanstack/react-start";
import type { CameraDevice, FridgeDevice } from "./house";

export const registerHouse = createServerFn({ method: "POST" })
  .validator(
    (input: {
      key: string;
      fridges: FridgeDevice[];
      cameras: CameraDevice[];
    }) => input,
  )
  .handler(async ({ data }) => {
    const { registerHouseKey } = await import("./house-api.server");
    if (!/^ask_[a-f0-9]{32}$/i.test(data.key)) {
      return { ok: false as const, error: "Bad key" };
    }
    const snap = registerHouseKey(data.key, {
      fridges: data.fridges,
      cameras: data.cameras,
      updatedAt: new Date().toISOString(),
    });
    return { ok: true as const, updatedAt: snap.updatedAt };
  });
