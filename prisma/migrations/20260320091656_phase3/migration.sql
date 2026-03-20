-- CreateTable
CREATE TABLE "CatalogAttribute" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "NetworkDevice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hostname" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ipAddress" TEXT,
    "managementIp" TEXT,
    "managementUser" TEXT,
    "managementPass" TEXT,
    "portsTotal" INTEGER DEFAULT 24,
    "rackId" TEXT,
    "rackUStart" INTEGER,
    "rackUSize" INTEGER DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NetworkDevice_rackId_fkey" FOREIGN KEY ("rackId") REFERENCES "Rack" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "NetworkDevice_hostname_key" ON "NetworkDevice"("hostname");
