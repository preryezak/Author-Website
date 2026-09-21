"use client";

import { useEffect, useRef, useState, type SVGProps } from "react";
import {
  SITE, NAV, HERO, FLAGSHIP, FEATURED_BOOK, WHY_THIS_BOOK, AUTHOR_LETTER,
  DISCOVER, LIBRARY, PODCAST, NEWSLETTER, THIRTY_DAYS, DAY1_FULL, PILLARS,
  THE_DAYS, EDITIONS, REVIEWS, FAQ, WHATS_NEXT, ABOUT, SPEAKING, PRIVACY,
} from "@/lib/site-content";
import SpeakingInviteForm from "@/components/site/speaking-invite-form";

function PlatformIcon({ name }: { name: string }) {
  const c: SVGProps<SVGSVGElement> = { viewBox: "0 0 24 24", "aria-hidden": true };
  switch (name) {
    case "Spotify": return (<svg {...c} fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.65 14.52a.62.62 0 0 1-.86.21c-2.36-1.44-5.32-1.77-8.82-1a.62.62 0 1 1-.28-1.22c3.82-.87 7.09-.49 9.71 1.11a.62.62 0 0 1 .25.9Zm1.24-2.77a.78.78 0 0 1-1.07.26c-2.7-1.66-6.82-2.14-10.02-1.17a.78.78 0 1 1-.45-1.5c3.65-1.1 8.19-.57 11.25 1.34a.78.78 0 0 1 .29 1.07Zm.11-2.88c-3.24-1.93-8.6-2.11-11.7-1.17a.94.94 0 1 1-.55-1.8c3.55-1.08 9.47-.87 13.19 1.34a.94.94 0 0 1-.94 1.63Z" /></svg>);
    case "Apple Podcasts": return (<svg {...c} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="2.2" fill="currentColor" stroke="none" /><path d="M9.2 14.4c.8-.5 1.7-.7 2.8-.7s2 .2 2.8.7l-1 5c-.1.5-.6.9-1.1.9h-1.4c-.5 0-1-.4-1.1-.9l-1-5Z" fill="currentColor" stroke="none" /><path d="M7.4 12.4a5 5 0 1 1 9.2 0" /><path d="M5.6 12.4a7 7 0 1 1 12.8 0" /></svg>);
    case "iHeart": return (<svg {...c} fill="currentColor"><path d="M12 21s-7.5-4.5-9.5-9.4A5.5 5.5 0 0 1 12 6.5a5.5 5.5 0 0 1 9.5 5.1C19.5 16.5 12 21 12 21Z" /></svg>);
    case "Castbox": return (<svg {...c} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="6" width="17" height="13" rx="1.2" /><path d="M3.5 9.5h17" /><path d="M8 3.5l4 3 4-3" /></svg>);
    case "Amazon Music": return (<svg {...c} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><path d="M12 4v6" /><path d="M4 18c2.5 1.5 5 2 8 2s5.5-.5 8-2" /></svg>);
    case "Audible": return (<svg {...c} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M6 12l6-4 6 4" fill="currentColor" stroke="none" /><path d="M4.5 15h15" /></svg>);
    default: return null;
  }
}
function OrnamentRule({ children }: { children?: React.ReactNode }) {
  return (<div className="ornament-rule" aria-hidden="true"><span>{children ?? "§"}</span></div>);
}
function ArrowRight() {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--gold-200)" }}><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></svg>);
}
type LetterItem = { title: string; link: string; pubDate: string; description: string };
type EpisodeItem = { title: string; link: string; pubDate: string };
function fmtDate(iso: string) {
  try { const d = new Date(iso); if (isNaN(d.getTime())) return ""; return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); } catch { return ""; }
}

/* Render **bold** and *italic* markers in the About bio */
function renderRich(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  text.split("**").forEach((bp, bi) => {
    if (bi % 2 === 1) { out.push(<strong key={`b${bi}`}>{bp}</strong>); return; }
    bp.split("*").forEach((ip, ii) => {
      if (ii % 2 === 1) out.push(<em key={`i${bi}-${ii}`}>{ip}</em>);
      else if (ip) out.push(<span key={`t${bi}-${ii}`}>{ip}</span>);
    });
  });
  return out;
}

