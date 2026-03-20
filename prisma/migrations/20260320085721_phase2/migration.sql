-- CreateTable
CREATE TABLE "CatalogServerPlatform" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "socket" TEXT NOT NULL,
    "ramType" TEXT NOT NULL,
    "ramSlots" INTEGER NOT NULL,
    "heightU" INTEGER NOT NULL,
    "pcieSlots" INTEGER NOT NULL,
    "diskSlots" INTEGER NOT NULL,
    "remoteMgmtType" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CatalogProcessor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "socket" TEXT NOT NULL,
    "cores" INTEGER NOT NULL,
    "frequencyGhz" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "CatalogRam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ramType" TEXT NOT NULL,
    "capacityGb" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CatalogDisk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formFactor" TEXT NOT NULL,
    "capacityGb" INTEGER NOT NULL,
    "interface" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ServerProcessor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "serverId" TEXT NOT NULL,
    "processorId" TEXT NOT NULL,
    CONSTRAINT "ServerProcessor_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ServerProcessor_processorId_fkey" FOREIGN KEY ("processorId") REFERENCES "CatalogProcessor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ServerRam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "serverId" TEXT NOT NULL,
    "ramId" TEXT NOT NULL,
    CONSTRAINT "ServerRam_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ServerRam_ramId_fkey" FOREIGN KEY ("ramId") REFERENCES "CatalogRam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ServerDisk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "serverId" TEXT NOT NULL,
    "diskId" TEXT NOT NULL,
    CONSTRAINT "ServerDisk_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ServerDisk_diskId_fkey" FOREIGN KEY ("diskId") REFERENCES "CatalogDisk" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Server" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetTag" TEXT NOT NULL,
    "serialNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'New',
    "rackId" TEXT,
    "rackUStart" INTEGER,
    "rackUSize" INTEGER DEFAULT 1,
    "ipAddress" TEXT,
    "cpuModel" TEXT,
    "cpuCores" INTEGER,
    "ramGb" INTEGER,
    "storageGb" INTEGER,
    "managementIp" TEXT,
    "managementUser" TEXT,
    "managementPass" TEXT,
    "platformId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Server_rackId_fkey" FOREIGN KEY ("rackId") REFERENCES "Rack" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Server_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "CatalogServerPlatform" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Server" ("assetTag", "cpuCores", "cpuModel", "createdAt", "id", "ipAddress", "rackId", "rackUSize", "rackUStart", "ramGb", "serialNumber", "status", "storageGb", "updatedAt") SELECT "assetTag", "cpuCores", "cpuModel", "createdAt", "id", "ipAddress", "rackId", "rackUSize", "rackUStart", "ramGb", "serialNumber", "status", "storageGb", "updatedAt" FROM "Server";
DROP TABLE "Server";
ALTER TABLE "new_Server" RENAME TO "Server";
CREATE UNIQUE INDEX "Server_assetTag_key" ON "Server"("assetTag");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
