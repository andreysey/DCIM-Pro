import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment')
}

// In Prisma 7, the adapter takes an object with a 'url' property, not a Database instance
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL })

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
