// Server-only module — imported by Server Components and Route Handlers,
// never by Client Components (Prisma runs in Node.js, not the browser).
//
// The global-singleton pattern matters in dev: Next.js hot-reloads re-evaluate
// modules on every change, which would otherwise create a new PrismaClient
// (and a new SQLite connection) per reload and eventually exhaust resources.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
