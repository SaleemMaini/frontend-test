import { ProductCard } from "@/features/products/components/product-card";
import type {
  Product,
  ProductCategory,
} from "@/features/products/types/product.types";

export const productGridClassName =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

const EAGER_COUNT = 4;

type ProductGridProps = {
  products: Product[];
  categories?: ProductCategory[];
};

export function ProductGrid({ products, categories = [] }: ProductGridProps) {
  const categoryName = new Map(categories.map((c) => [c.slug, c.name]));

  return (
    <ul className={productGridClassName}>
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            categoryName={categoryName.get(product.category)}
            eager={index < EAGER_COUNT}
          />
        </li>
      ))}
    </ul>
  );
}
