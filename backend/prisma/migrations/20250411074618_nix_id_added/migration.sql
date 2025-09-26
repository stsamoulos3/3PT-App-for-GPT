-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "nixId" TEXT,
ADD COLUMN     "synced" BOOLEAN NOT NULL DEFAULT false;
