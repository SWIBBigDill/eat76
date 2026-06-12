import { PageShell } from "@/components/layout/PageShell";
import { OrderBrowse } from "@/components/order/OrderBrowse";

export default function OrderPage() {
  return (
    <PageShell className="pb-20 md:pb-0">
      <OrderBrowse />
    </PageShell>
  );
}
