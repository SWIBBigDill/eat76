import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <PageShell className="pb-20 md:pb-0">
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <LogoMark size={72} />
        <p className="mt-6 text-sm font-bold uppercase tracking-wide text-eat-red">404</p>
        <h1 className="mt-2 text-2xl font-bold text-eat-ink">Page not found</h1>
        <p className="mt-2 max-w-md text-sm text-eat-muted">
          That link may be outdated. Head back to order local or browse restaurants near 19348.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/order">Browse restaurants</Button>
          <Button href="/" variant="outline">
            Back to home
          </Button>
        </div>
        <p className="mt-8 text-xs text-eat-muted">
          Need help?{" "}
          <Link href="mailto:support@eat76.com" className="font-semibold text-eat-blue hover:underline">
            support@eat76.com
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
