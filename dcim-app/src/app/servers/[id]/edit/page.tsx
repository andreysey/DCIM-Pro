import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditServerForm from '@/components/EditServerForm'

export const dynamic = 'force-dynamic'

export default async function EditServerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [server, datacenters, platforms] = await Promise.all([
    prisma.server.findUnique({
      where: { id },
      include: {
        rack: { include: { datacenter: true } }
      }
    }),
    prisma.datacenter.findMany({ include: { racks: true } }),
    prisma.catalogServerPlatform.findMany({ orderBy: { manufacturer: 'asc' } })
  ])

  if (!server) return notFound()

  return (
    <EditServerForm
      server={JSON.parse(JSON.stringify(server))}
      datacenters={JSON.parse(JSON.stringify(datacenters))}
      platforms={JSON.parse(JSON.stringify(platforms))}
    />
  )
}
