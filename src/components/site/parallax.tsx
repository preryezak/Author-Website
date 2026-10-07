"use client";

/**
 * Scroll parallax built on framer-motion (already a dependency).
 * - Parallax: shifts its children a little against the scroll, between +distance and -distance.
 * - BrandFilm: the intro film, muted and looping, played only while it is at least half on screen.
 * Both fall back to still content when the visitor prefers reduced motion.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function Parallax({ children, distance = 40, className, style }: { children: ReactNode; distance?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  if (reduce) return <div ref={ref} className={className} style={style}>{children}</div>;
  return <motion.div ref={ref} className={className} style={{ ...style, y }}>{children}</motion.div>;
}

export function BrandFilm({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.5) v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        else { v.pause(); setPlaying(false); }
      },
      { threshold: [0, 0.5, 1] },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  const toggleSound = () => { const v = ref.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); if (v.paused) v.play().catch(() => {}); };
  const togglePlay = () => { const v = ref.current; if (!v) return; if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {}); else { v.pause(); setPlaying(false); } };

  return (
    <div className="film-frame">
      <video ref={ref} muted={muted} loop playsInline preload="none" poster={poster} controls={reduce ? true : undefined} aria-label="The Influential Spirit, a short film">
        <source src={src} type="video/mp4" />
      </video>
      {!reduce && (
        <div className="film-controls">
          <button type="button" onClick={togglePlay} aria-pressed={playing}>{playing ? "Pause" : "Play"}</button>
          <button type="button" onClick={toggleSound} aria-pressed={!muted}>{muted ? "Sound on" : "Sound off"}</button>
        </div>
      )}
    </div>
  );
}
