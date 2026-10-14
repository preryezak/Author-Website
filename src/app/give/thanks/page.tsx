import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { GiveThanks } from "@/components/site/give-status";

export const metadata: Metadata = { title: "Thank you", robots: { index: false, follow: false } };
export const dynamic = "force-static";

export default function Page() {
  return (
    <SiteShell active="/give">
      <main className="section surface-50">
        <div className="container order-container">
          <GiveThanks />
        </div>
      </main>
    </SiteShell>
  );
}
