"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NAV, SITE, PODCAST } from "@/lib/site-content";
import GiveButton from "@/components/site/give-button";
import CookieBanner from "@/components/site/cookie-banner";

/**
 * Shared shell for the standalone route pages (/about, /books, /give ...).
 *
 * It repeats the homepage masthead and footer markup so every route looks like
 * the same site, but it renders its own navigation: internal sections use
 * next/link, while Giving is an external link handled by GiveButton (which also
 * records the click).
 */
export default function SiteShell({
  active,
  children,
}: {
  /** Path of the current route, used for aria-current. */
  active?: string;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mastheadRef = useRef<HTMLElement>(null);

  // Masthead tint once the page scrolls; Escape and desktop width close the drawer.
  useEffect(() => {
    const onScroll = () => { const m = mastheadRef.current; if (m) m.classList.toggle("is-scrolled", window.scrollY > 16); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    const onResize = () => { if (window.innerWidth >= 1024) setDrawerOpen(false); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, []);

  const isActive = (href: string) => href === active;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="masthead" id="masthead" ref={mastheadRef}>
        <div className="container row">
          <Link className="brand" href="/">
            <img src="/brand/logo-monogram.svg" alt="" width={40} height={40} />
            <span className="wordmark">
              <span className="name">Eryeza Kalalu</span>
              <span className="role">{SITE.role}</span>
            </span>
          </Link>
          <nav aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} prefetch={false} aria-current={isActive(n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="masthead-actions">
            <a className="cta" href="/letter">
              Subscribe
            </a>
            <button
              className="masthead-burger"
              type="button"
              aria-label={drawerOpen ? "Close navigation" : "Open navigation"}
              aria-controls="drawer"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {drawerOpen ? (
                  <>
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
        <nav id="drawer" aria-label="Mobile" hidden={!drawerOpen} className="masthead-drawer">
          <div className="container masthead-drawer__inner">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                prefetch={false}
                aria-current={isActive(n.href) ? "page" : undefined}
                onClick={() => setDrawerOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer className="site-footer">
        <div className="container">
          <div className="grid-12" style={{ gap: 48 }}>
            <div className="col-5">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src="/brand/logo-monogram-gold.svg" alt="EK monogram" width={40} height={40} />
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      color: "var(--paper-50)",
                      fontWeight: 500,
                    }}
                  >
                    Eryeza Kalalu
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 10,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: "var(--gold-300)",
                      marginTop: 4,
                    }}
                  >
                    {SITE.role}
                  </div>
                </div>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 14,
                  color: "var(--paper-200)",
                  lineHeight: 1.7,
                  marginTop: 16,
                  maxWidth: "40ch",
                }}
              >
                Writing, teaching and speaking about faith, formation, leadership and the life in Christ. Host of
                the <em>Devotion In Season</em> podcast.
              </p>
            </div>
            <div className="col-2">
              <div className="eyebrow" style={{ color: "var(--gold-200)", marginBottom: 14 }}>
                Read
              </div>
              <ul className="footer-list">
                <li>
                  <Link href="/letter">Letters</Link>
                </li>
                <li>
                  <Link href="/influential-spirit">The Influential Spirit</Link>
                </li>
                <li>
                  <Link href="/books">The library</Link>
                </li>
                <li>
                  <Link href="/study">Study guide</Link>
                </li>
              </ul>
            </div>
            <div className="col-2">
              <div className="eyebrow" style={{ color: "var(--gold-200)", marginBottom: 14 }}>
                Listen
              </div>
              <ul className="footer-list">
                <li>
                  <Link href="/podcast">Devotion In Season</Link>
                </li>
                <li>
                  <a href={PODCAST.platforms[0].url} target="_blank" rel="noopener noreferrer">
                    Spotify
                  </a>
                </li>
                <li>
                  <a href={PODCAST.platforms[1].url} target="_blank" rel="noopener noreferrer">
                    Apple Podcasts
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-2">
              <div className="eyebrow" style={{ color: "var(--gold-200)", marginBottom: 14 }}>
                Support
              </div>
              <ul className="footer-list">
                <li>
                  <GiveButton source="footer" variant="footer" />
                </li>
                <li>
                  <Link href="/speaking">Invite to speak</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <a href={`mailto:${SITE.speakingEmail}`}>{SITE.speakingEmail}</a>
                </li>
                <li>
                  <Link href="/privacy">Privacy</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div>
              © {SITE.year} Eryeza Kalalu · <span style={{ color: "var(--gold-300)" }}>§</span> Written with care.
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>Grace and peace to you.</div>
          </div>
        </div>
      </footer>
      <CookieBanner />
    </div>
  );
}
