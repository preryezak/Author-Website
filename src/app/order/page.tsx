import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import OrderView from "@/components/site/order-view";

export const metadata: Metadata = {
  title: "Your books",
  description: "Your copy of The Influential Spirit.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

/** The buyer's order page. Everything on it is loaded for the token in ?t=, so the static HTML holds nothing private. */
export default function OrderPage() {
  return (
    <SiteShell>
      <main className="section surface-50">
        <div className="container order-container">
          <OrderView />
        </div>
      </main>
    </SiteShell>
  );
}
