import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-eat-border bg-eat-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center">
        <Logo size="sm" />
        <p className="text-sm font-semibold text-eat-blue">
          Freedom from big delivery.
        </p>
        <p className="text-sm text-eat-muted">
          Launching first in <span className="font-semibold text-eat-ink">19348</span>
        </p>
        <p className="text-xs text-eat-muted">
          © {new Date().getFullYear()} Eat76. Local-first delivery.
        </p>
      </div>
    </footer>
  );
}
