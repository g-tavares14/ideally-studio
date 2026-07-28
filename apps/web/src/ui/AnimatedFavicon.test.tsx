import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AnimatedFavicon from './AnimatedFavicon';

function prepararAmbiente(movimentoReduzido = false) {
  const ouvintes = new Set<(evento: MediaQueryListEvent) => void>();
  const media = {
    matches: movimentoReduzido,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn((_tipo: string, ouvinte: EventListenerOrEventListenerObject) => {
      ouvintes.add(ouvinte as (evento: MediaQueryListEvent) => void);
    }),
    removeEventListener: vi.fn((_tipo: string, ouvinte: EventListenerOrEventListenerObject) => {
      ouvintes.delete(ouvinte as (evento: MediaQueryListEvent) => void);
    }),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } satisfies MediaQueryList;

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => media),
  );

  const contexto = {
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    stroke: vi.fn(),
    globalAlpha: 1,
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: 1,
    strokeStyle: '',
  };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    contexto as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,cubo');

  let proximoId = 0;
  const quadros = new Map<number, FrameRequestCallback>();
  const request = vi.fn((callback: FrameRequestCallback) => {
    proximoId += 1;
    quadros.set(proximoId, callback);
    return proximoId;
  });
  const cancel = vi.fn((id: number) => quadros.delete(id));
  vi.stubGlobal('requestAnimationFrame', request);
  vi.stubGlobal('cancelAnimationFrame', cancel);

  return { cancel, media, quadros, request };
}

afterEach(() => {
  cleanup();
  document
    .querySelectorAll('[data-ideally-animated-icon]')
    .forEach((elemento) => elemento.remove());
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('AnimatedFavicon', () => {
  it('publica os quadros e limpa a animação ao desmontar', () => {
    const { cancel, media, quadros, request } = prepararAmbiente();
    const paginaOculta = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    const tela = render(<AnimatedFavicon />);

    expect(request).toHaveBeenCalledOnce();
    const primeiroQuadro = quadros.values().next().value;
    expect(primeiroQuadro).toBeTypeOf('function');
    primeiroQuadro?.(100);

    const link = document.head.querySelector<HTMLLinkElement>('[data-ideally-animated-icon]');
    expect(link?.href).toContain('data:image/png;base64,cubo');

    paginaOculta.mockReturnValue(true);
    document.dispatchEvent(new Event('visibilitychange'));
    expect(document.head.querySelector('[data-ideally-animated-icon]')).toBeNull();
    expect(cancel).toHaveBeenCalled();

    tela.unmount();
    expect(document.head.querySelector('[data-ideally-animated-icon]')).toBeNull();
    expect(media.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('mantém somente o fallback estático com movimento reduzido', () => {
    const { request } = prepararAmbiente(true);
    render(<AnimatedFavicon />);

    expect(request).not.toHaveBeenCalled();
    expect(document.head.querySelector('[data-ideally-animated-icon]')).toBeNull();
  });
});
