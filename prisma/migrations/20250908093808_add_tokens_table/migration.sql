/*
  Warnings:

  - You are about to drop the `Tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Tokens";

-- CreateTable
CREATE TABLE "public"."TokensJWT" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "TokensJWT_pkey" PRIMARY KEY ("id")
);
