"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOffIcon } from "lucide-react";
import { cn } from "cn";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
        {current ? (
          <Image
            key={current}
            src={current}
            alt={
              images.length > 1
                ? `${title}, image ${selected + 1} of ${images.length}`
                : title
            }
            fill
            sizes="(min-width: 1152px) 560px, (min-width: 1024px) 50vw, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-contain p-6"
          />
        ) : (
          <ImageOffIcon
            className="absolute inset-0 m-auto size-10 text-muted-foreground"
            aria-hidden
          />
        )}
      </div>

      {images.length > 1 ? (
        <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Product images">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === selected ? "true" : undefined}
                className={cn(
                  "relative block size-16 overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/10 transition outline-none hover:ring-foreground/30 focus-visible:ring-3 focus-visible:ring-ring/50 sm:size-20",
                  i === selected && "ring-2 ring-primary hover:ring-primary",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  // Above the fold, and shares src with the main (LCP) image.
                  loading="eager"
                  className="object-contain p-1.5"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
