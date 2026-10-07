"use client";

/**
 * BookStage: the book surrounded by everything that comes with it.
 * The cover sits in the middle; the Reader pages, Group Study Guide, Reading Plan,
 * Companion Journal, Declarations, Start Here guide, the EPUB on a tablet and the
 * audiobook fan out around it. Each layer drifts at its own speed as the page
 * scrolls (framer-motion), and the stack opens on load. With reduced motion the
 * composition is still, and every position is a percentage of the stage width so
 * it scales from 320px phones to large desktops without a breakpoint.
 */
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type Layer = {
  key: string;
  src: string;
  label: string;
  /** left / top / width as % of the stage, rotation in degrees */
  x: number; y: number; w: number; r: number;
  z: number;
  /** scroll drift in px (positive moves down while scrolling) */
  drift: number;
  /** where the stack starts before it opens (px offset) */
  from: [number, number];
  alt: string;
};

const LAYERS: Layer[] = [
  { key: "decl", src: "/images/stage/decl.webp", label: "Declarations & Prayers", x: 52, y: 40, w: 25, r: 9, z: 1, drift: 46, from: [-120, -40], alt: "Declarations and Prayers, written companion to the audio" },
  { key: "start", src: "/images/stage/start.webp", label: "Start Here guide", x: 22, y: 40, w: 25, r: -8, z: 1, drift: 52, from: [120, -40], alt: "Start Here guide for your edition" },
  { key: "group", src: "/images/stage/group.webp", label: "Group Study Guide", x: 1, y: 18, w: 29, r: -13, z: 2, drift: 30, from: [150, 20], alt: "Group Study Guide, six sessions" },
  { key: "journal", src: "/images/stage/journal.webp", label: "Companion Journal", x: 70, y: 18, w: 29, r: 13, z: 2, drift: 30, from: [-150, 20], alt: "Companion Journal, a page for every day" },
  { key: "plan", src: "/images/stage/plan.webp", label: "Reading Plan", x: 71, y: 3, w: 26, r: 6, z: 3, drift: 14, from: [-110, 50], alt: "30-Day Reading Plan and Challenge" },
  { key: "reader", src: "/images/stage/reader.webp", label: "Reader Edition", x: 3, y: 3, w: 27, r: -6, z: 3, drift: 14, from: [110, 50], alt: "Reader Edition, a page from Day 1" },
  { key: "cover", src: "/images/cover-640.webp", label: "The Influential Spirit", x: 29, y: 0, w: 42, r: 0, z: 5, drift: -8, from: [0, 60], alt: "The Influential Spirit, the book cover" },
  { key: "epub", src: "/images/stage/epub.webp", label: "EPUB", x: 6, y: 56, w: 30, r: -4, z: 6, drift: -26, from: [100, -30], alt: "The EPUB edition on a tablet" },
  { key: "audio", src: "/images/stage/audio.webp", label: "Audiobook", x: 62, y: 62, w: 29, r: 5, z: 6, drift: -30, from: [-100, -30], alt: "Author-narrated audiobook" },
];

function StageLayer({ layer, progress, still }: { layer: Layer; progress: ReturnType<typeof useScroll>["scrollYProgress"]; still: boolean }) {
  const y = useTransform(progress, [0, 1], [-layer.drift / 2, layer.drift / 2]);
  const isCover = layer.key === "cover";
  const style = {
    left: `${layer.x}%`,
    top: `${layer.y}%`,
    width: `${layer.w}%`,
    zIndex: layer.z,
  } as const;
  const inner = (
    <figure className={`stage-card stage-card--${layer.key}`} style={{ transform: `rotate(${layer.r}deg)` }}>
      <img
        src={layer.src}
        width={isCover ? 640 : 520}
        height={isCover ? 960 : layer.key === "audio" ? 520 : 800}
        alt={layer.alt}
        loading="eager"
        decoding="async"
        fetchPriority={isCover ? "high" : "low"}
      />
    </figure>
  );
  if (still) return <div className="stage-layer" style={style}>{inner}</div>;
  return (
    <motion.div className="stage-layer" style={{ ...style, y }}>
      <motion.div
        initial={{ opacity: 0, x: layer.from[0], y: layer.from[1], scale: 0.9 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1 + (10 - layer.z) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      >
        {inner}
      </motion.div>
    </motion.div>
  );
}

export default function BookStage({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <div ref={ref} className={`book-stage ${className}`} role="group" aria-label="The Influential Spirit and everything included in the editions">
      <div className="book-stage__glow" aria-hidden="true" />
      <div className="book-stage__canvas">
        {LAYERS.map((l) => <StageLayer key={l.key} layer={l} progress={scrollYProgress} still={!!reduce} />)}
      </div>
      <ul className="stage-legend" aria-label="Included in the editions">
        {LAYERS.filter((l) => l.key !== "cover").map((l) => <li key={l.key}>{l.label}</li>)}
      </ul>
    </div>
  );
}
