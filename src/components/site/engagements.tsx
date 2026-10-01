
import { SPEAKING } from "@/lib/site-content";

/**
 * Selected Engagements.
 *
 * Previously three identical cards (`speaking-card--a` three times), which read
 * as one flat block. The three now alternate: the first leads with a top rule
 * and a heavier title, the second sits on the middle tint with a gold device,
 * the third closes on the deeper tint with the forest accent. One emphasis
 * device per card, and no decorative numbering.
 *
 * Shared by the home page and the Speaking route so the treatment cannot drift.
 */
const VARIANTS = ["engagement-card--lead", "engagement-card--mid", "engagement-card--deep"] as const;

export default function EngagementsGrid({ headingLevel = 3 }: { headingLevel?: 3 | 4 }) {
  const H = headingLevel === 4 ? "h4" : "h3";
  return (
    <div className="engagements-grid">
      {SPEAKING.engagements.map((e, i) => (
        <article className={`engagement-card ${VARIANTS[i % VARIANTS.length]}`} key={i}>
          <span className="engagement-card__rule" aria-hidden="true" />
          <H className="engagement-card__title">{e.event}</H>
          <p className="engagement-card__note">{e.note}</p>
        </article>
      ))}
    </div>
  );
}
