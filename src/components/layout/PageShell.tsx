import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <>
      <Header />
      <main className={`flex-1 ${className}`}>{children}</main>
      <Footer />
    </>
  );
}
