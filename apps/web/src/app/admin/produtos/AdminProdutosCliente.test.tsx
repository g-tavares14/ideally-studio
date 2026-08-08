import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminProdutosCliente from './AdminProdutosCliente';

const mocks = vi.hoisted(() => ({
  converter: vi.fn(),
}));

vi.mock('@/lib/modelos3d/converter', () => ({
  converter3mfParaGlb: mocks.converter,
}));

vi.mock('@/scene/PreviewModelo3D', () => ({
  default: ({ url, nome }: { url: string; nome: string }) => (
    <div data-testid="preview-modelo" data-url={url}>
      {nome}
    </div>
  ),
}));

const MODELO_SALVO = {
  id: 'f1593af9-5052-4787-a8ea-b587fc5b2b44',
  nome: 'Vaso teste',
  nomeArquivo: 'vaso.3mf',
  triangulos: 1280,
  criadoEm: '2026-08-07T12:00:00.000Z',
  url3mf: '/api/admin/modelos/f1593af9-5052-4787-a8ea-b587fc5b2b44/3mf',
  urlGlb: '/api/admin/modelos/f1593af9-5052-4787-a8ea-b587fc5b2b44/glb',
};

beforeEach(() => {
  vi.stubGlobal('React', React);
  mocks.converter.mockReset();
  Object.defineProperties(URL, {
    createObjectURL: {
      configurable: true,
      value: vi.fn(() => 'blob:modelo-convertido'),
    },
    revokeObjectURL: {
      configurable: true,
      value: vi.fn(),
    },
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(URL, 'createObjectURL');
  Reflect.deleteProperty(URL, 'revokeObjectURL');
});

describe('AdminProdutosCliente', () => {
  it('carrega a lista local novamente e abre o modelo armazenado no preview', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([MODELO_SALVO]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    render(<AdminProdutosCliente />);

    expect(screen.getByText('Somente localhost')).not.toBeNull();
    expect(await screen.findByText('Vaso teste')).not.toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/modelos',
      expect.objectContaining({ cache: 'no-store', signal: expect.any(AbortSignal) }),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Visualizar' }));

    const preview = screen.getByTestId('preview-modelo');
    expect(preview.textContent).toBe('Vaso teste');
    expect(preview.getAttribute('data-url')).toBe(MODELO_SALVO.urlGlb);
  });

  it('converte um 3MF, força os MIME types e envia o formulário para a API', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(MODELO_SALVO), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    vi.stubGlobal('fetch', fetchMock);
    mocks.converter.mockResolvedValue({
      arquivoGlb: new Uint8Array([0x67, 0x6c, 0x54, 0x46]),
      triangulos: 1280,
    });

    render(<AdminProdutosCliente />);
    await screen.findByText('Nenhum modelo armazenado');

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar produto 3D' }));
    expect(screen.getByRole('dialog').hasAttribute('open')).toBe(true);

    fireEvent.change(screen.getByLabelText('Nome interno'), {
      target: { value: 'Vaso teste' },
    });
    const arquivo = new File([new Uint8Array([0x50, 0x4b, 0x03, 0x04])], 'vaso.3mf', {
      type: 'application/octet-stream',
    });
    fireEvent.change(screen.getByLabelText('Arquivo 3MF'), { target: { files: [arquivo] } });
    fireEvent.submit(screen.getByRole('button', { name: 'Converter e salvar' }).closest('form')!);

    expect(await screen.findByText('Modelo salvo em doc/modelos.')).not.toBeNull();
    expect(mocks.converter).toHaveBeenCalledWith(arquivo);
    expect(screen.getByTestId('preview-modelo').getAttribute('data-url')).toBe(
      'blob:modelo-convertido',
    );

    const [, requisicaoPost] = fetchMock.mock.calls;
    expect(requisicaoPost[0]).toBe('/api/admin/modelos');
    const opcoes = requisicaoPost[1] as RequestInit;
    expect(opcoes.method).toBe('POST');
    expect(opcoes.signal).toBeInstanceOf(AbortSignal);
    const formulario = opcoes.body as FormData;
    expect(formulario.get('nome')).toBe('Vaso teste');
    expect(formulario.get('triangulos')).toBe('1280');
    expect((formulario.get('arquivo3mf') as File).type).toBe('model/3mf');
    expect((formulario.get('arquivoGlb') as File).type).toBe('model/gltf-binary');
  });

  it('rejeita arquivo sem extensão 3MF antes da conversão', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    render(<AdminProdutosCliente />);
    await screen.findByText('Nenhum modelo armazenado');
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar produto 3D' }));
    fireEvent.change(screen.getByLabelText('Nome interno'), {
      target: { value: 'Modelo inválido' },
    });
    fireEvent.change(screen.getByLabelText('Arquivo 3MF'), {
      target: { files: [new File(['conteúdo'], 'modelo.stl')] },
    });
    fireEvent.submit(screen.getByRole('button', { name: 'Converter e salvar' }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain('extensão .3mf');
    });
    expect(mocks.converter).not.toHaveBeenCalled();
  });
});
