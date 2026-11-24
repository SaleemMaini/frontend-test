"use server";

import { z } from "zod";

import { ApiError } from "@/lib/http";
import { productsService } from "./api/products.service";
import { productSchema, type ProductInput } from "./schemas/product.schema";
import type { Product } from "./types/product.types";

export type ProductFormErrors = {
  formErrors: string[];
  fieldErrors: Partial<Record<keyof ProductInput, string[]>>;
};

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: ProductFormErrors };

const productIdSchema = z.number().int().positive();

function formError(message: string): ActionResult<never> {
  return { ok: false, errors: { formErrors: [message], fieldErrors: {} } };
}

async function run(
  mutate: () => Promise<Product>,
): Promise<ActionResult<Product>> {
  try {
    return { ok: true, data: await mutate() };
  } catch (error) {
    if (error instanceof ApiError) return formError(error.message);
    console.error(error);
    return formError("Something went wrong. Please try again.");
  }
}


export async function createProduct(
  input: unknown,
): Promise<ActionResult<Product>> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error) };
  }

  return run(() => productsService.create(parsed.data));
}

export async function updateProduct(
  id: unknown,
  input: unknown,
): Promise<ActionResult<Product>> {
  const parsedId = productIdSchema.safeParse(id);
  if (!parsedId.success) return formError("Invalid product id.");

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error) };
  }

  return run(() => productsService.update(parsedId.data, parsed.data));
}
