-- CreateEnum
CREATE TYPE "public"."TreatmentAvailability" AS ENUM ('AVAILABLE', 'SOON');

-- AlterTable
ALTER TABLE "public"."Bookings" ALTER COLUMN "confirmedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Treatments" ADD COLUMN     "availability" "public"."TreatmentAvailability" NOT NULL DEFAULT 'SOON',
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';
