"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useActiveOrder } from "@/hooks/useActiveOrder";
import { formatEta } from "@/lib/order-tracking";

const tabs = [
  {
    href: "/",
    label: "Home",
    primary: false,
    icon: (active: boolean) => (
      <svg className="h-6 w-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        {active ? (
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        )}
      </svg>
    ),
  },
  {
    href: "/pricing",
    label: "Savings",
    primary: false,
    icon: (active: boolean) => (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/order",
    label: "Order",
    primary: true,
    icon: (active: boolean) => (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    href: "",
    label: "More",
    primary: false,
    isMore: true,
    icon: (active: boolean) => (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
];

const moreLinks = [
  { href: "/account", label: "Your account", description: "Profile, orders, and notifications" },
  { href: "/account", label: "Your account", description: "Profile, favorites, order history" },
  { href: "/restaurants", label: "Restaurant partners", description: "Join as a restaurant" },
  { href: "/drivers", label: "Drive with Eat76", description: "Apply to deliver locally" },
  { href: "/privacy", label: "Privacy policy", description: "How we handle your data" },
  { href: "/terms", label: "Terms of service", description: "Rules for using Eat76" },
  { href: "/#early-access", label: "Early access waitlist", description: "Customer, restaurant, or driver" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const activeOrder = useActiveOrder();

  const moreActive =
    pathname === "/account" ||
    pathname === "/restaurants" ||
    pathname.startsWith("/restaurants/") ||
    pathname === "/drivers" ||
    pathname.startsWith("/drivers/") ||
    pathname === "/privacy" ||
    pathname === "/terms";

  const trackHref = activeOrder ? `/order/track/${activeOrder.order.id}` : null;

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-eat-border bg-white/95 backdrop-blur md:hidden safe-bottom"
        aria-label="Mobile navigation"
      >
        {trackHref && (
          <Link
            href={trackHref}
            className="mx-3 mb-1 flex min-h-[44px] items-center justify-between gap-2 rounded-full bg-eat-red px-4 py-2 text-white shadow-md transition active:scale-[0.98] tap-target animate-pulse-soft motion-reduce:animate-none"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="truncate text-sm font-bold">Order in progress</span>
            </span>
            <span className="shrink-0 text-xs font-semibold">
              {formatEta(activeOrder?.etaMinutes ?? 0)} →
            </span>
          </Link>
        )}
        <div className="mx-auto flex max-w-lg items-end justify-around px-2 py-1">
          {tabs.map((tab) => {
            if (tab.isMore) {
              return (
                <button
                  key="more"
                  type="button"
                  onClick={() => setMoreOpen(true)}
                  className={`flex min-h-[56px] min-w-[64px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-xs font-semibold transition-colors tap-target ${
                    moreActive || moreOpen ? "text-eat-blue" : "text-eat-muted hover:text-eat-blue"
                  }`}
                >
                  {tab.icon(moreActive || moreOpen)}
                  <span>{tab.label}</span>
                </button>
              );
            }

            const active =
              tab.href === "/"
                ? pathname === "/"
                : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

            if (tab.primary) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="-mt-3 flex min-h-[64px] min-w-[72px] flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl bg-eat-blue px-3 py-2 text-xs font-bold text-white shadow-lg transition-transform active:scale-95 tap-target"
                  aria-current={active ? "page" : undefined}
                >
                  {tab.icon(active)}
                  <span>{tab.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex min-h-[56px] min-w-[64px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-xs font-semibold transition-colors tap-target ${
                  active ? "text-eat-blue" : "text-eat-muted hover:text-eat-blue"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {tab.icon(active)}
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="More options">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[70vh] overflow-y-auto animate-slide-up rounded-t-3xl bg-white pb-[calc(env(safe-area-inset-bottom)+80px)] shadow-2xl">
            <div className="mx-auto max-w-lg px-4 pt-4">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-eat-border" />
              <p className="mb-4 text-lg font-bold text-eat-ink">Partner with Eat76</p>
              <div className="space-y-2">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex flex-col rounded-2xl border border-eat-border px-4 py-3 transition hover:border-eat-blue/40 hover:bg-eat-soft tap-target"
                  >
                    <span className="font-semibold text-eat-ink">{link.label}</span>
                    <span className="text-sm text-eat-muted">{link.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
