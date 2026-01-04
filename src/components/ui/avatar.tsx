"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

function Avatar({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
}

function AvatarImage({ className, src, alt }: { className?: string; src?: string; alt?: string }) {
  const [hasError, setHasError] = React.useState(false);

  if (!src || hasError) {
    return null;
  }

  return (
    <Image
      data-slot="avatar-image"
      src={src}
      alt={alt || "Avatar"}
      fill
      onError={() => setHasError(true)}
      className={cn("aspect-square object-cover", className)}
    />
  );
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full text-xs font-medium",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
