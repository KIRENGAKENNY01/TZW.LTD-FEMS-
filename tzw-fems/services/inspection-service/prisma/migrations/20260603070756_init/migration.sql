-- CreateEnum
CREATE TYPE "InspStatus" AS ENUM ('PENDING', 'COMPLETED', 'OVERDUE', 'CANCELLED');

-- CreateTable
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL,
    "extinguisherId" TEXT NOT NULL,
    "inspectorId" TEXT NOT NULL,
    "scheduledBy" TEXT NOT NULL,
    "scheduledDate" DATE NOT NULL,
    "scheduledTime" TEXT NOT NULL,
    "status" "InspStatus" NOT NULL DEFAULT 'PENDING',
    "result" TEXT,
    "notes" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceLog" (
    "id" TEXT NOT NULL,
    "extinguisherId" TEXT NOT NULL,
    "inspectorId" TEXT NOT NULL,
    "inspectionId" TEXT NOT NULL,
    "actionTaken" TEXT NOT NULL,
    "issuesIdentified" TEXT,
    "recommendations" TEXT,
    "maintenanceDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceLog_inspectionId_key" ON "MaintenanceLog"("inspectionId");

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "Inspection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
