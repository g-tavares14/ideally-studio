import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Configuração da CLI do Prisma.
 *
 * No Prisma 7 a connection string saiu do `schema.prisma`: a CLI a lê daqui e
 * o runtime a recebe pelo driver adapter (ver `src/index.ts`). São dois
 * caminhos diferentes para a mesma variável de ambiente.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
