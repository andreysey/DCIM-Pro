import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ id: string }>

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params
    const server = await prisma.server.findUnique({
      where: { id },
      include: {
        rack: { include: { datacenter: true } },
        platform: true
      }
    })
    if (!server) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: server })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params
    const body = await req.json()
    const server = await prisma.server.update({
      where: { id },
      data: {
        assetTag: body.assetTag,
        serialNumber: body.serialNumber || null,
        status: body.status,
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
    return NextResponse.json({ data: server })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params
    await prisma.server.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}
