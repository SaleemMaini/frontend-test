import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { productGridClassName } from "@/features/products/components/product-grid";
import { PRODUCTS_PER_PAGE } from "@/features/products/lib/product-query";

export function ProductGridSkeleton({
  count = PRODUCTS_PER_PAGE,
}: {
  count?: number;
}) {
  return (
    <ul aria-hidden className={productGridClassName}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <Card className="h-full pt-0">
            <Skeleton className="aspect-square rounded-none" />
            <CardHeader>
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </CardHeader>
            <CardContent className="mt-auto flex items-center justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-10" />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

/** Fallback for the results area: count line + grid. */
export function ProductResultsSkeleton() {
  return (
    <div role="status" aria-busy="true" className="space-y-4">
      <span className="sr-only">Loading products…</span>
      <Skeleton aria-hidden className="h-5 w-48" />
      <ProductGridSkeleton />
    </div>
  );
}
