"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { unreadNotificationCount } from "@/lib/notifications";

const links = [
  { href: "/order", label: "Order" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

export function Header() {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const refresh = () => setUnread(unreadNotificationCount());
    const frame = requestAnimationFrame(refresh);
    const interval = window.setInterval(refresh, 5000);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(interval);
    };
  }, [pathname]);

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
          <Link
            href="/account/notifications"
            className="relative rounded-xl p-2 text-eat-muted transition hover:bg-eat-soft hover:text-eat-blue tap-target"
            aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-eat-red px-1 text-[10px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            className={`rounded-xl px-3 py-2 text-sm font-medium transition tap-target ${
              pathname.startsWith("/account")
                ? "bg-eat-soft text-eat-blue"
                : "text-eat-muted hover:text-eat-blue hover:bg-eat-soft"
            }`}
          >
            Account
          </Link>
          <Button href="/order" className="ml-2 px-5 py-2.5">
            Order Now
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/account/notifications"
            className="relative rounded-xl p-2 text-eat-muted tap-target"
            aria-label="Notifications"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unread > 0 && (
              <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-eat-red" />
            )}
          </Link>
          <Button href="/order" className="tap-target px-4 py-2">
            Order Now
          </Button>
        </div>
      </div>
    </header>
  );
}
