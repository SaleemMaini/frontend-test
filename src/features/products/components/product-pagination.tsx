import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import {
  buildProductsHref,
  type ProductQuery,
} from "@/features/products/lib/product-query";

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getPageItems(current: number, total: number): PageItem[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const visible = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
  for (const [i, p] of visible.entries()) {
    const prev = visible[i - 1];
    if (prev !== undefined && p - prev === 2) items.push(prev + 1);
    else if (prev !== undefined && p - prev > 2)
      items.push(p === total ? "ellipsis-end" : "ellipsis-start");
    items.push(p);
  }
  return items;
}

type ProductPaginationProps = {
  query: ProductQuery;
  /** The page actually shown (already clamped). */
  page: number;
  totalPages: number;
};

export function ProductPagination({
  query,
  page,
  totalPages,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => buildProductsHref({ ...query, page: p });

  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <ul className="flex items-center gap-1">
        <li>
          <EdgeLink
            direction="previous"
            href={page > 1 ? hrefFor(page - 1) : null}
          />
        </li>

        {getPageItems(page, totalPages).map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <Link
                href={hrefFor(item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={buttonVariants({
                  variant: item === page ? "outline" : "ghost",
                  size: "icon",
                  className: "tabular-nums",
                })}
              >
                {item}
              </Link>
            </li>
          ) : (
            <li key={item} aria-hidden>
              <span className="flex size-8 items-center justify-center text-muted-foreground">
                <MoreHorizontalIcon className="size-4" />
              </span>
            </li>
          ),
        )}

        <li>
          <EdgeLink
            direction="next"
            href={page < totalPages ? hrefFor(page + 1) : null}
          />
        </li>
      </ul>
    </nav>
  );
}

function EdgeLink({
  direction,
  href,
}: {
  direction: "previous" | "next";
  href: string | null;
}) {
  const isPrev = direction === "previous";
  const label = isPrev ? "Previous" : "Next";
  const Icon = isPrev ? ChevronLeftIcon : ChevronRightIcon;

  const content = (
    <>
      {isPrev ? <Icon data-icon="inline-start" aria-hidden /> : null}
      <span className="hidden sm:inline">{label}</span>
      {isPrev ? null : <Icon data-icon="inline-end" aria-hidden />}
    </>
  );

  const className = buttonVariants({ variant: "ghost" });

  // A link can't be disabled: an <a> without href is not focusable or
  // clickable, and role + aria-disabled announce it as a disabled link.
  if (!href) {
    return (
      <a
        role="link"
        aria-disabled="true"
        aria-label={`${label} page`}
        className={cn(className, "pointer-events-none opacity-50")}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={`${label} page`} className={className}>
      {content}
    </Link>
  );
}
