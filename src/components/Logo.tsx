/**
 * The SOM mark: a story object (the square hub) publishing onto a bus (the ring),
 * tapped by three subscribers (the nodes). Colours come from the theme tokens so
 * the mark follows light/dark like the rest of the chrome.
 */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      className="logo"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Story Object Model"
    >
      <g stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round">
        <path d="M20.12 5.80 A11 11 0 0 1 26.89 17.53" />
        <path d="M22.77 24.67 A11 11 0 0 1 9.23 24.67" />
        <path d="M5.11 17.53 A11 11 0 0 1 11.88 5.80" />
      </g>
      <rect x="11.8" y="11.8" width="8.4" height="8.4" rx="2.6" fill="var(--accent)" />
      <g fill="var(--accent-2)">
        <circle cx="16" cy="5" r="2.8" />
        <circle cx="25.53" cy="21.5" r="2.8" />
        <circle cx="6.47" cy="21.5" r="2.8" />
      </g>
    </svg>
  );
}
