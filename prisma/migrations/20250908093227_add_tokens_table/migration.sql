-- AlterTable
ALTER TABLE "public"."PaymentTokens" ALTER COLUMN "createdAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."Tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);
