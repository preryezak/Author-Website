import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { GiveManage } from "@/components/site/give-status";

export const metadata: Metadata = { title: "Your giving", robots: { index: false, follow: false } };
export const dynamic = "force-static";

export default function Page() {
  return (
    <SiteShell active="/give">
      <main className="section surface-50">
        <div className="container order-container">
          <GiveManage />
        </div>
      </main>
    </SiteShell>
  );
}
