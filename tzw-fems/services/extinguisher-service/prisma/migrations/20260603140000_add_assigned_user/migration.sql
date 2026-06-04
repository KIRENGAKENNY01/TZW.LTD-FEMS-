ALTER TABLE "fire_extinguishers" ADD COLUMN IF NOT EXISTS "assignedUserId" TEXT;

CREATE INDEX IF NOT EXISTS "fire_extinguishers_assignedUserId_idx" ON "fire_extinguishers"("assignedUserId");
CREATE INDEX IF NOT EXISTS "fire_extinguishers_status_idx" ON "fire_extinguishers"("status");
CREATE INDEX IF NOT EXISTS "fire_extinguishers_expiryDate_idx" ON "fire_extinguishers"("expiryDate");
