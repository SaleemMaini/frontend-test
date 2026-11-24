import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearchIcon, XIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { productsService } from "@/features/products/api/products.service";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductResultsSkeleton } from "@/features/products/components/product-grid-skeleton";
import { ProductPagination } from "@/features/products/components/product-pagination";
import { ProductToolbar } from "@/features/products/components/product-toolbar";
import {
  applyProductQuery,
  buildProductsHref,
  parseProductQuery,
  type ProductQuery,
} from "@/features/products/lib/product-query";
import type {
  ProductCategory,
  ProductsResponse,
} from "@/features/products/types/product.types";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const query = parseProductQuery(await searchParams);

  // Start both requests now; only categories block the shell (toolbar),
  // products stream in behind the Suspense boundary below.
  const productsPromise = productsService.list();
  const categories = await productsService.categories();

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Products</h1>

      <ProductToolbar categories={categories} />

      {/* A new key per query remounts the boundary, so every filter or page
          change shows the skeleton instead of stale results. */}
      <Suspense
        key={buildProductsHref(query)}
        fallback={<ProductResultsSkeleton />}
      >
        <ProductResults
          query={query}
          productsPromise={productsPromise}
          categories={categories}
        />
      </Suspense>
    </section>
  );
}

async function ProductResults({
  query,
  productsPromise,
  categories,
}: {
  query: ProductQuery;
  productsPromise: Promise<ProductsResponse>;
  categories: ProductCategory[];
}) {
  const { products } = await productsPromise;
  const { items, page, totalPages, totalItems } = applyProductQuery(
    products,
    query,
  );

  const hasFilters = Boolean(query.q || query.category);
  const categoryName = categories.find((c) => c.slug === query.category)?.name;

  if (items.length === 0) {
    return hasFilters ? (
      <EmptyState
        icon={PackageSearchIcon}
        title="No products match your filters"
        description="Try a different search term or category, or clear the filters to see everything."
        action={
          <Link
            href={buildProductsHref({
              ...query,
              q: "",
              category: null,
              page: 1,
            })}
            className={buttonVariants({ size: "lg" })}
          >
            <XIcon data-icon="inline-start" aria-hidden />
            Clear filters
          </Link>
        }
      />
    ) : (
      <EmptyState
        icon={PackageSearchIcon}
        title="No products yet"
        description="Products you add will show up here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {totalItems} {totalItems === 1 ? "product" : "products"}
        {query.category ? ` in ${categoryName ?? query.category}` : null}
        {query.q ? ` matching “${query.q}”` : null}
        {totalPages > 1 ? ` · Page ${page} of ${totalPages}` : null}
      </p>
      <ProductGrid products={items} categories={categories} />
      <ProductPagination query={query} page={page} totalPages={totalPages} />
    </div>
  );
}
