import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
};

const sizes = {
  sm: 36,
  md: 44,
  lg: 56,
};

export function Logo({ size = "md", showText = false }: LogoProps) {
  const px = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Eat76 home">
      <LogoMark size={px} />
      {showText && (
        <span className="font-bold text-eat-blue text-lg tracking-tight">
          Eat76
        </span>
      )}
    </Link>
  );
}
