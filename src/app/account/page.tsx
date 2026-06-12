"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { OrderHistoryPanel } from "@/components/order/OrderHistoryPanel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCart } from "@/context/CartContext";
import {
  loadCustomerProfile,
  requestMagicLink,
  signOutEverywhere,
  syncProfileFromSupabase,
  type CustomerProfile,
} from "@/lib/customer-profile";
import { DEFAULT_DELIVERY_ADDRESS } from "@/lib/delivery-address";
import { loadFavoriteIds } from "@/lib/favorites";
import {
  loadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  unreadNotificationCount,
  type AppNotification,
} from "@/lib/notifications";
import { getRestaurantById } from "@/data/restaurants";

export default function AccountPage() {
  const [profile, setProfile] = useState<CustomerProfile>(() => loadCustomerProfile());
  const [emailInput, setEmailInput] = useState("");
  const [signInMessage, setSignInMessage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => loadFavoriteIds());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadNotifications());
  const [unread, setUnread] = useState(() => unreadNotificationCount());
  const { deliveryAddress, setDeliveryAddress } = useCart();

  const refresh = useCallback(() => {
    setProfile(loadCustomerProfile());
    setFavorites(loadFavoriteIds());
    setNotifications(loadNotifications());
    setUnread(unreadNotificationCount());
  }, []);

  useEffect(() => {
    let cancelled = false;
    void syncProfileFromSupabase().then((synced) => {
      if (!cancelled && synced) setProfile(synced);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    setSignInMessage("Sending...");
    const result = await requestMagicLink(emailInput);
    setSignInMessage(result.message);
    if (result.sent) {
      refresh();
      setEmailInput("");
    }
  }

  async function handleSignOut() {
    await signOutEverywhere();
    refresh();
    setSignInMessage(null);
  }

  function handleMarkRead(id: string) {
    markNotificationRead(id);
    refresh();
  }

  function handleMarkAllRead() {
    markAllNotificationsRead();
    refresh();
  }

  return (
    <PageShell className="pb-20 md:pb-0">
      <section className="eat-section">
        <div className="mx-auto max-w-lg px-4">
          <SectionHeading
            title="Your account"
            subtitle="Profile, delivery address, favorites, and order updates saved on this device."
          />

          <Card className="mt-8">
            {profile.signedIn ? (
              <div>
                <p className="text-sm font-semibold text-eat-ink">{profile.name}</p>
                <p className="text-sm text-eat-muted">{profile.email}</p>
                {profile.signedInAt && (
                  <p className="mt-1 text-xs text-eat-muted">
                    Signed in {new Date(profile.signedInAt).toLocaleDateString()}
                  </p>
                )}
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => void handleSignOut()}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-3">
                <p className="text-sm text-eat-muted">
                  Sign in with your email. We send a one-time sign-in link, no password needed.
                </p>
                <Input
                  label="Email"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
                <Button type="submit" className="w-full">
                  Continue with email
                </Button>
                {signInMessage && (
                  <p className="text-xs text-eat-muted" role="status">
                    {signInMessage}
                  </p>
                )}
              </form>
            )}
          </Card>

          <Card className="mt-6">
            <h2 className="text-base font-bold text-eat-ink">Delivery address</h2>
            <p className="mt-1 text-xs text-eat-muted">Used at checkout. Must include a supported ZIP.</p>
            <Input
              label="Address"
              className="mt-1"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder={DEFAULT_DELIVERY_ADDRESS}
            />
          </Card>

          <Card className="mt-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-eat-ink">Notifications</h2>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-eat-blue hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="mt-3 text-sm text-eat-muted">
                Order updates appear here after you place an order.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {notifications.slice(0, 8).map((n) => (
                  <li
                    key={n.id}
                    className={`rounded-xl border px-3 py-2.5 text-sm ${
                      n.read ? "border-eat-border" : "border-eat-blue/30 bg-eat-soft"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-eat-ink">{n.title}</p>
                        <p className="text-xs text-eat-muted">{n.message}</p>
                        {n.orderId && (
                          <Link
                            href={`/order/track/${n.orderId}`}
                            className="mt-1 inline-block text-xs font-semibold text-eat-blue hover:underline"
                          >
                            Track order
                          </Link>
                        )}
                      </div>
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(n.id)}
                          className="shrink-0 text-xs font-semibold text-eat-blue"
                        >
                          Read
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="mt-6">
            <h2 className="text-base font-bold text-eat-ink">Favorite restaurants</h2>
            {favorites.length === 0 ? (
              <p className="mt-3 text-sm text-eat-muted">
                Tap the heart on a restaurant card to save favorites.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {favorites.map((id) => {
                  const restaurant = getRestaurantById(id);
                  if (!restaurant) return null;
                  return (
                    <li key={id}>
                      <Link
                        href={`/order/${id}`}
                        className="flex items-center justify-between rounded-xl border border-eat-border px-3 py-2.5 transition hover:border-eat-blue/40 hover:bg-eat-soft"
                      >
                        <span className="font-semibold text-eat-ink">{restaurant.name}</span>
                        <span className="text-xs text-eat-muted">{restaurant.foodType}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <div className="mt-6">
            <OrderHistoryPanel />
          </div>

          <Card className="mt-6">
            <h2 className="text-base font-bold text-eat-ink">Support</h2>
            <p className="mt-2 text-sm text-eat-muted">
              Questions about an order, fees, or partnering with Eat76?
            </p>
            <a
              href="mailto:support@eat76.com"
              className="mt-3 inline-block text-sm font-semibold text-eat-blue hover:underline"
            >
              support@eat76.com
            </a>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Link href="/privacy" className="text-eat-muted hover:text-eat-blue">
                Privacy policy
              </Link>
              <Link href="/terms" className="text-eat-muted hover:text-eat-blue">
                Terms of service
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
