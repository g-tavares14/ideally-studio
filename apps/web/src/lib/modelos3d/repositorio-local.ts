import { randomUUID } from 'node:crypto';
import { mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { FormatoModelo3D, Modelo3D, NovoModelo3D, RepositorioModelos3D } from './contratos';

const ARQUIVOS_POR_FORMATO: Record<FormatoModelo3D, string> = {
  '3mf': 'fonte.3mf',
  glb: 'modelo.glb',
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validarId(id: string): void {
  if (!UUID_PATTERN.test(id)) {
    throw new Error('Identificador de modelo 3D inválido.');
  }
}

function validarMetadados(valor: unknown): Modelo3D {
  if (
    typeof valor !== 'object' ||
    valor === null ||
    !('id' in valor) ||
    typeof valor.id !== 'string' ||
    !UUID_PATTERN.test(valor.id) ||
    !('nome' in valor) ||
    typeof valor.nome !== 'string' ||
    !('nomeArquivo' in valor) ||
    typeof valor.nomeArquivo !== 'string' ||
    !('triangulos' in valor) ||
    typeof valor.triangulos !== 'number' ||
    !Number.isInteger(valor.triangulos) ||
    !('criadoEm' in valor) ||
    typeof valor.criadoEm !== 'string'
  ) {
    throw new Error('Metadados de modelo 3D inválidos.');
  }

  return {
    id: valor.id,
    nome: valor.nome,
    nomeArquivo: valor.nomeArquivo,
    triangulos: valor.triangulos,
    criadoEm: valor.criadoEm,
  };
}

export function criarRepositorioModelos3DLocal(diretorio: string): RepositorioModelos3D {
  return {
    async salvar(novoModelo: NovoModelo3D): Promise<Modelo3D> {
      await mkdir(diretorio, { recursive: true });

      const id = randomUUID();
      const diretorioFinal = join(diretorio, id);
      const diretorioTemporario = join(diretorio, `.${id}-${randomUUID()}.tmp`);
      const modelo: Modelo3D = {
        id,
        nome: novoModelo.nome,
        nomeArquivo: novoModelo.nomeArquivo,
        triangulos: novoModelo.triangulos,
        criadoEm: new Date().toISOString(),
      };

      try {
        await mkdir(diretorioTemporario);
        const metadados = `${JSON.stringify(modelo, null, 2)}\n`;
        await Promise.all([
          writeFile(join(diretorioTemporario, ARQUIVOS_POR_FORMATO['3mf']), novoModelo.arquivo3mf),
          writeFile(join(diretorioTemporario, ARQUIVOS_POR_FORMATO.glb), novoModelo.arquivoGlb),
          writeFile(join(diretorioTemporario, 'metadata.json'), metadados, 'utf8'),
        ]);
        await rename(diretorioTemporario, diretorioFinal);
        return modelo;
      } catch (erro) {
        await rm(diretorioTemporario, { recursive: true, force: true });
        throw erro;
      }
    },

    async listar(): Promise<Modelo3D[]> {
      await mkdir(diretorio, { recursive: true });
      const entradas = await readdir(diretorio, { withFileTypes: true });
      const diretoriosDeModelos = entradas.filter(
        (entrada) => entrada.isDirectory() && UUID_PATTERN.test(entrada.name),
      );

      const modelos = await Promise.all(
        diretoriosDeModelos.map(async (entrada) => {
          const conteudo = await readFile(join(diretorio, entrada.name, 'metadata.json'), 'utf8');
          const modelo = validarMetadados(JSON.parse(conteudo) as unknown);

          if (modelo.id !== entrada.name) {
            throw new Error('O identificador dos metadados não corresponde ao diretório.');
          }

          return modelo;
        }),
      );

      return modelos.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
    },

    async lerArquivo(id: string, formato: FormatoModelo3D): Promise<Uint8Array | null> {
      validarId(id);

      try {
        const arquivo = await readFile(join(diretorio, id, ARQUIVOS_POR_FORMATO[formato]));
        return Uint8Array.from(arquivo);
      } catch (erro) {
        if (typeof erro === 'object' && erro !== null && 'code' in erro && erro.code === 'ENOENT') {
          return null;
        }

        throw erro;
      }
    },
  };
}
