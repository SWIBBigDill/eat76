"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { OrderHistoryPanel } from "@/components/order/OrderHistoryPanel";
import { AddressInput } from "@/components/ui/AddressInput";
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
import { ZipConfirmation } from "@/components/account/ZipConfirmation";
import { DEFAULT_DELIVERY_ADDRESS } from "@/lib/delivery-address";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";
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

  async function handleGoogleSignIn() {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setSignInMessage("Sign-in is not available right now. Try the email link below.");
      return;
    }
    setSignInMessage("Opening Google sign-in...");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/account`,
        },
      });
      if (error) {
        setSignInMessage(
          "Google sign-in is not set up yet. Use the email link below instead."
        );
      }
    } catch {
      setSignInMessage(
        "Google sign-in is not set up yet. Use the email link below instead."
      );
    }
  }

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
              <div className="space-y-4">
                {isSupabaseConfigured() && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => void handleGoogleSignIn()}
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fill="#4285F4"
                            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.27 14.29A7.18 7.18 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
                          />
                        </svg>
                        Continue with Google
                      </span>
                    </Button>
                    <div className="flex items-center gap-3">
                      <span className="h-px flex-1 bg-eat-border" />
                      <span className="text-xs font-medium text-eat-muted">or</span>
                      <span className="h-px flex-1 bg-eat-border" />
                    </div>
                  </>
                )}
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
              </div>
            )}
          </Card>

          <Card className="mt-6">
            <h2 className="text-base font-bold text-eat-ink">Delivery address</h2>
            <p className="mt-1 text-xs text-eat-muted">Used at checkout. Must include a supported ZIP.</p>
            <AddressInput
              label="Address"
              className="mt-1"
              value={deliveryAddress}
              onAddressChange={setDeliveryAddress}
              placeholder={DEFAULT_DELIVERY_ADDRESS}
            />
            <ZipConfirmation address={deliveryAddress} />
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
