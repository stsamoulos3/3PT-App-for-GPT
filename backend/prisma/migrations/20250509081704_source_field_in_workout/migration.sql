-- CreateEnum
CREATE TYPE "WorkoutSource" AS ENUM ('HEALTHKIT', 'MANUAL');

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "source" "WorkoutSource";
