import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { RepositorioModelos3D } from './contratos';
import { criarRepositorioModelos3DLocal } from './repositorio-local';

function encontrarRaizMonorepo(inicio: string): string {
  let diretorio = resolve(inicio);

  while (true) {
    if (
      existsSync(resolve(diretorio, 'apps/web/package.json')) &&
      existsSync(resolve(diretorio, 'packages'))
    ) {
      return diretorio;
    }

    const pai = dirname(diretorio);
    if (pai === diretorio) {
      return resolve(inicio);
    }
    diretorio = pai;
  }
}

export function resolverDiretorioModelos3D(
  diretorioConfigurado = process.env.LOCAL_MODEL_STORAGE_DIR,
  diretorioAtual = process.cwd(),
): string {
  if (diretorioConfigurado?.trim()) {
    return resolve(diretorioAtual, diretorioConfigurado);
  }

  return resolve(encontrarRaizMonorepo(diretorioAtual), 'doc/modelos');
}

let repositorio: RepositorioModelos3D | undefined;

export function obterRepositorioModelos3D(): RepositorioModelos3D {
  repositorio ??= criarRepositorioModelos3DLocal(resolverDiretorioModelos3D());
  return repositorio;
}
