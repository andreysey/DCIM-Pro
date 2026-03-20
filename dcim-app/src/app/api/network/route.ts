import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const devices = await prisma.networkDevice.findMany({
      include: {
        rack: { include: { datacenter: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ data: devices })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const device = await prisma.networkDevice.create({
       data: {
         hostname: body.hostname,
         type: body.type, // Switch, Router
         ipAddress: body.ipAddress || null,
         managementIp: body.managementIp || null,
         managementUser: body.managementUser || null,
         managementPass: body.managementPass || null,
         portsTotal: body.portsTotal ? parseInt(body.portsTotal) : null,
         rackId: body.rackId || null,
         rackUStart: body.rackUStart ? parseInt(body.rackUStart) : null,
         rackUSize: body.rackUSize ? parseInt(body.rackUSize) : 1,
       }
    })
    return NextResponse.json({ data: device }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}
