/*
  Warnings:

  - A unique constraint covering the columns `[userId,worksheetId]` on the table `DownloadHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DownloadHistory_userId_worksheetId_key" ON "DownloadHistory"("userId", "worksheetId");
