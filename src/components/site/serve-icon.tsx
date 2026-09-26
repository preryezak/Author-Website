/**
 * Serve icons.
 *
 * Lifted out of the home page so the Speaking route can use the same marks.
 * One definition, used by both, which is what keeps the two in step.
 *
 * Drawn in the site's own stroke style (1.6, round caps, currentColor) so they
 * sit in the brand system rather than looking like an imported icon set.
 */

const SERVE_ICON_PATHS: Record<string, string[]> = {
  church: ["M12 2v4", "M10 4h4", "M4 11l8-6 8 6", "M6 9.5V20h12V9.5", "M10 20v-5a2 2 0 0 1 4 0v5"],
  conference: ["M3 4h18v11H3z", "M12 15v5", "M8 20h8", "M7 8l3 3 4-4"],
  leaders: ["M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8", "M2 21v-1a7 7 0 0 1 14 0v1", "M16.5 3.6a4 4 0 0 1 0 7.4", "M18 21v-1a7 7 0 0 0-3.5-6.1"],
  retreat: ["M2 19l5.5-7 4 5 3.5-4.5L22 19z", "M17 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4"],
  academic: ["M12 4L2 9l10 5 10-5-10-5z", "M6 11.5V16c0 1.6 2.7 2.8 6 2.8s6-1.2 6-2.8v-4.5", "M20 10v5"],
  briefcase: ["M4 8h16v11H4z", "M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2", "M4 13h16"],
  community: ["M8.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7", "M2.5 20v-1.2A6 6 0 0 1 8.5 13a6 6 0 0 1 6 6.8V20", "M15.5 4.2a3.5 3.5 0 0 1 0 6.9", "M17.8 14.3A6 6 0 0 1 21.5 20"],
  media: ["M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3", "M8.5 15.5a5 5 0 0 1 0-7", "M15.5 8.5a5 5 0 0 1 0 7", "M5.6 18.4a9 9 0 0 1 0-12.8", "M18.4 5.6a9 9 0 0 1 0 12.8"],
};

function ServeIcon({ name }: { name: string }) {
  const paths = SERVE_ICON_PATHS[name] || SERVE_ICON_PATHS.church;
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((d, i) => (<path key={i} d={d} />))}
    </svg>
  );
}

export { SERVE_ICON_PATHS };
export default ServeIcon;
