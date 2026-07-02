// Subtle-but-clear visual break between landing sections. Uses the site's
// green accent so it reads as an intentional ornament, not a stray line.

export default function SectionDivider() {
  return (
    <div
      className="flex items-center justify-center gap-3 py-6 bg-white"
      aria-hidden="true"
    >
      <div className="h-px w-24 sm:w-40" style={{ backgroundColor: "#c8e6c9" }} />
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#a8d5b0" }} />
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#2d8c3e" aria-hidden="true">
          <path d="M12 2C7 6 5 10 5 14a7 7 0 0 0 14 0c0-4-2-8-7-12zm0 3c3.5 3 5 6 5 9a5 5 0 0 1-10 0c0-3 1.5-6 5-9z" />
        </svg>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#a8d5b0" }} />
      </div>
      <div className="h-px w-24 sm:w-40" style={{ backgroundColor: "#c8e6c9" }} />
    </div>
  );
}
