/*
  Warnings:

  - The values [HR,VO2,RER,EE] on the enum `CalorieCountingMethod` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `UserEeCoefficient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserHrCalorieZone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRerMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserVo2Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CalorieCountingMethod_new" AS ENUM ('MODEL1', 'MODEL2', 'MODEL3', 'MODEL4');
ALTER TABLE "User" ALTER COLUMN "calorieCountingMethod" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "calorieCountingMethod" TYPE "CalorieCountingMethod_new" USING ("calorieCountingMethod"::text::"CalorieCountingMethod_new");
ALTER TYPE "CalorieCountingMethod" RENAME TO "CalorieCountingMethod_old";
ALTER TYPE "CalorieCountingMethod_new" RENAME TO "CalorieCountingMethod";
DROP TYPE "CalorieCountingMethod_old";
ALTER TABLE "User" ALTER COLUMN "calorieCountingMethod" SET DEFAULT 'MODEL1';
COMMIT;

-- DropForeignKey
ALTER TABLE "UserEeCoefficient" DROP CONSTRAINT "UserEeCoefficient_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserHrCalorieZone" DROP CONSTRAINT "UserHrCalorieZone_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRerMapping" DROP CONSTRAINT "UserRerMapping_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserVo2Profile" DROP CONSTRAINT "UserVo2Profile_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "calorieCountingMethod" SET DEFAULT 'MODEL1';

-- DropTable
DROP TABLE "UserEeCoefficient";

-- DropTable
DROP TABLE "UserHrCalorieZone";

-- DropTable
DROP TABLE "UserRerMapping";

-- DropTable
DROP TABLE "UserVo2Profile";

-- CreateTable
CREATE TABLE "UserCalProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "estimatedVo2Max" DOUBLE PRECISION NOT NULL,
    "vo2EfficiencyCoefficient" DOUBLE PRECISION NOT NULL,
    "restingMetabolicRate" DOUBLE PRECISION,
    "hrVo2Slope" DOUBLE PRECISION,
    "hrVo2Intercept" DOUBLE PRECISION,
    "hrRerSlope" DOUBLE PRECISION,
    "hrRerIntercept" DOUBLE PRECISION,
    "hrEeSlope" DOUBLE PRECISION,
    "hrEeIntercept" DOUBLE PRECISION,
    "o2RerSlope" DOUBLE PRECISION,
    "o2RerIntercept" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCalProfile_userId_key" ON "UserCalProfile"("userId");

-- AddForeignKey
ALTER TABLE "UserCalProfile" ADD CONSTRAINT "UserCalProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
