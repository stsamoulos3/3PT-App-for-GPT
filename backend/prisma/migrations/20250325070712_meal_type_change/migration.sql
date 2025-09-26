/*
  Warnings:

  - Changed the type of `meal` on the `FoodLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- AlterTable
ALTER TABLE "FoodLog" DROP COLUMN "meal",
ADD COLUMN     "meal" "MealType" NOT NULL;
