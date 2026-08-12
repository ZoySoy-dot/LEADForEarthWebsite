"use client";

import { useRouter } from "next/navigation";

// Whole-row click target for admin tables. Ignores clicks that already
// landed on a link/button so nested interactives keep working; the primary
// <Link> inside remains for keyboard nav and middle-click-open-new-tab.
export function ClickableRow({
  href, children, className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <tr
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a, button")) return;
        router.push(href);
      }}
      className={`cursor-pointer ${className ?? ""}`}
    >
      {children}
    </tr>
  );
}
