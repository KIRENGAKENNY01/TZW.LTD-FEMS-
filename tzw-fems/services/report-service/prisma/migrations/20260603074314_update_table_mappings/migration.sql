/*
  Warnings:

  - You are about to drop the `ExportJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReportCache` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExportJob" DROP CONSTRAINT "ExportJob_reportCacheId_fkey";

-- DropTable
DROP TABLE "ExportJob";

-- DropTable
DROP TABLE "ReportCache";

-- CreateTable
CREATE TABLE "report_caches" (
    "id" TEXT NOT NULL,
    "reportType" "ReportType" NOT NULL,
    "period" "Period" NOT NULL,
    "payload" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_caches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_jobs" (
    "id" TEXT NOT NULL,
    "reportCacheId" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "format" "ExportFmt" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "export_jobs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "export_jobs" ADD CONSTRAINT "export_jobs_reportCacheId_fkey" FOREIGN KEY ("reportCacheId") REFERENCES "report_caches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
