"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

const links = [
  { href: "/order", label: "Order" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/drivers", label: "Drivers" },
  { href: "/pricing", label: "Pricing" },
  { href: "/admin", label: "Admin Demo" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-eat-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo size="md" />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-eat-soft text-eat-blue"
                    : "text-eat-muted hover:text-eat-blue hover:bg-eat-soft"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile: logo only — bottom tab nav handles navigation */}
        <Link
          href="/pricing"
          className="tap-target rounded-xl px-3 py-2 text-sm font-semibold text-eat-blue md:hidden"
        >
          Pricing
        </Link>
      </div>
    </header>
  );
}
