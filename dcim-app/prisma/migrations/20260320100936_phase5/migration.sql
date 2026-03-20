-- AlterTable
ALTER TABLE "CatalogDisk" ADD COLUMN "manufacturer" TEXT;

-- AlterTable
ALTER TABLE "CatalogRam" ADD COLUMN "manufacturer" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CatalogServerPlatform" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "socket" TEXT NOT NULL,
    "socketNum" INTEGER NOT NULL DEFAULT 1,
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
