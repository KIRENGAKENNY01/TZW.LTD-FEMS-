-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('INVENTORY', 'INSPECTION', 'COMPLIANCE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "Period" AS ENUM ('DAILY', 'MONTHLY', 'YEARLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ExportFmt" AS ENUM ('PDF', 'CSV');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'DONE', 'FAILED');

-- CreateTable
CREATE TABLE "ReportCache" (
    "id" TEXT NOT NULL,
    "reportType" "ReportType" NOT NULL,
    "period" "Period" NOT NULL,
    "payload" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExportJob" (
    "id" TEXT NOT NULL,
    "reportCacheId" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "format" "ExportFmt" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExportJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExportJob" ADD CONSTRAINT "ExportJob_reportCacheId_fkey" FOREIGN KEY ("reportCacheId") REFERENCES "ReportCache"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
