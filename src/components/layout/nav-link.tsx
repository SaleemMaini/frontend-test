"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavLinkProps = React.ComponentProps<typeof Link> & {
  href: string;
  exact?: boolean;
};

export function NavLink({
  href,
  exact = false,
  className,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        isActive && "bg-muted text-foreground hover:bg-muted",
        className,
      )}
      {...props}
    />
  );
}
