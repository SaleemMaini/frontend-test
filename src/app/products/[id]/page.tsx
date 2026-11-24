import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getProduct, parseProductId } from "@/features/products/api/get-product";
import { ProductDetails } from "@/features/products/components/product-details";

const DESCRIPTION_MAX = 155;

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")) || cut}…`;
}

async function loadProduct(params: PageProps<"/products/[id]">["params"]) {
  const id = parseProductId((await params).id);
  if (id === null) notFound();

  const product = await getProduct(id);
  if (!product) notFound();

  return product;
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  const product = await loadProduct(params);
  const description = truncate(product.description, DESCRIPTION_MAX);

  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      images: product.thumbnail ? [product.thumbnail] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const product = await loadProduct(params);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/products"
        className={buttonVariants({ variant: "ghost", className: "-ml-2.5" })}
      >
        <ArrowLeftIcon data-icon="inline-start" aria-hidden />
        All products
      </Link>
      <ProductDetails product={product} />
    </section>
  );
}
