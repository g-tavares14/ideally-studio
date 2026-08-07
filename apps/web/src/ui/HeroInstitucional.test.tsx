import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HeroInstitucional from './HeroInstitucional';

beforeEach(() => vi.stubGlobal('React', React));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('HeroInstitucional', () => {
  it('direciona a pessoa para o catálogo e para o ateliê', () => {
    render(<HeroInstitucional />);

    expect(screen.getByRole('link', { name: /Explorar catálogo/ }).getAttribute('href')).toBe(
      '/catalogo',
    );
    expect(screen.getByRole('link', { name: 'Conhecer o ateliê' }).getAttribute('href')).toBe(
      '/sobre',
    );
  });

  it('alterna a etapa exibida no processo do ateliê', () => {
    render(<HeroInstitucional />);

    const etapa = screen.getByRole('tab', { name: /02 Fabricação/ });
    const painel = screen.getByRole('tabpanel');

    expect(etapa.getAttribute('aria-selected')).toBe('false');
    expect(painel.textContent).toContain('Intenção');

    fireEvent.click(etapa);

    expect(etapa.getAttribute('aria-selected')).toBe('true');
    expect(painel.textContent).toContain('Fabricação');
    expect(painel.textContent).toContain('sem estoque · sob demanda');
  });
});
