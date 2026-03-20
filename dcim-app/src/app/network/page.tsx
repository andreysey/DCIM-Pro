export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import NetworkGrid from '@/components/NetworkGrid'

export default async function NetworkPage() {
  const devices = await prisma.networkDevice.findMany({
    include: { rack: { include: { datacenter: true } } },
    orderBy: { createdAt: 'desc' }
  })
  
  const serialized = devices.map(d => ({
    id: d.id,
    hostname: d.hostname,
    type: d.type,
    ipAddress: d.ipAddress,
    managementIp: d.managementIp,
    portsTotal: d.portsTotal,
    location: d.rack ? `${d.rack.datacenter.name} / ${d.rack.name} U${d.rackUStart}` : 'Unassigned'
  }))

  return (
    <div className="flex-col">
      <div className="flex-row justify-between mb-4">
        <h1 className="text-2xl" style={{ marginBottom: 0 }}>Network Inventory</h1>
        <Link href="/network/new" className="btn-primary">
          + Add Network Device
        </Link>
      </div>
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <NetworkGrid initialData={serialized} />
      </div>
    </div>
  )
}
