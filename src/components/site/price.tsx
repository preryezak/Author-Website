/**
 * Launch-price / full-price pair.
 *
 * Both values are rendered into the static HTML. Until LAUNCH_PRICE_ENDS the
 * launch value shows (with the struck-through full price when `was` is given).
 * From then on, the inline script in layout.tsx sets
 * <html data-price-phase="full"> and globals.css hides `.price-launch` /
 * `.launch-only` and shows `.price-full`. No rebuild needed for the switch.
 */
export function Price({ launch, full, was }: { launch: string; full: string; was?: string }) {
  return (
    <>
      <span className="price-launch">{launch}{was ? <> <s>{was}</s></> : null}</span>
      <span className="price-full">{full}</span>
    </>
  );
}

/** Content shown only during the launch-price period. */
export function LaunchOnly({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={`launch-only${className ? ` ${className}` : ""}`}>{children}</span>;
}
