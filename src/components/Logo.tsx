/**
 * The SOM mark, as storyobjectmodel.com draws it: three bars on a 24-unit grid,
 * the middle one offset — a story carried across the layer between two tools.
 * Drawn in this site's palette: ink for the outer bars, the accent for the
 * middle, both from theme tokens so the mark follows light and dark.
 */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Story Object Model">
      <rect x="0" y="2" width="17" height="4.6" fill="var(--fg)" />
      <rect x="5" y="9.7" width="19" height="4.6" fill="var(--accent)" />
      <rect x="0" y="17.4" width="17" height="4.6" fill="var(--fg)" />
    </svg>
  );
}
