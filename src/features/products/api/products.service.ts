import { ApiError, http } from "@/lib/http";
import type { ProductInput } from "../schemas/product.schema";
import type {
  DeletedProduct,
  Product,
  ProductCategory,
  ProductsResponse,
} from "../types/product.types";

type ProductId = Product["id"];

const productPath = (id: ProductId) =>
  `/products/${encodeURIComponent(String(id))}`;

async function list(): Promise<ProductsResponse> {
  return http<ProductsResponse>("/products?limit=0");
}

async function getById(id: ProductId): Promise<Product | null> {
  try {
    return await http<Product>(productPath(id));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

function categories(): Promise<ProductCategory[]> {
  return http<ProductCategory[]>("/products/categories");
}

function create(input: ProductInput): Promise<Product> {
  return http<Product>("/products/add", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

function update(id: ProductId, input: ProductInput): Promise<Product> {
  return http<Product>(productPath(id), {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

function remove(id: ProductId): Promise<DeletedProduct> {
  return http<DeletedProduct>(productPath(id), { method: "DELETE" });
}

export const productsService = {
  list,
  getById,
  categories,
  create,
  update,
  remove,
};
