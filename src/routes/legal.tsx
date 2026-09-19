import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal")({ component: Legal });

function Legal() {
  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Aisle Scout</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Privacy & terms</h1>
        <p className="text-sm text-muted-foreground">Last updated September 19, 2026. Required for App Store and Google Play.</p>
      </header>

      <section className="space-y-2 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">What we store on your device</h2>
        <p>
          Your grocery list, pantry, fridge photos you choose to scan, house API key, and clipped deals stay in this
          browser (or the Aisle Scout app) on your phone. We do not sell that data. Clearing site data or uninstalling
          the app removes it.
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">Photos and camera</h2>
        <p>
          The scanner and fridge snap use the camera only when you tap Scan or Snap. Shelf photos may be sent to a
          vision service to read items. We do not keep a server-side photo album.
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">Prices</h2>
        <p>
          The 32080 book is a local price file, not a live feed from every store. Always check the shelf tag. Club and
          farm prices assume membership or market hours as labeled in the app.
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">House devices</h2>
        <p>
          The house key talks to devices you pair. Keep the key private. Aisle Scout is not affiliated with Samsung,
          LG, or any fridge maker.
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">Children</h2>
        <p>Aisle Scout is for grocery shoppers 13 and older. We do not knowingly collect data from children.</p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">Copyright</h2>
        <p>
          Aisle Scout source and brand are all rights reserved. Public GitHub is so you can review the product, not
          copy it.
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">Contact</h2>
        <p>
          Questions: open an issue on{" "}
          <a className="text-primary underline-offset-4 hover:underline" href="https://github.com/RiCSaucd/aisle-scout">
            github.com/RiCSaucd/aisle-scout
          </a>
          .
        </p>
      </section>
    </article>
  );
}
