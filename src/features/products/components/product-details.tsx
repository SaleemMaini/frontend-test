import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPrice } from "@/lib/format";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { Rating } from "@/features/products/components/rating";
import type { Product } from "@/features/products/types/product.types";

const LOW_STOCK_THRESHOLD = 10;

/** "mens-shirts" → "Mens Shirts" (matches the API's category names). */
function formatCategory(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function StockBadge({ stock }: { stock: number }) {
  const status =
    stock <= 0
      ? {
          label: "Out of stock",
          className:
            "bg-destructive/10 text-destructive dark:bg-destructive/20",
        }
      : stock <= LOW_STOCK_THRESHOLD
        ? {
            label: "Low stock",
            className:
              "bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
          }
        : {
            label: "In stock",
            className:
              "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
          };

  return (
    <Badge variant="secondary" className={status.className}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status.label}
    </Badge>
  );
}

function Spec({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b py-2.5 text-sm last:border-b-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-b-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

export function ProductDetails({ product }: { product: Product }) {
  const images = product.images?.length
    ? product.images
    : product.thumbnail
      ? [product.thumbnail]
      : [];
  const { width, height, depth } = product.dimensions;
  const reviewCount = product.reviews?.length ?? 0;

  return (
    <article className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={images} title={product.title} />

        <div className="space-y-6">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">
                {formatCategory(product.category)}
              </Badge>
              {product.brand ? <span>{product.brand}</span> : null}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-balance">
              {product.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Rating value={product.rating} />
              <span className="tabular-nums">
                {product.rating.toFixed(1)}
              </span>
              <span aria-hidden>·</span>
              <a href="#reviews" className="underline-offset-4 hover:underline">
                {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
              </a>
            </div>
          </header>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-3xl font-semibold tabular-nums">
              {formatPrice(product.price)}
            </p>
            {product.discountPercentage > 0 ? (
              <Badge>{Math.round(product.discountPercentage)}% off</Badge>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <StockBadge stock={product.stock} />
            <span className="text-muted-foreground tabular-nums">
              {product.stock} in stock
              {product.minimumOrderQuantity > 1
                ? ` · Minimum order ${product.minimumOrderQuantity}`
                : null}
            </span>
          </div>

          {product.description ? (
            <p className="leading-relaxed text-pretty text-muted-foreground">
              {product.description}
            </p>
          ) : null}

          {product.tags?.length ? (
            <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
              {product.tags.map((tag) => (
                <li key={tag}>
                  <Badge variant="outline">#{tag}</Badge>
                </li>
              ))}
            </ul>
          ) : null}

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/products/${product.id}/edit`}
              className={buttonVariants({ size: "lg" })}
            >
              <PencilIcon data-icon="inline-start" aria-hidden />
              Edit
            </Link>
            {/* TODO: open DeleteProductDialog once it and the delete action exist. */}
            <Button variant="destructive" size="lg" disabled>
              <Trash2Icon data-icon="inline-start" aria-hidden />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <section aria-labelledby="product-specs" className="space-y-4">
        <h2 id="product-specs" className="text-xl font-semibold tracking-tight">
          Details
        </h2>
        <dl className="grid rounded-xl px-4 ring-1 ring-foreground/10 sm:grid-cols-2 sm:gap-x-8">
          <Spec label="SKU">
            <span className="font-mono">{product.sku}</span>
          </Spec>
          <Spec label="Brand">{product.brand ?? "—"}</Spec>
          <Spec label="Category">{formatCategory(product.category)}</Spec>
          <Spec label="Availability">{product.availabilityStatus}</Spec>
          <Spec label="Weight">{product.weight}</Spec>
          <Spec label="Dimensions (W × H × D)">
            <span className="tabular-nums">
              {width} × {height} × {depth}
            </span>
          </Spec>
          <Spec label="Minimum order">{product.minimumOrderQuantity}</Spec>
          <Spec label="Warranty">{product.warrantyInformation}</Spec>
          <Spec label="Shipping">{product.shippingInformation}</Spec>
          <Spec label="Returns">{product.returnPolicy}</Spec>
          <Spec label="Barcode">
            <span className="font-mono">{product.meta.barcode}</span>
          </Spec>
          <Spec label="QR code">
            <Image
              src={product.meta.qrCode}
              alt={`QR code for ${product.title}`}
              width={48}
              height={48}
              className="ml-auto rounded-sm"
            />
          </Spec>
          <Spec label="Added">{formatDate(product.meta.createdAt)}</Spec>
          <Spec label="Last updated">{formatDate(product.meta.updatedAt)}</Spec>
        </dl>
      </section>

      <section id="reviews" aria-labelledby="product-reviews" className="scroll-mt-20 space-y-4">
        <h2 id="product-reviews" className="text-xl font-semibold tracking-tight">
          Reviews{" "}
          <span className="font-normal text-muted-foreground tabular-nums">
            ({reviewCount})
          </span>
        </h2>
        {reviewCount === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((review, i) => (
              <li
                key={`${review.reviewerEmail}-${i}`}
                className="space-y-3 rounded-xl p-4 ring-1 ring-foreground/10"
              >
                <div className="flex items-center justify-between gap-2">
                  <Rating value={review.rating} />
                  <time
                    dateTime={review.date}
                    className="text-xs text-muted-foreground"
                  >
                    {formatDate(review.date)}
                  </time>
                </div>
                <p className="text-sm text-pretty">“{review.comment}”</p>
                <p className="text-sm font-medium">{review.reviewerName}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
