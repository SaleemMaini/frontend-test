import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(1, { error: "Title is required" }),
  price: z.number({ error: "Price must be a number" }).positive({
    error: "Price must be greater than 0",
  }),
  category: z
    .string({ error: "Category is required" })
    .trim()
    .min(1, { error: "Category is required" }),
  rating: z
    .number({ error: "Rating must be a number" })
    .min(0, { error: "Rating must be at least 0" })
    .max(5, { error: "Rating must be at most 5" })
    .optional(),
  description: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  stock: z
    .number({ error: "Stock must be a number" })
    .int({ error: "Stock must be a whole number" })
    .min(0, { error: "Stock cannot be negative" })
    .optional(),
  thumbnail: z.url({ error: "Thumbnail must be a valid URL" }).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
