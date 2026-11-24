"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

export default function ProductsError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl border bg-muted text-destructive">
        <TriangleAlertIcon className="size-6" aria-hidden />
      </span>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Something went wrong
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">
          We couldn’t load the products. Please try again.
        </p>
        {digest ? (
          <p className="font-mono text-xs text-muted-foreground">Error ID: {digest}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="lg" onClick={() => retry()}>
          <RotateCwIcon data-icon="inline-start" aria-hidden />
          Try again
        </Button>
        <Link href="/" className={buttonVariants({ size: "lg", variant: "outline" })}>
          Go home
        </Link>
      </div>
    </section>
  );
}
