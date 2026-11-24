import { cache } from "react";

import { productsService } from "./products.service";

export function parseProductId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

export const getProduct = cache((id: number) => productsService.getById(id));
