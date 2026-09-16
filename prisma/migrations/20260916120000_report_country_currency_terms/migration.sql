-- Additive only, so this is safe to apply BEFORE the matching deploy: the
-- currently-running code simply ignores columns it doesn't know about.
-- The destructive half (dropping the unused participation columns) is a
-- separate migration that must only run AFTER the new code is live.

-- 1. Store the sector on the report instead of re-deriving it per request by
-- string-matching school_name. A rename or a typo used to drop a report off the
-- district map silently; a stored value keeps history stable.
ALTER TABLE "reports" ADD COLUMN "country" TEXT;
CREATE INDEX "reports_country_idx" ON "reports"("country");

-- 2. ISO 4217 code for every money figure inside the `impact` JSON. The district
-- spans seven currencies, so a bare amount can be neither summed nor displayed
-- correctly. Existing rows stay NULL and render without a symbol.
ALTER TABLE "reports" ADD COLUMN "currency" TEXT;

-- 3. Record of terms acceptance. The consent checkbox previously lived only in
-- React state and never reached the server, so there was no evidence anyone had
-- agreed to anything. Existing rows predate the terms and stay NULL.
ALTER TABLE "reports" ADD COLUMN "terms_accepted_at" TIMESTAMPTZ;
ALTER TABLE "reports" ADD COLUMN "terms_version" TEXT;
