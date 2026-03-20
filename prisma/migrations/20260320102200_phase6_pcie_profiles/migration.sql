-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlatformPcieSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platformId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "width" TEXT NOT NULL,
    "heightProfile" TEXT NOT NULL DEFAULT 'FH',
    "lengthProfile" TEXT NOT NULL DEFAULT 'FL',
    CONSTRAINT "PlatformPcieSlot_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "CatalogServerPlatform" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PlatformPcieSlot" ("id", "platformId", "version", "width") SELECT "id", "platformId", "version", "width" FROM "PlatformPcieSlot";
DROP TABLE "PlatformPcieSlot";
ALTER TABLE "new_PlatformPcieSlot" RENAME TO "PlatformPcieSlot";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
