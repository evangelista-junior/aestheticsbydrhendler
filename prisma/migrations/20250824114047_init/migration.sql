-- CreateEnum
CREATE TYPE "public"."TokenStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."PaymentToken" (
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

    CONSTRAINT "PaymentToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
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

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentToken_jti_key" ON "public"."PaymentToken"("jti");

-- CreateIndex
CREATE INDEX "PaymentToken_status_expiresAt_idx" ON "public"."PaymentToken"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "PaymentToken_email_status_idx" ON "public"."PaymentToken"("email", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_tokenId_key" ON "public"."Booking"("tokenId");

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "public"."PaymentToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
