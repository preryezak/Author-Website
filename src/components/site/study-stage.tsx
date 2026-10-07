/**
 * The study guide, fanned out: the series cover with real pages from week 1 around it
 * (This Week at a Glance, The Passages, Five Questions, the Daily Episodes).
 * Pure CSS, positions are percentages of the stage width so it scales to any screen.
 */
const CARDS = [
  { cls: "sx-d", src: "/images/study/g-daily.webp" },
  { cls: "sx-a", src: "/images/study/g-glance.webp" },
  { cls: "sx-p", src: "/images/study/g-passages.webp" },
  { cls: "sx-q", src: "/images/study/g-questions.webp" },
];

export default function StudyStage() {
  return (
    <div className="study-stage" role="img" aria-label="The Devotion in Season study guide cover with pages from week 1 fanned beside it">
      <div className="study-stage__glow" aria-hidden="true" />
      <div className="study-stage__canvas" aria-hidden="true">
        {CARDS.map((c) => (
          <img key={c.cls} className={`sx ${c.cls}`} src={c.src} alt="" width={460} height={595} loading="eager" decoding="async" />
        ))}
        <img className="sx sx-c" src="/images/study/cover-600.webp" alt="" width={600} height={800} loading="eager" decoding="async" fetchPriority="high" />
      </div>
      <ul className="stage-legend" aria-hidden="true">
        <li>The passages</li>
        <li>Five questions</li>
        <li>One practice</li>
        <li>A prayer</li>
      </ul>
    </div>
  );
}
