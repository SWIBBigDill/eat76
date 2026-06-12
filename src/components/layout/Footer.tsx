import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

type FooterProps = {
  className?: string;
};

const partnerLinks = [
  { href: "/restaurants", label: "Restaurant partners" },
  { href: "/drivers", label: "Drive with Eat76" },
  { href: "/pricing", label: "Pricing" },
  { href: "/admin", label: "Admin demo" },
];

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`mt-auto border-t border-eat-border bg-eat-soft ${className}`}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center">
        <Logo size="sm" />
        <p className="text-sm font-semibold text-eat-blue">
          Order local. Know what you pay.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          <Link href="/order" className="font-semibold text-eat-blue hover:underline">
            Order Now
          </Link>
          {partnerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-eat-muted hover:text-eat-blue transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
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
