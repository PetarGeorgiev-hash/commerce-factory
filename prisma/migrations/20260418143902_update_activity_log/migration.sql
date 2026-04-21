/*
  Warnings:

  - You are about to drop the column `timestamp` on the `ActivityLog` table. All the data in the column will be lost.
  - Added the required column `entity` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_id_fkey";

-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "entity" TEXT NOT NULL,
ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "postId" TEXT;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
