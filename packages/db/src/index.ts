import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/client';

/**
 * O cliente Prisma.
 *
 * Prisma 7 exige um driver adapter — aqui o do Neon, que usa o pooler dele em
 * vez de abrir uma conexão TCP por invocação. É o que faz sentido num ambiente
 * serverless, onde cada requisição pode ser um processo novo.
 *
 * Em desenvolvimento o cliente é guardado no escopo global: sem isso, o
 * hot reload cria um cliente por recarga e esgota o limite de conexões.
 */

const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient };

function criar() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL não está definida');
  }
  return new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
}

export const db = globalParaPrisma.prisma ?? criar();

if (process.env.NODE_ENV !== 'production') {
  globalParaPrisma.prisma = db;
}

export * from '../generated/client';
