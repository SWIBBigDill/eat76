import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "accent" | "outline" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-eat-blue text-white hover:bg-eat-blue-dark shadow-sm",
  accent:
    "bg-eat-red text-white hover:bg-eat-red-dark shadow-sm",
  outline:
    "border-2 border-eat-blue text-eat-blue hover:bg-eat-soft",
  ghost:
    "text-eat-blue hover:bg-eat-soft",
};

export function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-50";

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
