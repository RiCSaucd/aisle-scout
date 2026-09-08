import type { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

export function Toaster(props: ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast bg-card text-card-foreground border-border",
          description: "text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}
