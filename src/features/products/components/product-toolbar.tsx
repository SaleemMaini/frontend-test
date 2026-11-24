"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoaderCircleIcon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  parseProductQuery,
  type ProductSort,
} from "@/features/products/lib/product-query";
import type { ProductCategory } from "@/features/products/types/product.types";

const SEARCH_DEBOUNCE_MS = 300;

const SORT_ITEMS: { value: ProductSort | null; label: string }[] = [
  { value: null, label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "rating-asc", label: "Rating: low to high" },
];

type Filters = { q: string; category: string | null; sort: ProductSort | null };

export function ProductToolbar({
  categories,
}: {
  categories: ProductCategory[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const query = parseProductQuery(Object.fromEntries(searchParams));

  const categoryItems = [
    { value: null, label: "All categories" },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  // Local input state so typing stays responsive; the URL lags behind by the debounce.
  const [search, setSearch] = useState(query.q);
  // The last `q` this component wrote to the URL, and the last `q` it saw there.
  const [sentQ, setSentQ] = useState(query.q);
  const [seenQ, setSeenQ] = useState(query.q);

  // Pick up external URL changes (back/forward, header link) without clobbering
  // what the user is typing when the change is just our own update landing.
  if (query.q !== seenQ) {
    setSeenQ(query.q);
    if (query.q !== sentQ) {
      setSearch(query.q);
      setSentQ(query.q);
    }
  }

  function update(changes: Partial<Filters>) {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    // Any filter change invalidates the current page.
    params.delete("page");

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  useEffect(() => {
    const next = search.trim();
    if (next === query.q) return;

    const timeout = setTimeout(() => {
      setSentQ(next);
      update({ q: next });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // `update` is recreated each render; re-running on it would reset the debounce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, query.q]);

  return (
    <div
      role="search"
      aria-busy={isPending}
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <label htmlFor="product-search" className="sr-only">
          Search products by title
        </label>
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id="product-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          autoComplete="off"
          className="pr-8 pl-8"
        />
        {isPending ? (
          <LoaderCircleIcon
            className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden
          />
        ) : null}
      </div>

      <div className="flex gap-2">
        <Select
          items={categoryItems}
          value={query.category}
          onValueChange={(category) => update({ category })}
        >
          <SelectTrigger
            aria-label="Filter by category"
            className="flex-1 sm:w-48 sm:flex-none"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryItems.map((item) => (
              <SelectItem key={item.value ?? "all"} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={SORT_ITEMS}
          value={query.sort}
          onValueChange={(sort) => update({ sort })}
        >
          <SelectTrigger
            aria-label="Sort products"
            className="flex-1 sm:w-48 sm:flex-none"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_ITEMS.map((item) => (
              <SelectItem key={item.value ?? "featured"} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
