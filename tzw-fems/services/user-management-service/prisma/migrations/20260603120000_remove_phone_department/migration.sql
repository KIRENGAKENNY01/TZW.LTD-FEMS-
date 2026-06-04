-- Drop phone and department from user profiles (no longer collected at signup)
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "phone";
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "department";
