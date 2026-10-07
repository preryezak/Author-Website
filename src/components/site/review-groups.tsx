import { REVIEW_GROUPS } from "@/lib/site-content";
import { OrnamentRule } from "@/components/site/ui-bits";

type Item = { readonly quote: string; readonly name: string; readonly role: string };
type G = { readonly eyebrow: string; readonly heading: string; readonly subhead: string; readonly items: readonly Item[] };

function Group({ g }: { g: G }) {
  return (
    <div className="review-group">
      <div className="text-center mx-auto" style={{ maxWidth: 640, marginBottom: 32 }}>
        <span className="eyebrow">{g.eyebrow}</span>
        <h2 className="display" style={{ fontSize: "clamp(26px, 3.2vw, 38px)", marginTop: 8, letterSpacing: "-0.01em" }}>{g.heading}</h2>
        <p className="caption mt-3">{g.subhead}</p>
      </div>
      <div className="grid-12" style={{ gap: 24 }} data-reveal-stagger>
        {g.items.map((r, i) => (
          <figure className={`col-6 review-card review-card--${i % 2 === 0 ? "a" : "b"}`} key={r.name}>
            <div className="orn" aria-hidden="true">“</div>
            <blockquote>{r.quote}</blockquote>
            <figcaption><span className="reviewer-name">{r.name}</span><span className="reviewer-role">{r.role}</span></figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/** Praise for the work, praise for the first edition, and an invitation to review. Server component. */
export default function ReviewGroups({ id = "reviews" }: { id?: string }) {
  const inv = REVIEW_GROUPS.invite;
  return (
    <section id={id} className="section surface-50" data-reveal>
      <div className="container">
        <Group g={REVIEW_GROUPS.work as unknown as G} />
        <OrnamentRule>§</OrnamentRule>
        <div style={{ height: 24 }} />
        <Group g={REVIEW_GROUPS.first as unknown as G} />
        <div className="invite-card mx-auto">
          <span className="eyebrow">{inv.eyebrow}</span>
          <h3 className="display">{inv.title}</h3>
          <p>{inv.body}</p>
          <p>{inv.emailLead} <a href={`mailto:${inv.email}?subject=My%20review%20of%20The%20Influential%20Spirit`}>{inv.email}</a>.</p>
        </div>
      </div>
    </section>
  );
}
