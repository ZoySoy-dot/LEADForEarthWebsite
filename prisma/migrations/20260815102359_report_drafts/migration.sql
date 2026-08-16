-- CreateTable
CREATE TABLE "report_drafts" (
    "user_email" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_drafts_pkey" PRIMARY KEY ("user_email")
);
