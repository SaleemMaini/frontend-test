import Image from "next/image";
import Link from "next/link";
import { ImageOffIcon, StarIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/features/products/types/product.types";

type ProductCardProps = {
  product: Product;
  categoryName?: string;
  eager?: boolean;
};

export function ProductCard({
  product,
  categoryName,
  eager = false,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full pt-0 transition-[box-shadow,translate] duration-200 group-hover:shadow-md group-hover:ring-foreground/20 group-focus-visible:ring-ring motion-safe:group-hover:-translate-y-0.5">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt=""
              fill
              sizes="(min-width: 1280px) 270px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : "auto"}
              className="object-contain p-4 transition-transform duration-300 motion-safe:group-hover:scale-105"
            />
          ) : (
            <ImageOffIcon
              className="absolute inset-0 m-auto size-8 text-muted-foreground"
              aria-hidden
            />
          )}
        </div>

        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            {categoryName ?? product.category}
          </Badge>
          <CardTitle className="line-clamp-2 group-hover:underline group-hover:underline-offset-4">
            {product.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="mt-auto flex items-center justify-between text-sm">
          <span className="font-semibold tabular-nums">
            {formatPrice(product.price)}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground tabular-nums">
            <StarIcon className="size-4 fill-current" aria-hidden />
            <span className="sr-only">Rated </span>
            {product.rating.toFixed(1)}
            <span className="sr-only"> out of 5</span>
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
