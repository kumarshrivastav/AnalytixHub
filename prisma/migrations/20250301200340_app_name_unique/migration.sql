/*
  Warnings:

  - A unique constraint covering the columns `[appName]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_appName_key" ON "ApiKey"("appName");
