/*
  Warnings:

  - The primary key for the `EmailLog` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "EmailLog" DROP CONSTRAINT "EmailLog_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "EmailLog_id_seq";
