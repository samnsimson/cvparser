/*
  Warnings:

  - You are about to alter the column `title` on the `department` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `title` on the `job` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `firstName` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `lastName` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `address` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `city` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `state` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `country` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.

*/
-- AlterTable
ALTER TABLE "department" ALTER COLUMN "title" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "job" ALTER COLUMN "title" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "location" SET DATA TYPE VARCHAR;

-- AlterTable
ALTER TABLE "profile" ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "state" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(256);

-- CreateIndex
CREATE INDEX "candidate_email_idx" ON "candidate"("email");

-- CreateIndex
CREATE INDEX "profile_userId_idx" ON "profile"("userId");

-- CreateIndex
CREATE INDEX "resume_fileKey_idx" ON "resume"("fileKey");

-- CreateIndex
CREATE INDEX "user_name_email_phone_idx" ON "user"("name", "email", "phone");