/* ==================================================================== */
export default function SitePage({
  letters: initialLetters = [],
  episodes: initialEpisodes = [],
}: {
  letters?: LetterItem[];
  episodes?: EpisodeItem[];
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [day1Open, setDay1Open] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [cookieSeen, setCookieSeen] = useState(false);
  const [editionsRegion, setEditionsRegion] = useState<"usd" | "ugx">("usd");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  // Supplied by the server component at build time (static export): there is no
  // runtime /api/letters or /api/episodes route on Cloudflare Pages.
  const letters: LetterItem[] | null = initialLetters.length ? initialLetters : [];
  const episodes: EpisodeItem[] | null = initialEpisodes.length ? initialEpisodes : [];
  const mastheadRef = useRef<HTMLElement>(null);

  const openDay1 = () => {
    setDay1Open(true);
    requestAnimationFrame(() => document.getElementById("day-one")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "IntersectionObserver" in window) {
      document.documentElement.classList.add("js-reveal");
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-stagger]"));
      const mark = (el: Element) => el.classList.add("is-visible");
      const vh = window.innerHeight;
      els.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < vh && r.bottom > 0) mark(el); });
      const obs = new IntersectionObserver((entries) => { entries.forEach((e) => { if (e.isIntersecting) { mark(e.target); obs.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      els.forEach((el) => obs.observe(el));
      const safety = setTimeout(() => { els.forEach(mark); obs.disconnect(); }, 800);
      return () => { clearTimeout(safety); obs.disconnect(); };
    }
  }, [editionsRegion, day1Open, inviteOpen]);
  useEffect(() => {
    const onScroll = () => { const m = mastheadRef.current; if (!m) return; if (window.scrollY > 16) m.classList.add("is-scrolled"); else m.classList.remove("is-scrolled"); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setDrawerOpen(false);
    window.addEventListener("keydown", onKey); window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, []);
  // Letters and episodes are fetched at build time in src/app/page.tsx and
  // passed in as props (static export has no runtime API routes).
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>("[data-sticky-bar]"); if (!bar) return;
    const editions = document.getElementById("editions");
    const tick = () => { const top = window.scrollY; let vis = false; if (editions) { const r = editions.getBoundingClientRect(); vis = r.top < window.innerHeight && r.bottom > 0; } const show = top > 400 && !vis; bar.style.transform = show ? "translateY(0)" : "translateY(100%)"; bar.style.opacity = show ? "1" : "0"; bar.style.pointerEvents = show ? "auto" : "none"; };
    tick(); window.addEventListener("scroll", tick, { passive: true }); window.addEventListener("resize", tick);
    return () => { window.removeEventListener("scroll", tick); window.removeEventListener("resize", tick); };
  }, []);
  useEffect(() => {
    const pages = Array.from(document.querySelectorAll<HTMLElement>("[data-reader-page]")); if (!pages.length) return;
    const update = (page: HTMLElement) => { const reader = page.closest("[data-reader]"); const fill = reader ? reader.querySelector<HTMLElement>(".reader__progress-fill") : null; if (!fill) return; const max = page.scrollHeight - page.clientHeight; const pct = max > 0 ? (page.scrollTop / max) * 100 : 0; fill.style.width = `${Math.min(100, Math.max(0, pct))}%`; };
    const onScroll = (e: Event) => update(e.currentTarget as HTMLElement);
    pages.forEach((page) => { page.addEventListener("scroll", onScroll, { passive: true }); update(page); });
    return () => pages.forEach((page) => page.removeEventListener("scroll", onScroll));
  }, [day1Open]);

  useEffect(() => {
    try { if (localStorage.getItem("ek-cookie-choice")) return; } catch {}
    const t = setTimeout(() => setCookieSeen(true), 900);
    return () => clearTimeout(t);
  }, []);

  const chooseCookies = (ok: boolean) => {
    try { localStorage.setItem("ek-cookie-choice", ok ? "accepted" : "declined"); } catch {}
    setCookieSeen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ============ MASTHEAD ============ */}
      <header className="masthead" id="masthead" ref={mastheadRef}>
        <div className="container row">
          <a className="brand" href="#top" aria-label="Eryeza Kalalu, home">
            { }
            <img src="/brand/logo-monogram.svg" alt="" width={40} height={40} />
            <span className="wordmark"><span className="name">Eryeza Kalalu</span><span className="role">{SITE.role}</span></span>
          </a>
          <nav aria-label="Primary">{NAV.map((n) => (<a key={n.href} href={n.href} aria-current={n.href === "#top" ? "page" : undefined}>{n.label}</a>))}</nav>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a className="cta" href="#letter">Subscribe</a>
            <button className="masthead-burger" type="button" aria-label={drawerOpen ? "Close navigation" : "Open navigation"} aria-controls="drawer" aria-expanded={drawerOpen} onClick={() => setDrawerOpen((v) => !v)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{drawerOpen ? (<><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>) : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}</svg>
            </button>
          </div>
        </div>
        <nav id="drawer" hidden={!drawerOpen} style={{ borderTop: "1px solid var(--border)", background: "var(--paper-50)", padding: "12px 0" }}>
          <div className="container" style={{ display: "flex", flexDirection: "column", gap: 4 }}>{NAV.map((n) => (<a key={n.href} href={n.href} onClick={() => setDrawerOpen(false)} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink-500)", textDecoration: "none" }}>{n.label}</a>))}</div>
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        {/* ============ HERO ============ */}
        <section className="section surface-100" data-reveal id="top">
          <div className="container">
            <div className="grid-12" style={{ alignItems: "center", gap: 64 }}>
              <div className="col-7 stack-lg">
                <span className="eyebrow">{HERO.eyebrow}</span>
                <h1 className="display" style={{ fontSize: "clamp(40px, 5vw, 68px)", lineHeight: 1.05, fontWeight: 400, letterSpacing: "-0.02em" }}>{HERO.headline}</h1>
                <p className="body body-lg" style={{ maxWidth: "54ch" }}>{HERO.body}</p>
                <div className="flex-wrap-gap gap-4" style={{ paddingTop: 8 }}>
                  <a className="btn btn-primary" href={HERO.ctaPrimaryHref}>{HERO.ctaPrimary}<ArrowRight /></a>
                  <a className="btn btn-ghost" href={HERO.ctaSecondaryHref}>{HERO.ctaSecondary}</a>
                </div>
              </div>
              <div className="col-5">
                <div className="portrait-frame">
                  <figure className="author-portrait--feathered">
                    { }
                    <img src="/images/author.jpg" alt="Pastor Eryeza Kalalu" />
                  </figure>
                  <div className="portrait-tag">
                    <div className="name">{HERO.portraitName}</div>
                    <div className="loc">{HERO.portraitLoc}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ FEATURED BOOK (real cover in device frame + standout) ============ */}
        <section id="influential-spirit" className="section surface-200 loose" data-reveal>
          <div className="container">
            <div className="featured-book">
              <div className="featured-book__media">
                <div className="device">
                  <span className="device__bezel-mark" aria-hidden="true" />
                  <div className="device__screen">
                    { }
                    <img src="/images/cover.jpg" alt="The Influential Spirit, the actual book front cover" />
                  </div>
                  <div className="device__chrome"><span>Digital edition</span><span className="device__battery" aria-hidden="true" /></div>
                </div>
                <div className="cover-stamp"><span className="orn">§</span>{FLAGSHIP.stampMeta}<strong>{FLAGSHIP.stampTitle}</strong></div>
              </div>
              <div>
                <span className="eyebrow">{FEATURED_BOOK.eyebrow}</span>
                <h2 className="featured-book__title">{FEATURED_BOOK.title}</h2>
                <p className="featured-book__subtitle">{FEATURED_BOOK.subtitle}</p>
                <p className="featured-book__headline">{FEATURED_BOOK.headline}</p>
                {FEATURED_BOOK.paras.map((p, i) => (<p key={i} className="body body-lg" style={{ maxWidth: "60ch", marginTop: i === 0 ? 0 : 16 }}>{p}</p>))}
                
                <p className="featured-book__audience">{FEATURED_BOOK.audience}</p>
                <div className="flex-wrap-gap gap-4" style={{ marginTop: 24 }}>
                  <a className="btn btn-primary" href={FEATURED_BOOK.ctaPrimaryHref}>{FEATURED_BOOK.ctaPrimary}<ArrowRight /></a>
                  <a className="btn btn-ghost" href={FEATURED_BOOK.ctaSecondaryHref}>{FEATURED_BOOK.ctaSecondary}</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ WHY THIS BOOK ============ */}
        <section className="section surface-100" data-reveal>
          <div className="container">
            <div className="mx-auto text-center" style={{ maxWidth: 680 }}>
              <span className="eyebrow">{WHY_THIS_BOOK.eyebrow}</span>
              <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 46px)", marginTop: 8, fontWeight: 400, letterSpacing: "-0.015em" }}>{WHY_THIS_BOOK.heading}</h2>
            </div>
            <OrnamentRule>§</OrnamentRule>
            <div className="grid-12" style={{ gap: 24, marginTop: 16 }} data-reveal-stagger>
              {WHY_THIS_BOOK.cards.map((c, i) => (
                <article className="col-4 why-card" key={i}>
                  <div className="num">{["I", "II", "III"][i]}</div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ WHY I WROTE THIS BOOK (photo + drop-cap letter, no byline name) ============ */}
        <section id="author" className="section surface-50" data-reveal>
          <div className="container">
            <div className="mx-auto" style={{ maxWidth: 760, textAlign: "center" }}>
              <figure className="author-portrait--rounded" style={{ margin: "0 auto 24px" }}>
                { }
                <img src="/images/author.jpg" alt="Pastor Eryeza Kalalu" />
              </figure>
              <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 400, letterSpacing: "-0.015em" }}>{AUTHOR_LETTER.eyebrow}</h2>
              <OrnamentRule>§</OrnamentRule>
              <div className="prose-feature" style={{ textAlign: "left" }}>
                {AUTHOR_LETTER.paras.map((p, i) => (<p key={i} className={`reader__prose${i === 0 ? " reader__prose--lead" : ""}`}>{p}</p>))}
              </div>
              <blockquote className="standout" style={{ maxWidth: "none", marginLeft: 0, marginRight: 0, textAlign: "left" }}>{AUTHOR_LETTER.pullquote}</blockquote>
            </div>
          </div>
        </section>

        {/* ============ WHAT YOU WILL DISCOVER ============ */}
        <section className="section surface-100" data-reveal>
          <div className="container">
            <div className="mx-auto" style={{ maxWidth: 760 }}>
              <span className="eyebrow">{DISCOVER.eyebrow}</span>
              <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 46px)", marginTop: 8, fontWeight: 400, letterSpacing: "-0.015em" }}>{DISCOVER.heading}</h2>
              <OrnamentRule>§</OrnamentRule>
              <div style={{ marginTop: 8 }}>
                {DISCOVER.items.map((it, i) => (
                  <div className="discover-item" key={i}>
                    <div className="mark">{["I", "II", "III", "IV", "V"][i]}</div>
                    <div><h3>{it.title}</h3><p>{it.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ CHRIST FORMS THE PERSON (parchment) ============ */}
        <section className="section surface-parchment" data-reveal>
          <div className="container">
            <div className="mx-auto text-center" style={{ maxWidth: 720, marginBottom: 40 }}>
              <span className="eyebrow">{PILLARS.eyebrow}</span>
              <h2 className="display" style={{ fontSize: "clamp(36px, 4.6vw, 56px)", marginTop: 8, fontWeight: 400, letterSpacing: "-0.02em" }}>{PILLARS.heading}</h2>
            </div>
            <OrnamentRule>❦</OrnamentRule>
            <div className="grid-12" style={{ gap: 32, marginTop: 16 }} data-reveal-stagger>
              {PILLARS.items.map((p) => (
                <article className="col-4 pillar-plate pillar-plate--paper-50" key={p.roman}>
                  <div className="roman">{p.roman}</div>
                  <h3 className="display" style={{ fontSize: 24, fontWeight: 500, marginTop: 8 }}>{p.title}</h3>
                  <p className="body body-sm" style={{ marginTop: 12 }}>{p.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FOLLOWING TO LEAD (sage, Day 1 summary + reader) ============ */}
        <section id="thirtydays" className="section surface-sage" data-reveal>
          <div className="container">
            <div className="mx-auto" style={{ maxWidth: 820 }}>
              <span className="eyebrow">{THIRTY_DAYS.eyebrow}</span>
              <h2 className="display" style={{ fontSize: "clamp(34px, 4vw, 48px)", marginTop: 12, fontWeight: 400, letterSpacing: "-0.015em" }}>{THIRTY_DAYS.heading}</h2>
              <p className="body body-sm" style={{ marginTop: 8, fontStyle: "italic", color: "var(--ink-300)" }}>{THIRTY_DAYS.intro}</p>
              <OrnamentRule>§</OrnamentRule>
              <div className="grid-12" style={{ gap: 32 }} data-reveal-stagger>
                {THIRTY_DAYS.chapters.map((c, i) => (
                  <article className="col-4" key={i} style={{ margin: 0 }}>
                    <div className={`pillar-plate pillar-plate--paper-${i === 1 ? "100" : "50"}`} style={{ height: "100%" }}>
                      <div className="roman">{["I", "II", "III"][i]}</div>
                      <h3 className="display" style={{ fontSize: 24, fontWeight: 500, marginTop: 8 }}>{c.title}</h3>
                      <p className="body body-sm" style={{ marginTop: 12, color: "var(--ink-500)" }}>{c.desc}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div id="day-one" style={{ marginTop: 32, scrollMarginTop: 110 }}>
                <details className="faq-item" open={day1Open} onToggle={(e) => setDay1Open((e.currentTarget as HTMLDetailsElement).open)} style={{ borderTop: "1px solid var(--border)", borderBottom: "none", background: "var(--paper-50)" }}>
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
                      <div className="reader__page" data-reader-page>
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
                              <a className="reader__end-cta" href="#editions">Pre-order the book <ArrowRight /></a>
                              <a className="btn btn-accent btn-sm" href={SITE.excerptUrl} target="_blank" rel="noopener noreferrer">Get the full excerpt in your inbox free</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="reader__foot"><span>Scroll to keep reading ↓</span><span>{DAY1_FULL.library}</span></div>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* ============ THE 30 DAYS ============ */}
        <section className="section surface-100" data-reveal>
          <div className="container">
            <div className="mx-auto" style={{ maxWidth: 820 }}>
              <span className="eyebrow">{THE_DAYS.eyebrow}</span>
              <h2 className="display" style={{ fontSize: "clamp(34px, 4vw, 48px)", marginTop: 8, fontWeight: 400, letterSpacing: "-0.015em" }}>{THE_DAYS.heading}</h2>
              <OrnamentRule>§</OrnamentRule>
              <div className="grid-12" style={{ gap: 32 }} data-reveal-stagger>
                {THE_DAYS.items.map((it, i) => (
                  <article className="col-4" key={i}>
                    <div className={`pillar-plate pillar-plate--paper-${i === 1 ? "200" : "50"}`} style={{ height: "100%" }}>
                      <h3 className="display" style={{ fontSize: 24, fontWeight: 500 }}>{it.title}</h3>
                      <p className="body body-sm" style={{ marginTop: 12 }}>{it.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ EDITIONS (Choose how you want to buy) ============ */}
        <section id="editions" className="section surface-200" data-reveal>
          <div className="container">
            <div className="text-center mx-auto" style={{ maxWidth: 640, marginBottom: 32 }}>
              <span className="eyebrow">{EDITIONS.eyebrow}</span>
              <OrnamentRule>§</OrnamentRule>
              <p className="caption" style={{ marginTop: 8 }}>{EDITIONS.note}</p>
            </div>
            <div className="bundle-band">
              <div className="bundle-digital">
                <div className="bundle-digital__device">
                  <div className="mini-device">
                    { }
                    <img src="/images/cover.jpg" alt="The Influential Spirit cover on a tablet screen" />
                  </div>
                </div>
                <div className="bundle-digital__text">
                  <span className="bundle-label">Digital edition</span>
                  <div className="bundle-title">PDF + EPUB, read on any device</div>
                  <div className="bundle-scripture">{DAY1_FULL.scripture}<cite>{DAY1_FULL.scriptureRef}</cite></div>
                  <div className="bundle-meta">Day 1 in full, plus the 30-day reading plan inside every edition.</div>
                </div>
              </div>
              <figure>
                { }
                <img src="/images/mockups/book-audiogram.png" alt="Author-narrated audiobook with headphones" />
                <figcaption><strong>Author-narrated audiobook</strong>Included in the Formation Bundle</figcaption>
              </figure>
            </div>
            <div className="editions-accordion">
            <div>
              <button type="button" className={`editions-accordion__head ${editionsRegion === "usd" ? "is-open" : ""}`} onClick={() => setEditionsRegion("usd")} aria-expanded={editionsRegion === "usd"}>
                <span className="ea-region">{EDITIONS.regionUSD}</span>
                <span className="ea-sub">{EDITIONS.regionUSDSub}</span>
                <svg className="ea-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {editionsRegion === "usd" && (
                <div className="editions-accordion__panel">
                  <div className="grid-12" style={{ gap: 24, marginTop: 20 }}>
                    {EDITIONS.tiers.filter((t) => t.region === "usd").map((t, i) => (
                      <a className={`col-4 tier-card${t.popular ? " popular" : ""}`} key={`usd-${i}`} href={t.href} target="_blank" rel="noopener noreferrer">
                        <span className="tier-name">{t.name}</span>
                        <div className="price">{t.price} <s>{t.was}</s></div>
                        <p className="tier-desc">{t.desc}</p>
                        <span className="tier-cta">Pre-order via Payhip →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <button type="button" className={`editions-accordion__head ${editionsRegion === "ugx" ? "is-open" : ""}`} onClick={() => setEditionsRegion("ugx")} aria-expanded={editionsRegion === "ugx"}>
                <span className="ea-region">{EDITIONS.regionUGX}</span>
                <span className="ea-sub">{EDITIONS.regionUGXSub}</span>
                <svg className="ea-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {editionsRegion === "ugx" && (
                <div className="editions-accordion__panel">
                  <div className="grid-12" style={{ gap: 24, marginTop: 20 }}>
                    {EDITIONS.tiers.filter((t) => t.region === "ugx").map((t, i) => (
                      <a className={`col-4 tier-card on-paper${t.popular ? " popular" : ""}`} key={`ugx-${i}`} href={t.href} target="_blank" rel="noopener noreferrer">
                        <span className="tier-name">{t.name}</span>
                        <div className="price">{t.price} <s>{t.was}</s></div>
                        <p className="tier-desc">{t.desc}</p>
                        <span className="tier-cta">Pre-order via Selar →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>
        </section>

        {/* ============ REVIEWS ============ */}
        <section id="reviews" className="section surface-50" data-reveal>
          <div className="container">
            <div className="text-center mx-auto" style={{ maxWidth: 640, marginBottom: 48 }}>
              <span className="eyebrow">{REVIEWS.eyebrow}</span>
              <h2 className="display" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 8, letterSpacing: "-0.01em" }}>{REVIEWS.heading}</h2>
              <p className="caption mt-3">{REVIEWS.subhead}</p>
            </div>
            <OrnamentRule>§</OrnamentRule>
            <div className="grid-12" style={{ gap: 24, marginTop: 32 }} data-reveal-stagger>
              {REVIEWS.items.map((r, i) => (
                <figure className={`col-6 review-card review-card--${i % 2 === 0 ? "a" : "b"}`} key={i}>
                  <div className="orn">“</div>
                  <blockquote>{r.quote}</blockquote>
                  <figcaption><span className="reviewer-name">{r.name}</span><span className="reviewer-role">{r.role}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section id="questions" className="section surface-100" data-reveal>
          <div className="container">
            <div className="mx-auto" style={{ maxWidth: 760 }}>
              <span className="eyebrow">{FAQ.eyebrow}</span>
              <OrnamentRule>§</OrnamentRule>
              {FAQ.items.map((f, i) => (<details className="faq-item" key={i}><summary>{f.q}</summary><div className="faq-body">{f.a}</div></details>))}
            </div>
          </div>
        </section>

        {/* ============ TWO WAYS + WHAT COMES NEXT (dark, library cards) ============ */}
        <section id="books" className="section surface-ink" data-reveal>
          <div className="container">
            <div className="mx-auto text-center" style={{ maxWidth: 640 }}>
              <span className="eyebrow">{WHATS_NEXT.twoWaysEyebrow}</span>
              <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 44px)", marginTop: 8, fontWeight: 400, color: "var(--paper-50)", letterSpacing: "-0.015em" }}>{WHATS_NEXT.twoWaysHeading}</h2>
            </div>
            <OrnamentRule>§</OrnamentRule>
            <div className="grid-12" style={{ gap: 24, marginTop: 24 }} data-reveal-stagger>
              {WHATS_NEXT.twoWays.map((w, i) => (
                <div className="col-6" key={i} style={{ padding: 32, border: "1px solid rgba(184,146,90,0.35)", background: "var(--ink-800)" }}>
                  <h3 className="display" style={{ fontSize: 24, color: "var(--gold-200)", fontWeight: 500 }}>{w.title}</h3>
                  <p className="body-sm" style={{ color: "var(--paper-200)", margin: "12px 0 20px" }}>{w.desc}</p>
                  {w.href === "#day-one" ? (<button type="button" className={`btn ${(w.variant as string) === "primary" ? "btn-gold" : "btn-ghost"}`} onClick={openDay1}>{w.cta} <ArrowRight /></button>) : (<a className={`btn ${(w.variant as string) === "primary" ? "btn-gold" : "btn-ghost"}`} href={w.href}>{w.cta} <ArrowRight /></a>)}
                </div>
              ))}
            </div>
            <div className="text-center mx-auto mt-12" style={{ maxWidth: 720 }}>
              <span className="eyebrow">{WHATS_NEXT.nextEyebrow}</span>
              <h2 className="display" style={{ fontSize: "clamp(30px, 3.6vw, 40px)", marginTop: 8, fontWeight: 400, color: "var(--paper-50)", letterSpacing: "-0.015em" }}>{WHATS_NEXT.nextHeading}</h2>
            </div>
            <OrnamentRule>§</OrnamentRule>
            <div className="grid-12" style={{ gap: 24, marginTop: 24 }} data-reveal-stagger>
              {LIBRARY.books.map((b) => (
                <article className="col-4 book-card book-card--dark" key={b.title}>
                  {b.cover === "cover" ? (
                    <a href={b.href} className="cover-slot" aria-label={`${b.title} book cover`}>
                      <img src="/images/cover.jpg" alt={`${b.title} book cover`} />
                    </a>
                  ) : (
                    <div className="cover-slot" aria-hidden="true" style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 8, background: b.cover === "oxblood" ? "var(--oxblood-500)" : "var(--forest-500)", boxShadow: "inset 0 0 0 1px rgba(228,199,187,0.28), 0 8px 24px rgba(30,26,22,0.18)" }}>
                      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "8px 4px", border: `1px solid ${b.cover === "oxblood" ? "rgba(228,199,187,0.35)" : "rgba(196,207,199,0.35)"}` }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 8, letterSpacing: "0.2em", color: b.cover === "oxblood" ? "var(--oxblood-100)" : "var(--forest-100)", textTransform: "uppercase" }}>{b.cover === "oxblood" ? "Vol. II" : "2027"}</span>
                        <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, lineHeight: 1.1, color: "var(--paper-50)" }}>{b.cover === "oxblood" ? <>Unedited<br />Christmas</> : <>Forth-<br />coming</>}</span>
                        <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: b.cover === "oxblood" ? "var(--oxblood-100)" : "var(--forest-100)", fontSize: 14, lineHeight: 1 }}>§</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="meta-row"><span className="eyebrow">{b.status}</span><span className="caption">{b.caption}</span></div>
                    <h3 className="display" style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.005em" }}>{b.title}</h3>
                    <p className="role-line">{b.role}</p>
                    <p className="excerpt">{b.excerpt}</p>
                    <div className="card-cta"><a className="btn btn-ghost btn-sm" href={b.href}>{b.cta}</a></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>


        {/* ============ RECENT LETTERS (RSS) ============ */}
        <section id="letters-preview" className="section surface-50" data-reveal>
          <div className="container">
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
              <div><span className="eyebrow">The writing</span><h2 className="display" style={{ fontSize: 42, marginTop: 8, letterSpacing: "-0.01em" }}>Recent letters.</h2></div>
              <a href="#letter" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-700)", textDecoration: "underline", textDecorationColor: "var(--gold-300)", textUnderlineOffset: 4 }}>Subscribe to the letter →</a>
            </div>
            <OrnamentRule>§</OrnamentRule>
            <div id="home-letter-feed">
              {letters === null ? (<div className="letter-item"><div><div className="date">&nbsp;</div><div className="title">Loading recent letters…</div><div className="excerpt">Fetching the archive from Beehiiv.</div></div></div>)
              : letters.length === 0 ? (<div><p className="body body-lg" style={{ maxWidth: "52ch", fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--ink-500)" }}>No letters yet. This is a live feed. Every letter Pastor Eryeza publishes on Beehiiv will appear here automatically.</p><p className="caption" style={{ marginTop: 16 }}><a href="#letter" style={{ color: "var(--ink-700)", textDecoration: "underline", textDecorationColor: "var(--gold-300)", textUnderlineOffset: 3 }}>Subscribe to be first to read →</a></p></div>)
              : letters.map((it, i) => { const excerpt = it.description.length > 220 ? it.description.slice(0, 220).trimEnd() + "\u2026" : it.description; return (
                <a className="letter-item" key={i} href={it.link} target="_blank" rel="noopener noreferrer">
                  <div><div className="date">{fmtDate(it.pubDate) || "Letter"}</div><div className="title">{it.title}</div>{excerpt ? <p className="excerpt">{excerpt}</p> : null}</div>
                  <svg className="arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                </a>); })}
            </div>
          </div>
        </section>

        {/* ============ PODCAST ============ */}
        <section id="podcast" className="dis-strip" data-reveal>
          <div className="container">
            <div className="dis-row">
              { }
              <img src="/brand/dis-mark.svg" alt="Devotion In Season seal" className="dis-seal" style={{ padding: 12 }} />
              <div className="stack">
                <span className="dis-eb">{PODCAST.eyebrow}</span>
                <h2 className="dis-title">{PODCAST.title}</h2>
                <p className="dis-lede">{PODCAST.lede}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch" }}>
                <a className="dis-cta" href={SITE.podcastIheart} target="_blank" rel="noopener noreferrer"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>Play latest</a>
                <a className="dis-players" href="#podcast-platforms">Or on Apple, Spotify, &amp; more ↓</a>
              </div>
            </div>
            <div className="featured-episode">
              <div className="episode-chip">
                <span className="pulse-dot" aria-hidden="true" />
                <span>Latest episode · on air</span>
                <span style={{ marginLeft: "auto", fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--gold-200)", letterSpacing: 0, textTransform: "none" }}>iHeart</span>
              </div>
              <iframe title="Devotion In Season, live iHeart player" loading="lazy" src={`${SITE.podcastIheart}/?embed=true`} style={{ display: "block", width: "100%", height: 180, border: 0, background: "var(--forest-500)", colorScheme: "dark" }} />
            </div>
            <div className="mt-12">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                <span className="eyebrow" style={{ color: "var(--gold-200)" }}>Recent episodes</span>
                <a href={SITE.podcastIheart} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-200)", textDecoration: "underline", textDecorationColor: "rgba(184,146,90,0.5)", textUnderlineOffset: 4 }}>All episodes ↗</a>
              </div>
              <ul id="podcast-episodes" className="episode-list">
                {episodes === null ? (<li><div><div className="meta">Loading the latest season…</div><h4 className="title">A few minutes with God, on your commute or your kitchen table.</h4></div></li>)
                : episodes.length === 0 ? (<li><div><div className="meta">Devotion In Season · iHeart</div><h4 className="title">Episode list loads live in-browser. Open the show to see all episodes.</h4></div><a className="play" href={SITE.podcastIheart} target="_blank" rel="noopener noreferrer">All episodes ↗</a></li>)
                : episodes.map((it, i) => (<li key={i}><div><div className="meta">{fmtDate(it.pubDate) || "Episode"}</div><h4 className="title">{it.title}</h4></div><a className="play" href={it.link} target="_blank" rel="noopener noreferrer">Play ↗</a></li>))}
              </ul>
            </div>
            <div className="mt-12" id="podcast-platforms">
              <OrnamentRule>§</OrnamentRule>
              <div style={{ marginBottom: 24 }}><span className="dis-eb">{PODCAST.platformsLabel}</span><h3 className="display" style={{ fontSize: 28, fontWeight: 500, color: "var(--paper-50)", marginTop: 8 }}>{PODCAST.platformsHeading}</h3></div>
              <ul className="platform-grid" data-reveal-stagger>
                {PODCAST.platforms.map((p) => (<li key={p.name}><a className="platform-card" href={p.url} target="_blank" rel="noopener noreferrer"><div style={{ display: "flex", justifyContent: "space-between" }}><span className="mark"><PlatformIcon name={p.name} /></span></div><div><div className="name">{p.name}</div></div></a></li>))}
              </ul>
            </div>
          </div>
        </section>

        

        {/* ============ NEWSLETTER (Eryeza Writes, no description lede) ============ */}
        <section id="letter" className="section surface-200" data-reveal>
          <div className="container">
            <div className="mx-auto text-center" style={{ maxWidth: 640, marginBottom: 24 }}>
              <img className="ew-seal" src="/brand/logo-ew.svg" alt="Eryeza Writes mark" width={64} height={64} />
              <span className="eyebrow">{NEWSLETTER.eyebrow}</span>
              <h2 className="display" style={{ fontSize: "clamp(34px, 3.6vw, 48px)", marginTop: 12, letterSpacing: "-0.01em", lineHeight: 1.15 }}>{NEWSLETTER.heading}</h2>
            </div>
            <div className="mx-auto letter-card letter-card--embed" style={{ maxWidth: 520 }}>
              <iframe className="beehiiv-embed" title="Subscribe to Eryeza Writes" loading="lazy" scrolling="no" style={{ height: 420 }} src={SITE.beehiivEmbed} />
            </div>
          </div>
        </section>

        {/* ============ ABOUT (expanded bio, finer print, visible EK mark) ============ */}
        <section id="about" className="section surface-parchment" data-reveal>
          <div className="container">
            <div className="mx-auto text-center" style={{ maxWidth: 720, marginBottom: 48 }}>
              <span className="eyebrow">{ABOUT.eyebrow}</span>
              <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 60px)", marginTop: 8, fontWeight: 400, letterSpacing: "-0.02em" }}>{ABOUT.heading}</h2>
            </div>
            <div className="about-section">
              <div className="about-section__media">
                { }
                <img className="about-logo" src={ABOUT.logo} alt="EK monogram" width={96} height={96} />
                <div className="about-portrait">
                  { }
                  <img src={ABOUT.photo} alt="Pastor Eryeza Kalalu" />
                </div>
              </div>
              <div className="about-section__body">
                <p className="about-lead">{ABOUT.lead}</p>
                {ABOUT.paras.map((p, i) => (<p key={i} className="about-para">{renderRich(p)}</p>))}
                <div className="about-section__closer">{ABOUT.closer}</div>
              </div>
            </div>
          </div>
        

</section>

{/* ============ SPEAKING (gradient end-CTA immediately after the Eryeza Speaks eyebrow) ============ */}
        <section id="speaking" className="section" style={{ background: "var(--oxblood-50)" }} data-reveal>
          <div className="container">
            {/* ES wordmark (top) */}
            <img className="speaking-seal" src="/brand/logo-es.svg" alt="Eryeza Speaks mark" width={72} height={72} style={{ marginBottom: 20 }} />

            {/* Eryeza Speaks eyebrow */}
            <div className="text-center" style={{ marginBottom: 24 }}>
              <span className="eyebrow">{SPEAKING.heroEyebrow}</span>
            </div>

            {/* FIRST card: the gradient end-CTA (immediately after the Eryeza Speaks eyebrow) */}
            <div className="speaking-end-cta">
              <img className="sec-wordmark" src="/brand/logo-es.svg" alt="" width={64} height={64} />
              <h3>{SPEAKING.ctaHeading}</h3>
              <p>{SPEAKING.ctaLede}</p>
              <button type="button" className="btn btn-gold" onClick={() => { setInviteOpen(true); requestAnimationFrame(() => document.getElementById("invite-form")?.scrollIntoView({ behavior: "smooth" })); }}>{SPEAKING.cta}<ArrowRight /></button>
            </div>

            {/* Hero heading + lede (flows after the CTA) */}
            <div className="mx-auto text-center" style={{ maxWidth: 760, marginTop: 48, marginBottom: 40 }}>
              <h2 className="display" style={{ fontSize: "clamp(34px, 4.4vw, 52px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>{SPEAKING.heroHeading}</h2>
              <p className="body body-lg" style={{ marginTop: 16, maxWidth: "60ch", marginLeft: "auto", marginRight: "auto", color: "var(--ink-500)" }}>{SPEAKING.heroLede}</p>
            </div>

            {/* The black quote card (standout words, button rephrased) */}
            <div className="speaking-hero-cta">
              <img className="shc-wordmark" src="/brand/logo-es.svg" alt="" width={56} height={56} />
              <p className="shc-words">{FEATURED_BOOK.standout}</p>
              <div className="shc-rule" />
              <div className="shc-cta-row">
                <button type="button" className="btn btn-ghost" style={{ color: "var(--paper-50)", borderColor: "rgba(184,146,90,0.5)" }} onClick={() => { setInviteOpen(true); requestAnimationFrame(() => document.getElementById("invite-form")?.scrollIntoView({ behavior: "smooth" })); }}>Send the invitation<ArrowRight /></button>
              </div>
            </div>

            {/* Where Eryeza Can Serve (tonal --a/--b) */}
            <div style={{ marginTop: 56, marginBottom: 48 }}>
              <div className="speaking-block-label">{SPEAKING.whereHeading}</div>
              <OrnamentRule>§</OrnamentRule>
              <div className="grid-12" style={{ gap: 16 }} data-reveal-stagger>
                {SPEAKING.whereItems.map((w, i) => (
                  <div className={`col-6 speaking-card speaking-card--${i % 2 ? "b" : "a"}`} key={i}>
                    <div className="sc-body">{w}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Themes I Explore (tonal --c) */}
            <div style={{ marginBottom: 48 }}>
              <div className="speaking-block-label">{SPEAKING.themesHeading}</div>
              <p className="speaking-lede" style={{ fontStyle: "italic", color: "var(--ink-300)" }}>{SPEAKING.themesLede}</p>
              <OrnamentRule>§</OrnamentRule>
              <div className="grid-12" style={{ gap: 24 }} data-reveal-stagger>
                {SPEAKING.themes.map((t, i) => (
                  <article className="col-4 speaking-card speaking-card--c" key={i}>
                    <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 30, color: "var(--gold-400)", lineHeight: 1, marginBottom: 8 }}>{["I", "II", "III", "IV", "V", "VI"][i]}</div>
                    <div className="sc-title">{t.title}</div>
                    <div className="sc-body">{t.desc}</div>
                  </article>
                ))}
              </div>
            </div>

            {/* How I Teach (prose on --d) */}
            <div style={{ marginBottom: 48 }}>
              <div className="speaking-block-label">{SPEAKING.howHeading}</div>
              <OrnamentRule>§</OrnamentRule>
              <div className="speaking-card speaking-card--d" style={{ padding: 32 }}>
                <div className="prose-feature" style={{ maxWidth: "68ch" }}>
                  {SPEAKING.howParas.map((p, i) => (<p key={i} className="reader__prose">{p}</p>))}
                </div>
              </div>
            </div>

            {/* Selected Engagements (tonal --a) */}
            <div style={{ marginBottom: 40 }}>
              <div className="speaking-block-label">{SPEAKING.engagementsHeading}</div>
              <p className="caption" style={{ marginTop: 4, marginBottom: 0 }}>{SPEAKING.engagementsLede}</p>
              <OrnamentRule>§</OrnamentRule>
              <div className="grid-12" style={{ gap: 20 }} data-reveal-stagger>
                {SPEAKING.engagements.map((e, i) => (
                  <div className="col-4 speaking-card speaking-card--a" key={i}>
                    <div className="sc-title">{e.event}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.04em", color: "var(--ink-300)", marginTop: 8 }}>{e.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtle secondary Invite button (end) */}
            <div className="speaking-subtle-invite">
              <button type="button" onClick={() => { setInviteOpen(true); requestAnimationFrame(() => document.getElementById("invite-form")?.scrollIntoView({ behavior: "smooth" })); }}>
                Invite
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* ES wordmark (bottom) */}
            <img className="speaking-seal" src="/brand/logo-es.svg" alt="" width={72} height={72} style={{ marginTop: 32 }} />

            {/* The revealed multi-step invitation form */}
            {inviteOpen && (
              <div id="invite-form" style={{ marginTop: 48, scrollMarginTop: 110 }}>
                <div className="mx-auto" style={{ maxWidth: 760, background: "var(--paper-50)", padding: 32, border: "1px solid var(--border)", borderTop: "3px solid var(--oxblood-400)" }}>
                  <span className="eyebrow">{SPEAKING.invite.eyebrow}</span>
                  <h3 className="display" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 8, fontWeight: 400 }}>{SPEAKING.invite.heading}</h3>
                  <p className="body" style={{ marginTop: 12, color: "var(--ink-500)", maxWidth: "62ch" }}>{SPEAKING.invite.intro}</p>
                  <OrnamentRule>§</OrnamentRule>
                  <SpeakingInviteForm />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ============ BACK TO TOP ============ */}
        <div className="back-to-top">
          <a href="#top">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></svg>
            Back to top
          </a>
        </div>
      </main>
        

      {/* ============ FOOTER (dark, gold monogram) ============ */}
      <footer className="site-footer">
        <div className="container">
          <div className="grid-12" style={{ gap: 48 }}>
            <div className="col-5">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                { }
                <img src="/brand/logo-monogram-gold.svg" alt="EK monogram" width={40} height={40} />
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--paper-50)", fontWeight: 500 }}>Eryeza Kalalu</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold-300)", marginTop: 4 }}>{SITE.role}</div>
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--paper-200)", lineHeight: 1.7, marginTop: 16, maxWidth: "40ch" }}>
                Writing, teaching and speaking about faith, formation, leadership and the life in Christ. Host of the <em>Devotion In Season</em> podcast.
              </p>
            </div>
            <div className="col-2">
              <div className="eyebrow" style={{ color: "var(--gold-200)", marginBottom: 14 }}>Read</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ padding: "4px 0" }}><a href="#letters-preview" style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--paper-100)", textDecoration: "none" }}>Latest letter</a></li>
                <li style={{ padding: "4px 0" }}><a href="#influential-spirit" style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--paper-100)", textDecoration: "none" }}>The Influential Spirit</a></li>
                <li style={{ padding: "4px 0" }}><a href="#books" style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--paper-100)", textDecoration: "none" }}>The library</a></li>
              </ul>
            </div>
            <div className="col-2">
              <div className="eyebrow" style={{ color: "var(--gold-200)", marginBottom: 14 }}>Listen</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ padding: "4px 0" }}><a href="#podcast" style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--paper-100)", textDecoration: "none" }}>Devotion In Season</a></li>
                <li style={{ padding: "4px 0" }}><a href={PODCAST.platforms[0].url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--paper-100)", textDecoration: "none" }}>Spotify</a></li>
                <li style={{ padding: "4px 0" }}><a href={PODCAST.platforms[1].url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--paper-100)", textDecoration: "none" }}>Apple Podcasts</a></li>
              </ul>
            </div>
            <div className="col-3">
              <div className="eyebrow" style={{ color: "var(--gold-200)", marginBottom: 14 }}>Contact</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ padding: "4px 0" }}><a href="#speaking" style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--paper-100)", textDecoration: "none" }}>Invite to speak</a></li>
                <li style={{ padding: "4px 0" }}><a href={`mailto:${SITE.speakingEmail}`} style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--paper-100)", textDecoration: "none" }}>{SITE.speakingEmail}</a></li>
                <li style={{ padding: "4px 0" }}><a href={`mailto:${SITE.email}`} style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--paper-100)", textDecoration: "none" }}>{SITE.email}</a></li>
                <li style={{ padding: "4px 0" }}><button type="button" onClick={() => setPrivacyOpen(true)} style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--paper-100)", textDecoration: "none", background: "none", border: 0, cursor: "pointer", padding: 0 }}>Privacy</button></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© {SITE.year} Eryeza Kalalu · <span style={{ color: "var(--gold-300)" }}>§</span> Written with care.</div>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>Grace and peace to you.</div>
          </div>
        </div>
      </footer>

      {/* ============ STICKY MOBILE PRE-ORDER BAR ============ */}
      <div className="sticky-mobile-bar" data-sticky-bar style={{ transform: "translateY(100%)", opacity: 0, transition: "transform 260ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 260ms" }}>
        <div className="meta">
          <div className="eyebrow">Pre-order · 30 Sept 2026</div>
          <div className="caption">The Influential Spirit · from $12 / UGX 36,000</div>
        </div>
        <a className="btn btn-gold btn-sm" href="#editions">Choose edition</a>
      </div>

      {privacyOpen && (
        <div className="privacy-modal" role="dialog" aria-modal="true" aria-label="Privacy information" onClick={(e) => { if (e.target === e.currentTarget) setPrivacyOpen(false); }}>
          <div className="privacy-modal__panel" style={{ position: "relative" }}>
            <button type="button" className="privacy-modal__close" aria-label="Close" onClick={() => setPrivacyOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
            </button>
            <span className="eyebrow">{PRIVACY.eyebrow}</span>
            <h2 className="display" style={{ fontSize: "clamp(28px, 3.6vw, 40px)", marginTop: 8, fontWeight: 400, letterSpacing: "-0.015em" }}>{PRIVACY.heading}</h2>
            <p className="caption" style={{ marginTop: 8, color: "var(--ink-300)" }}>{PRIVACY.updated}</p>
            <OrnamentRule>§</OrnamentRule>
            <div className="prose-feature" style={{ maxWidth: "64ch" }}>
              {PRIVACY.paras.map((p, i) => (<p key={i} className="privacy-para">{renderRich(p)}</p>))}
            </div>
            <p className="caption" style={{ marginTop: 16 }}>{PRIVACY.contactLine}</p>
          </div>
        </div>
      )}
      {cookieSeen && (
        <div className="cookie-banner is-visible" role="dialog" aria-label="Cookie preferences">
          <p className="cookie-banner__text">This site uses only essential cookies and those required by the newsletter, podcast, and payment services. No advertising cookies are used. See the <a href="#privacy">privacy page</a> for details.</p>
          <div className="cookie-banner__actions">
            <button type="button" className="cookie-banner__btn cookie-banner__btn--decline" onClick={() => chooseCookies(false)}>Decline non-essential</button>
            <button type="button" className="cookie-banner__btn cookie-banner__btn--accept" onClick={() => chooseCookies(true)}>Accept</button>
          </div>
        </div>
      )}
    </div>
  );

}
