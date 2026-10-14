import { DAY1_FULL } from "@/lib/site-content";
import { ArrowRight } from "@/components/site/ui-bits";
import { DayOneEnhancer } from "@/components/site/home-islands";
import { BuyButton } from "@/components/site/checkout";
import DayOneSignup from "@/components/site/day-one-signup";

/**
 * The full Day 1, readable on the page, shared by the home page and the book and
 * ad pages. Ends with the Formation Bundle and a free sign-up for Days 2 and 3
 * by email, so a visitor who is not ready to buy can still be reached again.
 */
export default function DayOneReader({ open = false }: { open?: boolean }) {
  return (
    <div id="day-one" style={{ marginTop: 32, scrollMarginTop: 110 }}>
      <DayOneEnhancer targetId="day-one" detailsId="day-one-reader" />
      <details id="day-one-reader" open={open} className="faq-item" style={{ borderTop: "1px solid var(--border)", borderBottom: "none", background: "var(--paper-50)" }}>
        <summary style={{ fontSize: "clamp(20px, 2.2vw, 26px)", justifyContent: "space-between", padding: "20px 24px" }}>
          <span>Read the full Day 1: Following to Lead</span>
        </summary>
        <div className="faq-body" style={{ maxWidth: "none", padding: "0 0 24px" }}>
          <div className="reader" data-reader>
            <div className="reader__chrome">
              <span className="reader__book">The Influential Spirit</span>
              <span className="reader__sep">§</span>
              <span className="reader__where">{DAY1_FULL.day}</span>
              <span className="reader__spacer" />
              <span className="reader__library">{DAY1_FULL.library}</span>
            </div>
            <div className="reader__progress"><span className="reader__progress-fill" /></div>
            <div className="reader__page" data-reader-page tabIndex={0} aria-label="Day 1 reading">
              <div className="reader__page-inner">
                <p className="reader__eyebrow">{DAY1_FULL.day}</p>
                <h3 className="reader__title">{DAY1_FULL.title}</h3>
                <div className="reader__scripture"><p>{DAY1_FULL.scripture}</p><cite>{DAY1_FULL.scriptureRef}</cite></div>
                {DAY1_FULL.reading.map((p, i) => (<p key={`r${i}`} className={`reader__prose${i === 0 ? " reader__prose--lead" : ""}`}>{p}</p>))}
                {DAY1_FULL.movements.map((mv, mi) => (
                  <div key={`m${mi}`}>
                    <h4 className="reader__subhead">{mv.title}</h4>
                    {mv.paras.map((p, pi) => (<p key={`p${pi}`} className="reader__prose">{p}</p>))}
                  </div>
                ))}
                <hr className="reader__rule" />
                <h4 className="reader__subhead reader__subhead--section">Walking It Out</h4>
                <div className="reader__callout"><div className="reader__callout-key">{DAY1_FULL.reflectionLabel}</div><p className="reader__prose" style={{ fontStyle: "italic" }}>{DAY1_FULL.reflectionQuestion}</p></div>
                <div className="reader__callout"><div className="reader__callout-key">{DAY1_FULL.challengeLabel}</div><p className="reader__prose">{DAY1_FULL.challengeBody}</p></div>
                <div className="reader__callout reader__callout--prayer"><div className="reader__callout-key">{DAY1_FULL.prayerLabel}</div><p className="reader__prose">{DAY1_FULL.prayerBody}</p></div>
                <div className="reader__callout reader__callout--declaration"><div className="reader__callout-key">{DAY1_FULL.declarationLabel}</div><p className="reader__prose">{DAY1_FULL.declarationBody}</p></div>
                <div className="reader__further"><span className="reader__further-key">{DAY1_FULL.furtherReadingLabel}</span>{DAY1_FULL.furtherReading}</div>
                <div className="reader__end">
                  <div className="reader__end-orn"><span className="reader__end-rule" /><span className="reader__end-mark">§</span><span className="reader__end-rule" /></div>
                  <p className="reader__prose--closer">{DAY1_FULL.closer}</p>
                  <div className="flex-wrap-gap gap-4" style={{ justifyContent: "center", marginTop: 16 }}>
                    <BuyButton edition="formation" className="btn btn-primary">Continue with the Formation Bundle</BuyButton>
                    <a className="reader__end-cta" href="#editions">See all editions <ArrowRight /></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="reader__foot"><span>Scroll to keep reading ↓</span><span>{DAY1_FULL.library}</span></div>
          </div>
        </div>
      </details>
      <DayOneSignup />
    </div>
  );
}
