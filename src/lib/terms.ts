// Version of the report submission terms currently in force.
//
// Bump this whenever the wording on /terms changes in a way that matters. The
// value is stored on every report alongside an acceptance timestamp, so the
// committee can always show which text a given submitter agreed to. Section 10
// of the terms promises exactly that, so this constant is the promise's
// implementation, not decoration.
export const TERMS_VERSION = "2026-09-16";

// Human-readable form of the same date, shown on the terms page.
export const TERMS_EFFECTIVE_DATE = "16 September 2026";
