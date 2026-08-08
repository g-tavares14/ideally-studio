import { resolve } from 'node:path';
import type { RepositorioModelos3D } from './contratos';
import { criarRepositorioModelos3DLocal } from './repositorio-local';

export function resolverDiretorioModelos3D(
  diretorioConfigurado = process.env.LOCAL_MODEL_STORAGE_DIR,
  diretorioAtual = process.cwd(),
): string {
  const destino = diretorioConfigurado?.trim() || '../../doc/modelos';
  return resolve(diretorioAtual, destino);
}

let repositorio: RepositorioModelos3D | undefined;

export function obterRepositorioModelos3D(): RepositorioModelos3D {
  repositorio ??= criarRepositorioModelos3DLocal(resolverDiretorioModelos3D());
  return repositorio;
}
