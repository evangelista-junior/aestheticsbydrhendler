/*
  Warnings:

  - You are about to drop the column `blogUrl` on the `Treatments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Treatments" DROP COLUMN "blogUrl",
ADD COLUMN     "hasBlogContent" BOOLEAN NOT NULL DEFAULT false;
