import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PRODUCTS_PER_PAGE } from "@/features/products/lib/product-query";

export default function ProductsLoading() {
  return (
    <section
      role="status"
      aria-busy="true"
      className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8"
    >
      <span className="sr-only">Loading products…</span>

      <header className="space-y-1" aria-hidden>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-48" />
      </header>

      <div aria-hidden className="flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-8 flex-1 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1 rounded-lg sm:w-48 sm:flex-none" />
          <Skeleton className="h-8 flex-1 rounded-lg sm:w-48 sm:flex-none" />
        </div>
      </div>

      <ul
        aria-hidden
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {Array.from({ length: PRODUCTS_PER_PAGE }, (_, i) => (
          <li key={i}>
            <Card className="h-full">
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
    </section>
  );
}
