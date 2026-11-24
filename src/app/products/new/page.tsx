import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { productsService } from "@/features/products/api/products.service";
import { ProductForm } from "@/features/products/components/product-form";

export const metadata: Metadata = {
  title: "New product",
};

export default async function NewProductPage() {
  const categories = await productsService.categories();

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8">
      <Link
        href="/products"
        className={buttonVariants({ variant: "ghost", className: "-ml-2.5" })}
      >
        <ArrowLeftIcon data-icon="inline-start" aria-hidden />
        All products
      </Link>

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">New product</h1>
        <p className="text-sm text-muted-foreground">
          Add a product to the catalog.
        </p>
      </header>

      <ProductForm mode="create" categories={categories} />
    </section>
  );
}
