import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { OrnamentRule } from "@/components/site/ui-bits";

/**
 * Where Selar sends Reader Edition buyers after payment (Selar > product >
 * "redirect the buyer to an external URL"). The free Selar plan allows one file
 * per single product, so the two short guides that come with the Reader Edition
 * are served from R2 (free/) by worker/reader.ts. Not indexed.
 */
export const metadata: Metadata = {
  title: "Welcome, reader",
  description: "Your two guides for The Influential Spirit, and how to open the book.",
  alternates: { canonical: "/welcome" },
  robots: { index: false, follow: false },
};

const FILES = [
  { href: "/free/The_Influential_Spirit_Start_Here.pdf", name: "Start Here", desc: "What is in your edition and a simple rhythm for each morning." },
  { href: "/free/Use_it_with_your_church_or_team.pdf", name: "Use it with your church or team", desc: "How to read the thirty days together with a small group, a staff team or a church." },
];

export default function WelcomePage() {
  return (
    <SiteShell active="/influential-spirit">
      <section className="section surface-100">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 720 }}>
            <span className="eyebrow">The Influential Spirit</span>
            <h1 className="page-head__title">Thank you, and welcome.</h1>
            <OrnamentRule>§</OrnamentRule>
            <p className="privacy-para">
              Your book is ready in your Selar library. Open the email from Selar or sign in at selar.com with the email you used to pay, and read it on your phone, tablet or computer.
            </p>
            <p className="privacy-para">Your two guides are below. Save them to keep.</p>
            <ul className="welcome-files" style={{ listStyle: "none", padding: 0, margin: "20px 0" }}>
              {FILES.map((f) => (
                <li key={f.href} style={{ marginBottom: 16 }}>
                  <a className="btn btn-primary" href={f.href} download>{f.name}</a>
                  <p className="caption" style={{ marginTop: 6 }}>{f.desc}</p>
                </li>
              ))}
            </ul>
            <p className="caption">
              If a file will not open, write to hello@eryezakalalu.com with the email you used to pay and we will send it again.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
