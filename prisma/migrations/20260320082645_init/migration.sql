-- CreateTable
CREATE TABLE "Datacenter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT
);

-- CreateTable
CREATE TABLE "Rack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "unitsTotal" INTEGER NOT NULL DEFAULT 42,
    "datacenterId" TEXT NOT NULL,
    CONSTRAINT "Rack_datacenterId_fkey" FOREIGN KEY ("datacenterId") REFERENCES "Datacenter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Server" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Server_rackId_fkey" FOREIGN KEY ("rackId") REFERENCES "Rack" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_assetTag_key" ON "Server"("assetTag");
