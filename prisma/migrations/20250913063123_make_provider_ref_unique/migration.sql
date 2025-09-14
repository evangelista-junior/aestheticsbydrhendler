/*
  Warnings:

  - A unique constraint covering the columns `[providerRef]` on the table `PaymentTokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentTokens_providerRef_key" ON "public"."PaymentTokens"("providerRef");
