import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const datacenterId = searchParams.get('datacenterId')
  
  const where: any = {}
  if (status) where.status = status
  if (datacenterId) where.rack = { datacenterId }

  try {
    const servers = await prisma.server.findMany({
      where,
      include: {
        rack: { include: { datacenter: true } },
        platform: true,
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ data: servers, total: servers.length })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const server = await prisma.server.create({
      data: {
        assetTag: body.assetTag,
        serialNumber: body.serialNumber || null,
        status: body.status || 'New',
        rackId: body.rackId || null,
        rackUStart: body.rackUStart ? parseInt(body.rackUStart) : null,
        rackUSize: body.rackUSize ? parseInt(body.rackUSize) : 1,
        ipAddress: body.ipAddress || null,
        
        managementIp: body.managementIp || null,
        managementUser: body.managementUser || null,
        managementPass: body.managementPass || null,
        platformId: body.platformId || null,

        cpuModel: body.cpuModel || null,
        cpuCores: body.cpuCores ? parseInt(body.cpuCores) : null,
        ramGb: body.ramGb ? parseInt(body.ramGb) : null,
        storageGb: body.storageGb ? parseInt(body.storageGb) : null
      }
    })
    return NextResponse.json({ data: server }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}
