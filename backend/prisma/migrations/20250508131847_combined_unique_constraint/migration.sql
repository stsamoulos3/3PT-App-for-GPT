/*
  Warnings:

  - A unique constraint covering the columns `[userId,hkId]` on the table `Nutrition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,hkId]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Nutrition_hkId_key";

-- DropIndex
DROP INDEX "Workout_hkId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Nutrition_userId_hkId_key" ON "Nutrition"("userId", "hkId");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_userId_hkId_key" ON "Workout"("userId", "hkId");
