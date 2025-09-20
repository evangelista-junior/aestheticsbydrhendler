-- AlterTable
ALTER TABLE "public"."Treatments" ADD COLUMN     "blogUrl" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "imageUrl" DROP DEFAULT;
