-- DropForeignKey
ALTER TABLE "resume" DROP CONSTRAINT "resume_createdById_fkey";

-- DropIndex
DROP INDEX "resume_fileKey_idx";

-- AlterTable
ALTER TABLE "resume" ALTER COLUMN "createdById" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "resume_fileKey_createdById_idx" ON "resume"("fileKey", "createdById");

-- AddForeignKey
ALTER TABLE "resume" ADD CONSTRAINT "resume_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
