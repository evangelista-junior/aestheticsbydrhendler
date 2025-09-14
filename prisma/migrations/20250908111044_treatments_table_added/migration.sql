-- CreateTable
CREATE TABLE "public"."Treatments" (
    "id" TEXT NOT NULL,
    "stripeProductNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Treatments_pkey" PRIMARY KEY ("id")
);
