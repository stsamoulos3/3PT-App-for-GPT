/*
  Warnings:

  - A unique constraint covering the columns `[nixId]` on the table `Food` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Food_nixId_key" ON "Food"("nixId");
