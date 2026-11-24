import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon, PackageXIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Product not found",
};

export default function ProductNotFound() {
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl border bg-muted text-muted-foreground">
        <PackageXIcon className="size-6" aria-hidden />
      </span>

      <div className="space-y-2">
        <p className="font-mono text-sm font-medium text-muted-foreground">
          404
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Product not found
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">
          This product doesn’t exist or may have been removed.
        </p>
      </div>

      <Link href="/products" className={buttonVariants({ size: "lg" })}>
        <ArrowLeftIcon data-icon="inline-start" aria-hidden />
        Back to products
      </Link>
    </section>
  );
}
