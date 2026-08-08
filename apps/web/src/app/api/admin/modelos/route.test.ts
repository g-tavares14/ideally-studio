// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Modelo3D, RepositorioModelos3D } from '@/lib/modelos3d/contratos';
import { GET, POST } from './route';
import { GET as baixarGlb } from './[id]/glb/route';

const mocks = vi.hoisted(() => ({
  repositorio: {
    salvar: vi.fn(),
    listar: vi.fn(),
    lerArquivo: vi.fn(),
  },
}));

vi.mock('@/lib/modelos3d/armazenamento', () => ({
  obterRepositorioModelos3D: () => mocks.repositorio as RepositorioModelos3D,
}));

const ID = 'f1593af9-5052-4787-a8ea-b587fc5b2b44';
const MODELO: Modelo3D = {
  id: ID,
  nome: 'Vaso local',
  nomeArquivo: 'vaso.3mf',
  triangulos: 2,
  criadoEm: '2026-08-07T12:00:00.000Z',
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('NODE_ENV', 'development');
  mocks.repositorio.salvar.mockResolvedValue(MODELO);
  mocks.repositorio.listar.mockResolvedValue([MODELO]);
  mocks.repositorio.lerArquivo.mockResolvedValue(Uint8Array.from([0x67, 0x6c, 0x54, 0x46]));
});

describe('API local de modelos 3D', () => {
  it('salva um multipart válido e devolve as URLs locais', async () => {
    const resposta = await POST(
      new Request('http://localhost:3000/api/admin/modelos', {
        method: 'POST',
        body: criarFormularioValido(),
      }),
    );

    expect(resposta.status).toBe(201);
    expect(resposta.headers.get('Cache-Control')).toBe('no-store');
    await expect(resposta.json()).resolves.toMatchObject({
      ...MODELO,
      url3mf: `/api/admin/modelos/${ID}/3mf`,
      urlGlb: `/api/admin/modelos/${ID}/glb`,
    });
    expect(mocks.repositorio.salvar).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Vaso local',
        nomeArquivo: 'vaso.3mf',
        triangulos: 2,
      }),
    );
  });

  it('lista modelos sem cache', async () => {
    const resposta = await GET(new Request('http://127.0.0.1:3000/api/admin/modelos'));

    expect(resposta.status).toBe(200);
    expect(resposta.headers.get('Cache-Control')).toBe('no-store');
    await expect(resposta.json()).resolves.toEqual([
      expect.objectContaining({ id: ID, urlGlb: `/api/admin/modelos/${ID}/glb` }),
    ]);
  });

  it('serve o GLB com o tipo correto', async () => {
    const resposta = await baixarGlb(
      new Request(`http://localhost:3000/api/admin/modelos/${ID}/glb`),
      { params: Promise.resolve({ id: ID }) },
    );

    expect(resposta.status).toBe(200);
    expect(resposta.headers.get('Content-Type')).toBe('model/gltf-binary');
    expect(resposta.headers.get('Cache-Control')).toBe('no-store');
    expect(new Uint8Array(await resposta.arrayBuffer())).toEqual(
      Uint8Array.from([0x67, 0x6c, 0x54, 0x46]),
    );
  });

  it('oculta os endpoints fora do localhost', async () => {
    const resposta = await GET(new Request('https://exemplo.com/api/admin/modelos'));

    expect(resposta.status).toBe(404);
    expect(mocks.repositorio.listar).not.toHaveBeenCalled();
  });
});

function criarFormularioValido(): FormData {
  const glb = new Uint8Array(12);
  glb.set([0x67, 0x6c, 0x54, 0x46]);
  const cabecalho = new DataView(glb.buffer);
  cabecalho.setUint32(4, 2, true);
  cabecalho.setUint32(8, glb.length, true);

  const formulario = new FormData();
  formulario.set('nome', 'Vaso local');
  formulario.set('triangulos', '2');
  formulario.set(
    'arquivo3mf',
    new File([Uint8Array.from([0x50, 0x4b, 0x03, 0x04])], 'vaso.3mf', {
      type: 'model/3mf',
    }),
  );
  formulario.set('arquivoGlb', new File([glb], 'vaso.glb', { type: 'model/gltf-binary' }));
  return formulario;
}
