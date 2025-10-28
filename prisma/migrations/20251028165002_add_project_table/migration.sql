/*
  Warnings:

  - You are about to drop the column `name` on the `Diffuser` table. All the data in the column will be lost.
  - You are about to drop the column `designCFM` on the `Reading` table. All the data in the column will be lost.
  - You are about to drop the column `terminalSize` on the `Reading` table. All the data in the column will be lost.
  - You are about to drop the column `terminalType` on the `Reading` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Zone` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[deviceIdentifier]` on the table `Diffuser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `systemName` to the `Diffuser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `Reading` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Reading` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Zone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Zone" DROP CONSTRAINT "Zone_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Diffuser" DROP COLUMN "name",
ADD COLUMN     "deviceIdentifier" TEXT,
ADD COLUMN     "sizeFeet" DOUBLE PRECISION,
ADD COLUMN     "size_input" TEXT,
ADD COLUMN     "size_unit" TEXT,
ADD COLUMN     "systemName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Reading" DROP COLUMN "designCFM",
DROP COLUMN "terminalSize",
DROP COLUMN "terminalType",
ADD COLUMN     "actualCFM_raw" TEXT,
ADD COLUMN     "actualCFM_unit" TEXT,
ADD COLUMN     "actualTemp" DOUBLE PRECISION,
ADD COLUMN     "actualTemp_raw" TEXT,
ADD COLUMN     "actualTemp_unit" TEXT,
ADD COLUMN     "amperes" DOUBLE PRECISION,
ADD COLUMN     "areaName" TEXT,
ADD COLUMN     "grillTemp" DOUBLE PRECISION,
ADD COLUMN     "grillTemp_raw" TEXT,
ADD COLUMN     "grillTemp_unit" TEXT,
ADD COLUMN     "projectName" TEXT,
ADD COLUMN     "requiredCFM" DOUBLE PRECISION,
ADD COLUMN     "requiredCFM_raw" TEXT,
ADD COLUMN     "requiredCFM_unit" TEXT,
ADD COLUMN     "requiredTemp" DOUBLE PRECISION,
ADD COLUMN     "requiredTemp_raw" TEXT,
ADD COLUMN     "requiredTemp_unit" TEXT,
ADD COLUMN     "sessionId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "voltage" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Zone" DROP COLUMN "userId",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "ahuInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "sessionName" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "AHUInfo" JSONB,
    "motorDirectionDeg" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DiffuserMove" (
    "id" TEXT NOT NULL,
    "diffuserId" TEXT NOT NULL,
    "fromZoneId" TEXT,
    "toZoneId" TEXT NOT NULL,
    "movedBy" INTEGER NOT NULL,
    "movedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "DiffuserMove_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Diffuser_deviceIdentifier_key" ON "public"."Diffuser"("deviceIdentifier");

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Zone" ADD CONSTRAINT "Zone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "public"."Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reading" ADD CONSTRAINT "Reading_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiffuserMove" ADD CONSTRAINT "DiffuserMove_diffuserId_fkey" FOREIGN KEY ("diffuserId") REFERENCES "public"."Diffuser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
