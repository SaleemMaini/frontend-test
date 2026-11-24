import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getProduct, parseProductId } from "@/features/products/api/get-product";
import { productsService } from "@/features/products/api/products.service";
import { ProductForm } from "@/features/products/components/product-form";
import { productToInput } from "@/features/products/schemas/product.schema";

async function loadProduct(
  params: PageProps<"/products/[id]/edit">["params"],
) {
  const id = parseProductId((await params).id);
  if (id === null) notFound();

  const product = await getProduct(id);
  if (!product) notFound();

  return product;
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]/edit">): Promise<Metadata> {
  const product = await loadProduct(params);
  return { title: `Edit ${product.title}` };
}

export default async function EditProductPage({
  params,
}: PageProps<"/products/[id]/edit">) {
  // `getProduct` is request-memoized, so this shares the metadata fetch.
  const [product, categories] = await Promise.all([
    loadProduct(params),
    productsService.categories(),
  ]);

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8">
      <Link
        href={`/products/${product.id}`}
        className={buttonVariants({ variant: "ghost", className: "-ml-2.5" })}
      >
        <ArrowLeftIcon data-icon="inline-start" aria-hidden />
        Back to product
      </Link>

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Edit product</h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Update the details for “{product.title}”.
        </p>
      </header>

      <ProductForm
        mode="edit"
        productId={product.id}
        defaultValues={productToInput(product)}
        categories={categories}
      />
    </section>
  );
}
