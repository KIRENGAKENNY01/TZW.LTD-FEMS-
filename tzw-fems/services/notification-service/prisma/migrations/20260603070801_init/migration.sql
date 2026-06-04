-- CreateEnum
CREATE TYPE "NotifType" AS ENUM ('INSPECTION_SCHEDULED', 'INSPECTION_OVERDUE', 'MAINTENANCE_COMPLETED', 'EXPIRY_ALERT', 'PASSWORD_RESET', 'GENERAL');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "type" "NotifType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
