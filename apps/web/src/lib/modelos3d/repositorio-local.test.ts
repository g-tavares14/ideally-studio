// @vitest-environment node

import { mkdir, mkdtemp, readdir, rm, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { lerNovoModelo3D, requisicaoLocalPermitida } from '../../app/api/admin/modelos/_suporte';
import { resolverDiretorioModelos3D } from './armazenamento';
import type { NovoModelo3D } from './contratos';
import { criarRepositorioModelos3DLocal } from './repositorio-local';

const diretoriosTemporarios: string[] = [];

async function criarDiretorioTemporario(): Promise<string> {
  const diretorio = await mkdtemp(join(tmpdir(), 'modelos3d-'));
  diretoriosTemporarios.push(diretorio);
  return diretorio;
}

function novoModelo(): NovoModelo3D {
  return {
    nome: 'Vaso de teste',
    nomeArquivo: 'vaso.3mf',
    triangulos: 12,
    arquivo3mf: Uint8Array.from([0x50, 0x4b, 0x03, 0x04]),
    arquivoGlb: Uint8Array.from([0x67, 0x6c, 0x54, 0x46]),
  };
}

afterEach(async () => {
  await Promise.all(
    diretoriosTemporarios.splice(0).map((diretorio) =>
      rm(diretorio, {
        recursive: true,
        force: true,
      }),
    ),
  );
});

describe('RepositorioModelos3DLocal', () => {
  it('salva os arquivos e retorna apenas os metadados', async () => {
    const diretorio = await criarDiretorioTemporario();
    const repositorio = criarRepositorioModelos3DLocal(diretorio);

    const salvo = await repositorio.salvar(novoModelo());

    expect(salvo).toMatchObject({
      nome: 'Vaso de teste',
      nomeArquivo: 'vaso.3mf',
      triangulos: 12,
    });
    expect(salvo.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(Number.isNaN(Date.parse(salvo.criadoEm))).toBe(false);
    expect(await readdir(join(diretorio, salvo.id))).toEqual(
      expect.arrayContaining(['fonte.3mf', 'metadata.json', 'modelo.glb']),
    );
  });

  it('lista usando somente metadata.json', async () => {
    const diretorio = await criarDiretorioTemporario();
    const repositorio = criarRepositorioModelos3DLocal(diretorio);
    const salvo = await repositorio.salvar(novoModelo());

    await unlink(join(diretorio, salvo.id, 'fonte.3mf'));
    await unlink(join(diretorio, salvo.id, 'modelo.glb'));

    await expect(repositorio.listar()).resolves.toEqual([salvo]);
  });

  it('lê o formato solicitado e retorna null para modelo ausente', async () => {
    const diretorio = await criarDiretorioTemporario();
    const repositorio = criarRepositorioModelos3DLocal(diretorio);
    const entrada = novoModelo();
    const salvo = await repositorio.salvar(entrada);

    await expect(repositorio.lerArquivo(salvo.id, '3mf')).resolves.toEqual(entrada.arquivo3mf);
    await expect(repositorio.lerArquivo(salvo.id, 'glb')).resolves.toEqual(entrada.arquivoGlb);
    await expect(
      repositorio.lerArquivo('00000000-0000-4000-8000-000000000000', 'glb'),
    ).resolves.toBeNull();
  });

  it('rejeita identificadores que possam escapar do diretório', async () => {
    const diretorio = await criarDiretorioTemporario();
    const repositorio = criarRepositorioModelos3DLocal(diretorio);

    await expect(repositorio.lerArquivo('../../segredo', '3mf')).rejects.toThrow(
      'Identificador de modelo 3D inválido',
    );
  });

  it('remove o diretório temporário quando a gravação falha', async () => {
    const diretorio = await criarDiretorioTemporario();
    const repositorio = criarRepositorioModelos3DLocal(diretorio);
    const entrada = {
      ...novoModelo(),
      triangulos: 1n as unknown as number,
    };

    await expect(repositorio.salvar(entrada)).rejects.toThrow();
    await expect(readdir(diretorio)).resolves.toEqual([]);
  });
});

describe('composição do armazenamento local', () => {
  it('resolve doc/modelos a partir da raiz do monorepo', async () => {
    const raiz = await criarDiretorioTemporario();
    await Promise.all([
      mkdir(join(raiz, 'apps/web'), { recursive: true }),
      mkdir(join(raiz, 'packages'), { recursive: true }),
    ]);
    await writeFile(join(raiz, 'apps/web/package.json'), '{}', 'utf8');

    expect(resolverDiretorioModelos3D(undefined, join(raiz, 'apps/web'))).toBe(
      join(raiz, 'doc/modelos'),
    );
  });

  it('prioriza o diretório configurado', async () => {
    const raiz = await criarDiretorioTemporario();

    expect(resolverDiretorioModelos3D('./arquivos-de-teste', raiz)).toBe(
      join(raiz, 'arquivos-de-teste'),
    );
  });
});

describe('validação da API local', () => {
  it('permite apenas desenvolvimento em host loopback', () => {
    expect(
      requisicaoLocalPermitida(
        new Request('http://localhost:3000/api/admin/modelos'),
        'development',
      ),
    ).toBe(true);
    expect(
      requisicaoLocalPermitida(
        new Request('http://127.0.0.1:3000/api/admin/modelos'),
        'development',
      ),
    ).toBe(true);
    expect(
      requisicaoLocalPermitida(
        new Request('http://localhost:3000/api/admin/modelos'),
        'production',
      ),
    ).toBe(false);
    expect(
      requisicaoLocalPermitida(new Request('https://exemplo.com/api/admin/modelos'), 'development'),
    ).toBe(false);
    expect(
      requisicaoLocalPermitida(
        new Request('http://localhost:3000/api/admin/modelos', {
          headers: { Host: 'exemplo.com' },
        }),
        'development',
      ),
    ).toBe(false);
  });

  it('monta a entrada após validar 3MF e GLB', async () => {
    const formData = criarFormularioValido();

    await expect(
      lerNovoModelo3D(
        new Request('http://localhost:3000/api/admin/modelos', {
          method: 'POST',
          body: formData,
        }),
      ),
    ).resolves.toMatchObject({
      nome: 'Vaso local',
      nomeArquivo: 'vaso.3mf',
      triangulos: 2,
    });
  });

  it('rejeita assinatura 3MF inválida', async () => {
    const formData = criarFormularioValido();
    formData.set(
      'arquivo3mf',
      new File([Uint8Array.from([0, 0, 0, 0])], 'vaso.3mf', { type: 'model/3mf' }),
    );

    await expect(
      lerNovoModelo3D(
        new Request('http://localhost:3000/api/admin/modelos', {
          method: 'POST',
          body: formData,
        }),
      ),
    ).rejects.toThrow('O arquivo 3MF não é um pacote ZIP válido.');
  });
});

function criarFormularioValido(): FormData {
  const formData = new FormData();
  const glb = new Uint8Array(12);
  glb.set([0x67, 0x6c, 0x54, 0x46]);
  const cabecalho = new DataView(glb.buffer);
  cabecalho.setUint32(4, 2, true);
  cabecalho.setUint32(8, glb.length, true);

  formData.set('nome', 'Vaso local');
  formData.set('triangulos', '2');
  formData.set(
    'arquivo3mf',
    new File([Uint8Array.from([0x50, 0x4b, 0x03, 0x04])], 'vaso.3mf', {
      type: 'model/3mf',
    }),
  );
  formData.set('arquivoGlb', new File([glb], 'vaso.glb', { type: 'model/gltf-binary' }));

  return formData;
}
