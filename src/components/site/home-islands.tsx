"use client";

/**
 * The home page's interactive pieces, each as small as it can be.
 *
 * The home page used to be one 950-line client component, so the browser had
 * to download and hydrate every paragraph of it (including the full Day 1
 * reading) before anything responded. The page is now server-rendered HTML and
 * only these islands run in the browser.
 */
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site-content";

/** Scroll-reveal for [data-reveal] / [data-reveal-stagger]. Off for reduced motion. */
export function RevealInit() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-stagger]"));
    const vh = window.innerHeight;
    // Anything already on screen is marked before the class goes on, so it never flashes out.
    els.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < vh && r.bottom > 0) el.classList.add("is-visible"); });
    document.documentElement.classList.add("js-reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((el) => { if (!el.classList.contains("is-visible")) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return null;
}

/**
 * Opens a <details> when the URL hash points at it or at its wrapper, so links
 * like "Read Day 1 free" (#day-one) land on the open reader. Also drives the
 * reader's progress bar.
 */
export function DayOneEnhancer({ targetId, detailsId }: { targetId: string; detailsId: string }) {
  useEffect(() => {
    const details = document.getElementById(detailsId) as HTMLDetailsElement | null;
    if (!details) return;
    const sync = () => {
      if (window.location.hash === `#${targetId}`) {
        details.open = true;
        requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    };
    sync();
    window.addEventListener("hashchange", sync);

    const page = details.querySelector<HTMLElement>("[data-reader-page]");
    const fill = details.querySelector<HTMLElement>(".reader__progress-fill");
    const update = () => {
      if (!page || !fill) return;
      const max = page.scrollHeight - page.clientHeight;
      fill.style.width = `${Math.min(100, Math.max(0, max > 0 ? (page.scrollTop / max) * 100 : 0))}%`;
    };
    page?.addEventListener("scroll", update, { passive: true });
    update();
    return () => { window.removeEventListener("hashchange", sync); page?.removeEventListener("scroll", update); };
  }, [targetId, detailsId]);
  return null;
}

/** Mobile buy bar: shows after 400px of scroll, hides while the editions block is on screen. */
export function StickyBuyBar({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const editions = document.getElementById("editions");
    const tick = () => {
      let onScreen = false;
      if (editions) { const r = editions.getBoundingClientRect(); onScreen = r.top < window.innerHeight && r.bottom > 0; }
      setShow(window.scrollY > 400 && !onScreen);
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => { window.removeEventListener("scroll", tick); window.removeEventListener("resize", tick); };
  }, []);
  return (
    <div
      className="sticky-mobile-bar"
      aria-hidden={!show}
      inert={!show}
      style={{ transform: show ? "translateY(0)" : "translateY(100%)", opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none", transition: "transform 260ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 260ms" }}
    >
      {children}
    </div>
  );
}

/**
 * iHeart player, loaded only when asked for. The iframe sets third-party
 * cookies and pulls a large script bundle, so it no longer loads with the page.
 */
export function IheartPlayer() {
  const [on, setOn] = useState(false);
  if (on) {
    return <iframe title="Devotion In Season player" src={`${SITE.podcastIheart}/?embed=true&theme=dark&autoplay=true`} allow="autoplay" style={{ display: "block", width: "100%", height: 180, border: 0, background: "#2D3134", colorScheme: "dark" }} />;
  }
  return (
    <button type="button" className="iheart-facade" onClick={() => setOn(true)}>
      <span className="iheart-facade__play" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
      </span>
      <span className="iheart-facade__text">
        <span className="iheart-facade__label">Load the player</span>
        <span className="iheart-facade__note">Plays the latest episode here, via iHeart</span>
      </span>
    </button>
  );
}
