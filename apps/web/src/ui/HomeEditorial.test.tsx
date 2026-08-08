import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Produto } from '@cria-forma/shared';
import HomeEditorial from './HomeEditorial';

const PRODUTOS: Produto[] = [
  {
    id: 'vaso',
    nome: 'Vaso de Flores',
    cat: 'Decoração',
    preco: 320,
    altura: '24 cm',
    prazo: '5 dias',
    desc: '',
  },
];

beforeEach(() => vi.stubGlobal('React', React));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('HomeEditorial', () => {
  it('direciona as chamadas principais para o catálogo', () => {
    render(<HomeEditorial produtos={PRODUTOS} thumb={() => ''} />);

    expect(screen.getByRole('link', { name: /Ver o catálogo/ }).getAttribute('href')).toBe(
      '/catalogo',
    );
    expect(screen.getByRole('link', { name: 'Catálogo completo →' }).getAttribute('href')).toBe(
      '/catalogo',
    );
    expect(screen.getByRole('link', { name: 'Ir para o catálogo' }).getAttribute('href')).toBe(
      '/catalogo',
    );
  });

  it('lista os produtos recebidos com nome e preço', () => {
    render(<HomeEditorial produtos={PRODUTOS} thumb={() => ''} />);

    expect(screen.getByText('Vaso de Flores')).not.toBeNull();
    expect(screen.getByText('R$ 320')).not.toBeNull();
  });
});
