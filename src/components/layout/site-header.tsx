import Link from "next/link";
import { PackageIcon, PlusIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { NavLink } from "@/components/layout/nav-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4">
        <Link
          href="/products"
          className="flex items-center gap-2 rounded-md font-semibold tracking-tight focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <PackageIcon className="size-4" aria-hidden />
          </span>
          <span className="hidden sm:inline">Product Catalog</span>
          <span className="sr-only sm:hidden">Product Catalog</span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1">
          <NavLink href="/products">Products</NavLink>
        </nav>

        <Link
          href="/products/new"
          className={buttonVariants({ size: "lg", className: "ml-auto" })}
        >
          <PlusIcon data-icon="inline-start" aria-hidden />
          New product
        </Link>
      </div>
    </header>
  );
}
