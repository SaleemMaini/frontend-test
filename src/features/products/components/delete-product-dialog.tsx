"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/features/products/actions";

type DeleteProductDialogProps = {
  productId: number;
  productTitle: string;
};

export function DeleteProductDialog({
  productId,
  productTitle,
}: DeleteProductDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const cancelRef = useRef<HTMLButtonElement>(null);

  function handleOpenChange(next: boolean) {
    // Don't let Escape / backdrop clicks dismiss the dialog mid-request.
    if (isPending) return;
    setOpen(next);
    if (next) setError(null);
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (!result.ok) {
        setError(result.errors.formErrors.join(" ") || "Couldn’t delete the product.");
        return;
      }

      toast.success(`“${productTitle}” deleted`, {
        description:
          "DummyJSON doesn’t persist deletions, so it will still appear in the list.",
      });
      // Updates after an `await` need their own transition to stay pending.
      startTransition(() => router.push("/products"));
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={<Button variant="destructive" size="lg" />}
      >
        <Trash2Icon data-icon="inline-start" aria-hidden />
        Delete
      </AlertDialogTrigger>

      <AlertDialogContent initialFocus={cancelRef}>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20">
            <Trash2Icon aria-hidden />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete “{productTitle}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the product from the catalog. This
            action can’t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelRef} disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <LoaderCircleIcon
                data-icon="inline-start"
                className="animate-spin"
                aria-hidden
              />
            ) : (
              <Trash2Icon data-icon="inline-start" aria-hidden />
            )}
            {isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
