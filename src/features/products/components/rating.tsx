import { StarIcon } from "lucide-react";
import { cn } from "cn";

type RatingProps = {
  value: number;
  max?: number;
  className?: string;
};

export function Rating({ value, max = 5, className }: RatingProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const stars = Array.from({ length: max }, (_, i) => (
    <StarIcon key={i} className="size-4 shrink-0 fill-current" aria-hidden />
  ));

  return (
    <span
      role="img"
      aria-label={`Rated ${clamped.toFixed(1)} out of ${max}`}
      className={cn("relative inline-flex", className)}
    >
      <span className="flex text-muted-foreground/30">{stars}</span>
      <span
        className="absolute inset-y-0 left-0 flex overflow-hidden text-amber-500"
        style={{ width: `${(clamped / max) * 100}%` }}
      >
        {stars}
      </span>
    </span>
  );
}
