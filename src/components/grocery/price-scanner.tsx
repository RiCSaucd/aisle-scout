import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Delete, Keyboard } from "lucide-react";
import { lookupUpc, SAMPLE_PRODUCTS } from "@/lib/grocery/barcodes";
import type { CatalogItem } from "@/lib/grocery/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarcodeMark } from "./barcode-mark";
import { cn } from "@/lib/utils";

type Detector = {
  detect: (source: ImageBitmapSource) => Promise<{ rawValue: string }[]>;
};

function beep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    osc.type = "square";
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
    window.setTimeout(() => void ctx.close(), 200);
  } catch {
    /* ignore */
  }
}

export function PriceScanner({
  onHit,
}: {
  onHit: (product: CatalogItem, source: "camera" | "keypad" | "sample") => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camera, setCamera] = useState<"off" | "live" | "blocked">("off");
  const [digits, setDigits] = useState("");
  const [error, setError] = useState<string | null>(null);
  const lastHit = useRef(0);

  const fire = useCallback(
    (product: CatalogItem, source: "camera" | "keypad" | "sample") => {
      const now = Date.now();
      if (now - lastHit.current < 900) return;
      lastHit.current = now;
      beep();
      onHit(product, source);
    },
    [onHit],
  );

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamera("off");
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  useEffect(() => {
    if (camera !== "live") return;
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    const DetectorCtor = (
      window as unknown as {
        BarcodeDetector?: new (opts: { formats: string[] }) => Detector;
      }
    ).BarcodeDetector;
    if (!DetectorCtor) {
      setError("This browser can't decode barcodes from video. Type the UPC or tap a sample.");
      return;
    }
    const detector = new DetectorCtor({
      formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"],
    });
    let timer = 0;
    const tick = async () => {
      if (cancelled || video.readyState < 2) {
        timer = window.setTimeout(() => void tick(), 240);
        return;
      }
      try {
        const codes = await detector.detect(video);
        const raw = codes[0]?.rawValue;
        if (raw) {
          const product = lookupUpc(raw);
          if (product) fire(product, "camera");
          else setError(`No book match for ${raw.replace(/\D/g, "")}`);
        }
      } catch {
        /* frame skip */
      }
      timer = window.setTimeout(() => void tick(), 240);
    };
    void tick();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [camera, fire]);

  async function startCamera() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera("blocked");
      setError("Camera isn't available here. Type a UPC or tap a sample barcode.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamera("live");
    } catch {
      setCamera("blocked");
      setError("Camera permission was denied. Type the UPC under the barcode, or tap a sample.");
    }
  }

  function submitDigits() {
    const product = lookupUpc(digits);
    if (!product) {
      setError("Nothing in the 32080 book for that code. Try the last 4 digits or a sample.");
      return;
    }
    setError(null);
    setDigits("");
    fire(product, "keypad");
  }

  function pad(d: string) {
    if (d === "del") {
      setDigits((v) => v.slice(0, -1));
      return;
    }
    setDigits((v) => (v + d).slice(0, 13));
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Sample shelf — tap to scan
        </p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SAMPLE_PRODUCTS.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => fire(p, "sample")}
                className="h-full w-full rounded-xl border border-border bg-card p-3 text-left shadow-[var(--shadow-card)] transition-colors duration-150 hover:bg-muted/40"
              >
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">{p.brand ?? p.size}</p>
                <BarcodeMark productId={p.id} compact className="mt-2" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="relative aspect-[4/3] bg-foreground/90">
          <video
            ref={videoRef}
            className={cn(
              "size-full object-cover",
              camera === "live" ? "opacity-100" : "opacity-0",
            )}
            playsInline
            muted
            autoPlay
          />
          {camera !== "live" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-background">
              <CameraOff className="size-8 opacity-80" />
              <p className="max-w-xs text-sm leading-relaxed">
                Point at a shelf tag or the UPC on the package. If the camera isn't available here,
                tap a sample barcode above — same math.
              </p>
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-x-10 top-1/2 h-16 -translate-y-1/2 rounded-md border-2 border-background/80" />
          )}
        </div>
        <div className="flex gap-2 p-3">
          {camera === "live" ? (
            <Button variant="outline" className="flex-1" onClick={stopCamera}>
              <CameraOff className="size-4" />
              Stop camera
            </Button>
          ) : (
            <Button className="flex-1" onClick={() => void startCamera()}>
              <Camera className="size-4" />
              Open camera
            </Button>
          )}
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-warn-fill px-3 py-2 text-sm text-warn">{error}</p>
      ) : null}

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Type a UPC
        </p>
        <div className="flex gap-2">
          <Input
            inputMode="numeric"
            pattern="[0-9]*"
            value={digits}
            onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 13))}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitDigits();
            }}
            placeholder="Full code or last 4"
            aria-label="UPC"
            className="h-12 font-mono tracking-widest"
          />
          <Button onClick={submitDigits} aria-label="Look up UPC">
            <Keyboard className="size-4" />
            Look up
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:hidden">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "del"].map((d) => (
            <Button
              key={d}
              type="button"
              variant={d === "del" ? "outline" : "secondary"}
              className="h-12"
              onClick={() => pad(d)}
            >
              {d === "del" ? <Delete className="size-4" /> : d}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}