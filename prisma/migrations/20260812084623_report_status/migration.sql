-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'new';

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");
