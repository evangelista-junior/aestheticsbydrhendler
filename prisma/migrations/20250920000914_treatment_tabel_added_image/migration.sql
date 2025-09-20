/*
  Warnings:

  - You are about to drop the column `imagePath` on the `Treatments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Treatments" DROP COLUMN "imagePath",
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '';
