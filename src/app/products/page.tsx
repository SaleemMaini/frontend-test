import type { Metadata } from "next";

import { productsService } from "@/features/products/api/products.service";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductPagination } from "@/features/products/components/product-pagination";
import { ProductToolbar } from "@/features/products/components/product-toolbar";
import {
  applyProductQuery,
  parseProductQuery,
} from "@/features/products/lib/product-query";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const query = parseProductQuery(await searchParams);

  const [{ products }, categories] = await Promise.all([
    productsService.list(),
    productsService.categories(),
  ]);

  const { items, page, totalPages, totalItems } = applyProductQuery(
    products,
    query,
  );

  const categoryName = new Map(categories.map((c) => [c.slug, c.name]));

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground">
          {totalItems} {totalItems === 1 ? "product" : "products"}
          {query.category
            ? ` in ${categoryName.get(query.category) ?? query.category}`
            : null}
          {query.q ? ` matching “${query.q}”` : null}
          {totalPages > 1 ? ` · Page ${page} of ${totalPages}` : null}
        </p>
      </header>

      <ProductToolbar categories={categories} />

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="font-medium">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or category.
          </p>
        </div>
      ) : (
        <>
          <ProductGrid products={items} categories={categories} />
          <ProductPagination
            query={query}
            page={page}
            totalPages={totalPages}
          />
        </>
      )}
    </section>
  );
}
