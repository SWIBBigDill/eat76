"use client";

import Link from "next/link";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  loadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
} from "@/lib/notifications";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    loadNotifications()
  );

  function handleMarkRead(id: string) {
    markNotificationRead(id);
    setNotifications(loadNotifications());
  }

  function handleMarkAllRead() {
    markAllNotificationsRead();
    setNotifications(loadNotifications());
  }

  return (
    <PageShell className="pb-24 md:pb-8">
      <section className="eat-section">
        <div className="mx-auto max-w-2xl px-4">
          <Link
            href="/account"
            className="text-sm font-semibold text-eat-blue hover:underline"
          >
            ← Account
          </Link>
          <div className="mt-4 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-eat-ink">Notifications</h1>
            {notifications.some((n) => !n.read) && (
              <Button variant="ghost" className="text-sm tap-target" onClick={handleMarkAllRead}>
                Mark all read
              </Button>
            )}
          </div>
          <p className="mt-1 text-sm text-eat-muted">
            Order updates and alerts from this device.
          </p>

          {notifications.length === 0 ? (
            <Card className="mt-8 text-center py-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-eat-soft">
                <svg className="h-8 w-8 text-eat-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="font-semibold text-eat-ink">No notifications yet</p>
              <p className="mt-1 text-sm text-eat-muted">
                Place an order to see live updates here.
              </p>
              <Button href="/order" className="mt-4 tap-target">
                Browse restaurants
              </Button>
            </Card>
          ) : (
            <ul className="mt-6 space-y-2">
              {notifications.map((n) => (
                <li key={n.id}>
                  <Card
                    padding="sm"
                    className={`transition ${n.read ? "opacity-70" : "border-eat-blue/30 bg-eat-soft/30"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-eat-ink">{n.title}</p>
                        <p className="mt-0.5 text-sm text-eat-muted">{n.message}</p>
                        <p className="mt-1 text-xs text-eat-muted">{formatTime(n.createdAt)}</p>
                        {n.orderId && (
                          <Link
                            href={`/order/track/${n.orderId}`}
                            className="mt-2 inline-block text-xs font-semibold text-eat-blue"
                          >
                            View order →
                          </Link>
                        )}
                      </div>
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(n.id)}
                          className="shrink-0 text-xs font-semibold text-eat-blue tap-target"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PageShell>
  );
}
