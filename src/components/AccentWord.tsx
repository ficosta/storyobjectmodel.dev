/**
 * An accented phrase with a hand-drawn underline, the way ograf.dev marks the
 * key word in its headline. Two overlapping strokes read as pen, not as a rule.
 */
export default function AccentWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="accent-word">
      {children}
      <svg className="squiggle" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
        <path d="M5,14 C64,5 168,3 295,10" />
        <path d="M26,21 C96,13 208,12 282,18" />
      </svg>
    </span>
  );
}
