/*
  Warnings:

  - Made the column `createdById` on table `resume` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "resume" DROP CONSTRAINT "resume_createdById_fkey";

-- AlterTable
ALTER TABLE "resume" ALTER COLUMN "createdById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "resume" ADD CONSTRAINT "resume_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
