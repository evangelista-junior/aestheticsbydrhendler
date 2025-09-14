/*
  Warnings:

  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_tokenId_fkey";

-- DropTable
DROP TABLE "public"."Booking";

-- DropTable
DROP TABLE "public"."PaymentToken";

-- CreateTable
CREATE TABLE "public"."PAYMENTTOKENS" (
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

    CONSTRAINT "PAYMENTTOKENS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BOOKINGS" (
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

    CONSTRAINT "BOOKINGS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PAYMENTTOKENS_jti_key" ON "public"."PAYMENTTOKENS"("jti");

-- CreateIndex
CREATE INDEX "PAYMENTTOKENS_status_expiresAt_idx" ON "public"."PAYMENTTOKENS"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "PAYMENTTOKENS_email_status_idx" ON "public"."PAYMENTTOKENS"("email", "status");

-- CreateIndex
CREATE UNIQUE INDEX "BOOKINGS_tokenId_key" ON "public"."BOOKINGS"("tokenId");

-- AddForeignKey
ALTER TABLE "public"."BOOKINGS" ADD CONSTRAINT "BOOKINGS_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "public"."PAYMENTTOKENS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
