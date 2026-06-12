"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const ASKED_KEY = "eat76-pwa-install-asked";
const SHOW_DELAY_MS = 10_000;

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari exposes navigator.standalone instead of display-mode
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * One-time install prompt. Waits until the visitor has been on the site a
 * moment, asks exactly once, and never comes back after any answer (install,
 * not now, or the native dialog being dismissed). On iOS, where browsers have
 * no install event, it shows a one-time Add to Home Screen hint instead.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(ASKED_KEY)) return;
    if (isStandalone()) return;

    const markAsked = () => localStorage.setItem(ASKED_KEY, "1");

    const onInstalled = () => {
      markAsked();
      setVisible(false);
    };
    window.addEventListener("appinstalled", onInstalled);

    let showTimer: number | undefined;

    if (isIos()) {
      showTimer = window.setTimeout(() => {
        setIosHint(true);
        setVisible(true);
      }, SHOW_DELAY_MS);
      return () => {
        window.removeEventListener("appinstalled", onInstalled);
        window.clearTimeout(showTimer);
      };
    }

    const handler = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      setDeferred(promptEvent);
      showTimer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
      if (showTimer) window.clearTimeout(showTimer);
    };
  }, []);

  async function handleInstall() {
    if (!deferred) return;
    // One answer is all we ask for; never prompt again either way.
    localStorage.setItem(ASKED_KEY, "1");
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    setDeferred(null);
  }

  function handleDismiss() {
    localStorage.setItem(ASKED_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[45] md:bottom-6 md:left-auto md:right-6 md:max-w-sm">
      <div className="rounded-2xl border border-eat-border bg-white p-4 shadow-xl">
        <p className="text-sm font-bold text-eat-ink">
          {iosHint ? "Add Eat76 to your home screen" : "Install Eat76"}
        </p>
        <p className="mt-1 text-xs text-eat-muted">
          {iosHint
            ? "Tap the Share button, then choose Add to Home Screen for one-tap local ordering."
            : "Add to your home screen for faster local ordering."}
        </p>
        <div className="mt-3 flex gap-2">
          {!iosHint && (
            <Button className="flex-1 py-2.5 text-sm" onClick={() => void handleInstall()}>
              Install
            </Button>
          )}
          <Button
            variant={iosHint ? "primary" : "ghost"}
            className={`py-2.5 text-sm ${iosHint ? "flex-1" : ""}`}
            onClick={handleDismiss}
          >
            {iosHint ? "Got it" : "Not now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
