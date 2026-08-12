-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "edit_token" TEXT NOT NULL,
    "submitter_name" TEXT NOT NULL,
    "submitter_role" TEXT NOT NULL,
    "submitter_email" TEXT NOT NULL,
    "submitter_phone" TEXT,
    "school_name" TEXT NOT NULL,
    "project_title" TEXT NOT NULL,
    "description" TEXT,
    "date_implemented" DATE,
    "project_duration" TEXT,
    "target_participants" TEXT,
    "project_lead" TEXT,
    "initiative_types" TEXT[],
    "initiative_other" TEXT,
    "sdg_goals" TEXT[],
    "students" INTEGER,
    "faculty" INTEGER,
    "staff_admin" INTEGER,
    "community" INTEGER,
    "total_participants" INTEGER,
    "school_population" INTEGER,
    "participation_rate" DECIMAL(6,2),
    "impact" JSONB NOT NULL DEFAULT '{}',
    "effectiveness" JSONB NOT NULL DEFAULT '[]',
    "digital_platforms" TEXT[],
    "digital_platform_other" TEXT,
    "hashtag_used" TEXT,
    "hashtag_effectiveness" TEXT,
    "reach_reactions" INTEGER,
    "reach_comments" INTEGER,
    "reach_shares" INTEGER,
    "reach_views" INTEGER,
    "post_links" TEXT,
    "documentation_links" TEXT,
    "has_reflections" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reflections" (
    "id" UUID NOT NULL,
    "report_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "climate_included" TEXT,
    "climate_description" TEXT,
    "participant_feedback" TEXT,
    "spirit_of_faith" TEXT,
    "zeal_for_service" TEXT,
    "communion_in_mission" TEXT,
    "what_went_well" TEXT,
    "challenges" TEXT,
    "recommendations" TEXT,
    "district_suggestions" TEXT,
    "continuing" TEXT,
    "planned_activity" TEXT,
    "not_continuing_reason" TEXT,

    CONSTRAINT "reflections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMPTZ,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reports_edit_token_key" ON "reports"("edit_token");

-- CreateIndex
CREATE INDEX "reports_created_at_idx" ON "reports"("created_at" DESC);

-- CreateIndex
CREATE INDEX "reports_school_name_idx" ON "reports"("school_name");

-- CreateIndex
CREATE INDEX "reports_date_implemented_idx" ON "reports"("date_implemented");

-- CreateIndex
CREATE INDEX "reports_submitter_email_idx" ON "reports"("submitter_email");

-- CreateIndex
CREATE INDEX "reports_initiative_types_idx" ON "reports" USING GIN ("initiative_types");

-- CreateIndex
CREATE INDEX "reports_sdg_goals_idx" ON "reports" USING GIN ("sdg_goals");

-- CreateIndex
CREATE UNIQUE INDEX "reflections_report_id_key" ON "reflections"("report_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
