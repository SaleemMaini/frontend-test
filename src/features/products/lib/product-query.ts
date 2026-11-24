import type { Product } from "../types/product.types";

export const PRODUCTS_PER_PAGE = 12;

export const PRODUCT_SORTS = [
  "price-asc",
  "price-desc",
  "rating-asc",
  "rating-desc",
] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number];

export type ProductQuery = {
  q: string;
  category: string | null;
  sort: ProductSort | null;
  page: number;
};

export type SearchParams = Record<string, string | string[] | undefined>;

export type PaginatedProducts = {
  items: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isProductSort(value: string): value is ProductSort {
  return (PRODUCT_SORTS as readonly string[]).includes(value);
}

function parsePage(value: string | undefined): number {
  if (!value || !/^\d+$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page >= 1 ? page : 1;
}

export function parseProductQuery(searchParams: SearchParams): ProductQuery {
  const q = first(searchParams.q)?.trim() ?? "";
  const category = first(searchParams.category)?.trim() || null;
  const sort = first(searchParams.sort)?.trim() ?? "";

  return {
    q,
    category,
    sort: isProductSort(sort) ? sort : null,
    page: parsePage(first(searchParams.page)?.trim()),
  };
}

export function buildProductsHref(
  query: ProductQuery,
  pathname = "/products",
): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.sort) params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function filterByTitle(products: Product[], q: string): Product[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return products;
  return products.filter((product) =>
    product.title.toLowerCase().includes(needle),
  );
}

export function filterByCategory(
  products: Product[],
  category: string | null,
): Product[] {
  if (!category) return products;
  return products.filter((product) => product.category === category);
}

export function sortProducts(
  products: Product[],
  sort: ProductSort | null,
): Product[] {
  if (!sort) return products;
  const [field, direction] = sort.split("-") as [
    "price" | "rating",
    "asc" | "desc",
  ];
  const sign = direction === "asc" ? 1 : -1;
  return [...products].sort((a, b) => (a[field] - b[field]) * sign);
}

export function paginate(
  products: Product[],
  page: number,
  perPage: number = PRODUCTS_PER_PAGE,
): PaginatedProducts {
  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
  const start = (current - 1) * perPage;

  return {
    items: products.slice(start, start + perPage),
    page: current,
    totalPages,
    totalItems,
  };
}

export function applyProductQuery(
  products: Product[],
  query: ProductQuery,
): PaginatedProducts {
  const filtered = filterByCategory(
    filterByTitle(products, query.q),
    query.category,
  );
  return paginate(sortProducts(filtered, query.sort), query.page);
}
