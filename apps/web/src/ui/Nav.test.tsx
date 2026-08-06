import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Nav from './Nav';

beforeEach(() => vi.stubGlobal('React', React));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Nav', () => {
  it('expõe o header persistente com a variante visual da rota', () => {
    render(<Nav tema="escuro" qtdSacola={2} abrirSacola={() => undefined} />);

    const navegacao = screen.getByRole('navigation', { name: 'Navegação principal' });
    expect(navegacao.closest('header')?.getAttribute('data-tema')).toBe('escuro');
    expect(
      screen.getByRole('link', { name: 'Ideally Studio 3D — início' }).getAttribute('href'),
    ).toBe('/');
    expect(screen.getByRole('link', { name: 'Showroom' }).getAttribute('href')).toBe('/#showroom');
    expect(screen.getByRole('button', { name: 'Sacola 2' })).not.toBeNull();
  });

  it('abre a sacola pelo botão da navegação', () => {
    const abrirSacola = vi.fn();
    render(<Nav tema="claro" qtdSacola={0} abrirSacola={abrirSacola} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sacola 0' }));

    expect(abrirSacola).toHaveBeenCalledOnce();
  });
});
