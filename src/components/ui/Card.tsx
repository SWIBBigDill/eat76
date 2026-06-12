import { type ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
};

const paddingMap = {
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

export function Card({ children, className = "", padding = "md" }: CardProps) {
  return (
    <div className={`eat-card ${paddingMap[padding]} ${className}`}>
      {children}
    </div>
  );
}
