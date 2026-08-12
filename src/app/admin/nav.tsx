"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string; exact?: boolean };

const LINKS: readonly NavLink[] = [
  { href: "/admin", label: "Reports", exact: true },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/admins", label: "Admins" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex items-center gap-1">
      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className="px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200"
            style={{
              color: active ? "#ffffff" : "#0d3d1a",
              backgroundColor: active ? "#1a5c2a" : "transparent",
              boxShadow: active ? "0 6px 16px -6px rgba(26,92,42,0.4)" : "none",
            }}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
