"use client";

import { useId, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createProduct,
  updateProduct,
  type ActionResult,
} from "@/features/products/actions";
import {
  productSchema,
  type ProductInput,
} from "@/features/products/schemas/product.schema";
import type {
  Product,
  ProductCategory,
} from "@/features/products/types/product.types";

type ProductFormProps = { categories: ProductCategory[] } & (
  | { mode: "create"; defaultValues?: DefaultValues<ProductInput> }
  | { mode: "edit"; productId: number; defaultValues: ProductInput }
);

type FieldName = keyof ProductInput;

const EMPTY_VALUES: DefaultValues<ProductInput> = {
  title: "",
  description: "",
  category: "",
  brand: "",
};

/** Empty number inputs become `undefined` (not NaN) so optional fields stay optional. */
const toOptionalNumber = (value: unknown) =>
  value === "" || value == null ? undefined : Number(value);

const toOptionalString = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export function ProductForm(props: ProductFormProps) {
  const { mode, categories } = props;
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();
  const uid = useId();
  const initialValues = { ...EMPTY_VALUES, ...props.defaultValues };

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues,
  });

  // Stay disabled until the next page has rendered, not just until the action resolves.
  const busy = isSubmitting || isNavigating;

  const categoryItems = categories.map((c) => ({
    value: c.slug,
    label: c.name,
  }));

  const ids = (name: FieldName) => ({
    control: `${uid}-${name}`,
    error: `${uid}-${name}-error`,
    description: `${uid}-${name}-description`,
  });

  /** aria wiring for a control; `describedBy` lists any helper-text ids. */
  const a11y = (name: FieldName, ...describedBy: string[]) => {
    const invalid = Boolean(errors[name]);
    const describedByIds = [...describedBy, invalid ? ids(name).error : null]
      .filter(Boolean)
      .join(" ");
    return {
      id: ids(name).control,
      "aria-invalid": invalid || undefined,
      "aria-describedby": describedByIds || undefined,
    };
  };

  function applyServerErrors(result: Extract<ActionResult<Product>, { ok: false }>) {
    const entries = Object.entries(result.errors.fieldErrors) as [
      FieldName,
      string[] | undefined,
    ][];
    let focused = false;
    for (const [name, messages] of entries) {
      if (!messages?.length) continue;
      setError(
        name,
        { type: "server", message: messages[0] },
        { shouldFocus: !focused },
      );
      focused = true;
    }
    if (result.errors.formErrors.length) {
      setError("root.server", {
        type: "server",
        message: result.errors.formErrors.join(" "),
      });
    }
  }

  async function onSubmit(values: ProductInput) {
    const result =
      props.mode === "create"
        ? await createProduct(values)
        : await updateProduct(props.productId, values);

    if (!result.ok) {
      applyServerErrors(result);
      return;
    }

    if (props.mode === "create") {
      toast.success(`“${result.data.title}” created`, {
        description:
          "DummyJSON doesn’t persist new products, so it won’t appear in the list.",
      });
      // DummyJSON always answers with id 195, which doesn't exist; go to the list instead.
      startTransition(() => router.push("/products"));
    } else {
      toast.success("Changes saved");
      startTransition(() => router.push(`/products/${props.productId}`));
    }
  }

  const cancelHref =
    props.mode === "edit" ? `/products/${props.productId}` : "/products";
  const fieldError = (name: FieldName) => (
    <FieldError id={ids(name).error} errors={[errors[name]]} />
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={busy}
      className="space-y-8"
    >
      <FieldGroup>
        <Field data-invalid={Boolean(errors.title)}>
          <FieldLabel htmlFor={ids("title").control}>Title</FieldLabel>
          <Input
            {...register("title")}
            defaultValue={initialValues.title}
            {...a11y("title")}
            autoComplete="off"
            aria-required
          />
          {fieldError("title")}
        </Field>

        <Field data-invalid={Boolean(errors.description)}>
          <FieldLabel htmlFor={ids("description").control}>
            Description
          </FieldLabel>
          <Textarea
            {...register("description")}
            defaultValue={initialValues.description}
            {...a11y("description")}
            rows={4}
          />
          {fieldError("description")}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.price)}>
            <FieldLabel htmlFor={ids("price").control}>Price (USD)</FieldLabel>
            <Input
              {...register("price", { setValueAs: toOptionalNumber })}
              defaultValue={initialValues.price}
              {...a11y("price")}
              type="number"
              inputMode="decimal"
              min={0}
              step={0.01}
              aria-required
            />
            {fieldError("price")}
          </Field>

          <Field data-invalid={Boolean(errors.stock)}>
            <FieldLabel htmlFor={ids("stock").control}>Stock</FieldLabel>
            <Input
              {...register("stock", { setValueAs: toOptionalNumber })}
              defaultValue={initialValues.stock}
              {...a11y("stock")}
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
            />
            {fieldError("stock")}
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={ids("category").control}>
                  Category
                </FieldLabel>
                <Select
                  items={categoryItems}
                  name={field.name}
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(value ?? "")}
                  required
                >
                  <SelectTrigger
                    ref={field.ref}
                    {...a11y("category")}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError("category")}
              </Field>
            )}
          />

          <Field data-invalid={Boolean(errors.brand)}>
            <FieldLabel htmlFor={ids("brand").control}>Brand</FieldLabel>
            <Input
              {...register("brand")}
              defaultValue={initialValues.brand}
              {...a11y("brand")}
              autoComplete="off"
            />
            {fieldError("brand")}
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.rating)}>
            <FieldLabel htmlFor={ids("rating").control}>Rating</FieldLabel>
            <Input
              {...register("rating", { setValueAs: toOptionalNumber })}
              defaultValue={initialValues.rating}
              {...a11y("rating", ids("rating").description)}
              type="number"
              inputMode="decimal"
              min={0}
              max={5}
              step={0.1}
            />
            <FieldDescription id={ids("rating").description}>
              Between 0 and 5.
            </FieldDescription>
            {fieldError("rating")}
          </Field>

          <Field data-invalid={Boolean(errors.thumbnail)}>
            <FieldLabel htmlFor={ids("thumbnail").control}>
              Thumbnail URL
            </FieldLabel>
            <Input
              {...register("thumbnail", { setValueAs: toOptionalString })}
              defaultValue={initialValues.thumbnail}
              {...a11y("thumbnail")}
              type="url"
              inputMode="url"
              placeholder="https://…"
              autoComplete="off"
            />
            {fieldError("thumbnail")}
          </Field>
        </div>
      </FieldGroup>

      <FieldError errors={[errors.root?.server]} />

      <div className="flex flex-col-reverse gap-2 border-t pt-6 sm:flex-row sm:justify-end">
        <Link
          href={cancelHref}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Cancel
        </Link>
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? (
            <LoaderCircleIcon
              data-icon="inline-start"
              className="animate-spin"
              aria-hidden
            />
          ) : (
            <SaveIcon data-icon="inline-start" aria-hidden />
          )}
          {mode === "create"
            ? busy
              ? "Creating…"
              : "Create product"
            : busy
              ? "Saving…"
              : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
