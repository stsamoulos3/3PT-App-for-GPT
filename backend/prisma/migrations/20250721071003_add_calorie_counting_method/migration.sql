-- CreateEnum
CREATE TYPE "CalorieCountingMethod" AS ENUM ('HR', 'VO2', 'RER', 'EE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "calorieCountingMethod" "CalorieCountingMethod" DEFAULT 'HR';
