import { prisma } from '@/lib/prisma'
import ServerGrid from '@/components/ServerGrid'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ServersPage() {
  const servers = await prisma.server.findMany({
    include: {
      rack: {
        include: { datacenter: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // We serialize this to simple JSON
  const serialized = servers.map(s => ({
    id: s.id,
    assetTag: s.assetTag,
    serialNumber: s.serialNumber,
    status: s.status,
    location: s.rack ? `${s.rack.datacenter.name} / ${s.rack.name} U${s.rackUStart}` : 'Unassigned',
    ipAddress: s.ipAddress,
    cpuModel: s.cpuModel,
    ramGb: s.ramGb,
    storageGb: s.storageGb,
  }))

  return (
    <div className="flex-col">
      <div className="flex-row justify-between mb-4">
        <h1 className="text-2xl" style={{ marginBottom: 0 }}>Server Inventory</h1>
        <Link href="/servers/new" className="btn-primary">
          + Add Server
        </Link>
      </div>
      
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <ServerGrid initialData={serialized} />
      </div>
    </div>
  )
}
