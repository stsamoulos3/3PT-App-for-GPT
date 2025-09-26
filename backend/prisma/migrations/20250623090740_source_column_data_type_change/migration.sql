/*
  Warnings:

  - The `source` column on the `Workout` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- 1. Rename the old column
ALTER TABLE "Workout" RENAME COLUMN "source" TO "source_old";

-- 2. Add the new column as TEXT
ALTER TABLE "Workout" ADD COLUMN "source" TEXT;

-- 3. Copy data from old to new, converting enum to string
UPDATE "Workout" SET "source" = "source_old"::text;

-- 4. Drop the old column
ALTER TABLE "Workout" DROP COLUMN "source_old";

-- 5. Drop the enum type
DROP TYPE "WorkoutSource";
