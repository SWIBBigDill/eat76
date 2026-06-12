"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "eat76-pwa-install-dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    setDeferred(null);
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[45] md:bottom-6 md:left-auto md:right-6 md:max-w-sm">
      <div className="rounded-2xl border border-eat-border bg-white p-4 shadow-xl">
        <p className="text-sm font-bold text-eat-ink">Install Eat76</p>
        <p className="mt-1 text-xs text-eat-muted">
          Add to your home screen for faster local ordering.
        </p>
        <div className="mt-3 flex gap-2">
          <Button className="flex-1 py-2.5 text-sm" onClick={() => void handleInstall()}>
            Install
          </Button>
          <Button variant="ghost" className="py-2.5 text-sm" onClick={handleDismiss}>
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}
