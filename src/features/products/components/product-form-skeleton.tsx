import { Skeleton } from "@/components/ui/skeleton";

function FieldSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className={tall ? "h-24 rounded-lg" : "h-8 rounded-lg"} />
    </div>
  );
}

export function ProductFormSkeleton({ label }: { label: string }) {
  return (
    <section
      role="status"
      aria-busy="true"
      className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8"
    >
      <span className="sr-only">{label}</span>

      <div aria-hidden className="space-y-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>

        <div className="space-y-5">
          <FieldSkeleton />
          <FieldSkeleton tall />
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="grid gap-5 sm:grid-cols-2">
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 border-t pt-6">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>
    </section>
  );
}
