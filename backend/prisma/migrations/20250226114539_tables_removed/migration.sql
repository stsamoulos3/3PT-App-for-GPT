/*
  Warnings:

  - You are about to drop the `BodyMeasurement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mobility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Steps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VitalSigns` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BodyMeasurement" DROP CONSTRAINT "BodyMeasurement_userId_fkey";

-- DropForeignKey
ALTER TABLE "Mobility" DROP CONSTRAINT "Mobility_userId_fkey";

-- DropForeignKey
ALTER TABLE "Steps" DROP CONSTRAINT "Steps_userId_fkey";

-- DropForeignKey
ALTER TABLE "Steps" DROP CONSTRAINT "Steps_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "VitalSigns" DROP CONSTRAINT "VitalSigns_userId_fkey";

-- DropTable
DROP TABLE "BodyMeasurement";

-- DropTable
DROP TABLE "Mobility";

-- DropTable
DROP TABLE "Steps";

-- DropTable
DROP TABLE "VitalSigns";
