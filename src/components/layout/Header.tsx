"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/order", label: "Order" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-eat-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo size="md" />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const basePath = link.href.split("#")[0];
            const active =
              basePath === "/"
                ? pathname === "/"
                : pathname === basePath || pathname.startsWith(`${basePath}/`);
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
          <Button href="/order" className="ml-2 px-5 py-2.5">
            Order Now
          </Button>
        </nav>

        <Button href="/order" className="md:hidden tap-target px-4 py-2">
          Order Now
        </Button>
      </div>
    </header>
  );
}
