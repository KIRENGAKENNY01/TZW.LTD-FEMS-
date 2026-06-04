-- CreateEnum
CREATE TYPE "ExtType" AS ENUM ('WATER', 'CO2', 'FOAM', 'DRY_CHEMICAL');

-- CreateEnum
CREATE TYPE "ExtSize" AS ENUM ('LB_1_5', 'LB_5', 'LB_9', 'LB_12');

-- CreateEnum
CREATE TYPE "ExtStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED', 'UNDER_MAINTENANCE');

-- CreateTable
CREATE TABLE "FireExtinguisher" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "building" TEXT,
    "floor" TEXT,
    "type" "ExtType" NOT NULL,
    "size" "ExtSize" NOT NULL,
    "installationDate" DATE NOT NULL,
    "expiryDate" DATE NOT NULL,
    "status" "ExtStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "registeredBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FireExtinguisher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FireExtinguisher_serialNumber_key" ON "FireExtinguisher"("serialNumber");
