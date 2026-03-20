import { prisma } from '../src/lib/prisma'

async function main() {
  // Clear existing
  await prisma.server.deleteMany()
  await prisma.rack.deleteMany()
  await prisma.datacenter.deleteMany()

  const dc1 = await prisma.datacenter.create({
    data: {
      name: 'DC-Alpha',
      location: 'New York Data Center',
      racks: {
        create: [
          { name: 'Row-A-Rack-01', unitsTotal: 42 },
          { name: 'Row-A-Rack-02', unitsTotal: 42 }
        ]
      }
    },
    include: {
      racks: true
    }
  })

  const dc2 = await prisma.datacenter.create({
    data: {
      name: 'DC-Beta',
      location: 'London Data Center',
      racks: {
        create: [
          { name: 'Row-B-Rack-01', unitsTotal: 47 }
        ]
      }
    },
    include: {
      racks: true
    }
  })

  await prisma.server.create({
    data: {
      assetTag: 'SRV-NY-001',
      serialNumber: 'DELL-123456',
      status: 'Active',
      rackId: dc1.racks[0].id,
      rackUStart: 10,
      rackUSize: 2,
      ipAddress: '192.168.10.50',
      cpuModel: 'Dual Intel Xeon Gold 6230',
      cpuCores: 40,
      ramGb: 128,
      storageGb: 4000
    }
  })

  await prisma.server.create({
    data: {
      assetTag: 'SRV-LDN-002',
      serialNumber: 'HP-987654',
      status: 'Maintenance',
      rackId: dc2.racks[0].id,
      rackUStart: 1,
      rackUSize: 1,
      ipAddress: '10.0.5.20',
      cpuModel: 'AMD EPYC 7742',
      cpuCores: 64,
      ramGb: 256,
      storageGb: 8000
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
