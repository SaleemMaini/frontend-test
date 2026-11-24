import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productsService } from "@/features/products/api/products.service";
import {
  applyProductQuery,
  parseProductQuery,
} from "@/features/products/lib/product-query";

export const metadata: Metadata = {
  title: "Products",
};

const price = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="font-medium">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or category.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product, index) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.id}`}
                className="block h-full rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <Card className="h-full transition-colors hover:bg-muted/50">
                  {product.thumbnail ? (
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={product.thumbnail}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain p-4"
                        priority={index < 4}
                      />
                    </div>
                  ) : null}
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit">
                      {categoryName.get(product.category) ?? product.category}
                    </Badge>
                    <CardTitle className="line-clamp-2">
                      {product.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-auto flex items-center justify-between text-sm">
                    <span className="font-semibold tabular-nums">
                      {price.format(product.price)}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground tabular-nums">
                      <StarIcon className="size-4 fill-current" aria-hidden />
                      <span className="sr-only">Rating:</span>
                      {product.rating.toFixed(1)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
