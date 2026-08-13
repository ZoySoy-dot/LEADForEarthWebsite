"use client";

export default function SkipLink() {
  return (
    <a
      href="#main"
      className="skip-link"
      onClick={(e) => {
        e.preventDefault();
        const main = document.getElementById("main");
        if (!main) return;
        // Programmatic focus + scroll; browsers don't do this for a bare anchor.
        main.focus({ preventScroll: true });
        main.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      Skip to content
    </a>
  );
}
