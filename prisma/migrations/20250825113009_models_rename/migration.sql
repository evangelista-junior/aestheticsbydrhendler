/*
  Warnings:

  - You are about to drop the `BOOKINGS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PAYMENTTOKENS` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."BOOKINGS" DROP CONSTRAINT "BOOKINGS_tokenId_fkey";

-- DropTable
DROP TABLE "public"."BOOKINGS";

-- DropTable
DROP TABLE "public"."PAYMENTTOKENS";

-- CreateTable
CREATE TABLE "public"."PaymentTokens" (
    "id" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "status" "public"."TokenStatus" NOT NULL DEFAULT 'PENDING',
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "service" TEXT NOT NULL,
    "date" TEXT,
    "time" TEXT,
    "notes" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AUD',
    "provider" TEXT,
    "providerRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bookings" (
    "id" TEXT NOT NULL,
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "service" TEXT NOT NULL,
    "date" TEXT,
    "time" TEXT,
    "notes" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "tokenId" TEXT NOT NULL,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTokens_jti_key" ON "public"."PaymentTokens"("jti");

-- CreateIndex
CREATE INDEX "PaymentTokens_status_expiresAt_idx" ON "public"."PaymentTokens"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "PaymentTokens_email_status_idx" ON "public"."PaymentTokens"("email", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Bookings_tokenId_key" ON "public"."Bookings"("tokenId");

-- AddForeignKey
ALTER TABLE "public"."Bookings" ADD CONSTRAINT "Bookings_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "public"."PaymentTokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
