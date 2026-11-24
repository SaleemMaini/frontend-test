import { Skeleton } from "@/components/ui/skeleton";
import { ProductResultsSkeleton } from "@/features/products/components/product-grid-skeleton";

export default function ProductsLoading() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <div aria-hidden className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-8 flex-1 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-8 flex-1 rounded-lg sm:w-48 sm:flex-none" />
            <Skeleton className="h-8 flex-1 rounded-lg sm:w-48 sm:flex-none" />
          </div>
        </div>
      </div>

      <ProductResultsSkeleton />
    </section>
  );
}
