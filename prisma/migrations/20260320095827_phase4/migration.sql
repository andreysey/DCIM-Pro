/*
  Warnings:

  - You are about to drop the column `diskSlots` on the `CatalogServerPlatform` table. All the data in the column will be lost.
  - You are about to drop the column `pcieSlots` on the `CatalogServerPlatform` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PlatformPcieSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platformId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "width" TEXT NOT NULL,
    CONSTRAINT "PlatformPcieSlot_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "CatalogServerPlatform" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlatformDiskSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platformId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "interface" TEXT NOT NULL,
    CONSTRAINT "PlatformDiskSlot_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "CatalogServerPlatform" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CatalogDisk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storageType" TEXT NOT NULL DEFAULT 'SSD',
    "formFactor" TEXT NOT NULL,
    "capacityGb" INTEGER NOT NULL,
    "interface" TEXT NOT NULL
);
INSERT INTO "new_CatalogDisk" ("capacityGb", "formFactor", "id", "interface") SELECT "capacityGb", "formFactor", "id", "interface" FROM "CatalogDisk";
DROP TABLE "CatalogDisk";
ALTER TABLE "new_CatalogDisk" RENAME TO "CatalogDisk";
CREATE TABLE "new_CatalogServerPlatform" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "socket" TEXT NOT NULL,
    "ramType" TEXT NOT NULL,
    "ramSlots" INTEGER NOT NULL,
    "heightU" INTEGER NOT NULL,
    "remoteMgmtType" TEXT NOT NULL
);
INSERT INTO "new_CatalogServerPlatform" ("heightU", "id", "manufacturer", "model", "ramSlots", "ramType", "remoteMgmtType", "socket") SELECT "heightU", "id", "manufacturer", "model", "ramSlots", "ramType", "remoteMgmtType", "socket" FROM "CatalogServerPlatform";
DROP TABLE "CatalogServerPlatform";
ALTER TABLE "new_CatalogServerPlatform" RENAME TO "CatalogServerPlatform";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
