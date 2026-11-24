import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <section
      role="status"
      aria-busy="true"
      className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8"
    >
      <span className="sr-only">Loading product…</span>

      <div aria-hidden className="space-y-12">
        <Skeleton className="h-8 w-32" />

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-3">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="size-16 rounded-lg sm:size-20" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-9 w-4/5" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-5 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-2 border-t pt-6">
              <Skeleton className="h-9 w-20 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </section>
  );
}
