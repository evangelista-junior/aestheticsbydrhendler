/*
  Warnings:

  - The `date` column on the `Bookings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Bookings" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3);
