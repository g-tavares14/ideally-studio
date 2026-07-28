import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSacola } from './useSacola';

const item = (nome: string, preco: number) => ({
  nome,
  preco,
  thumb: 'data:image/png;base64,x',
  detalhe: 'PLA fosco · Osso · tamanho M',
});

describe('useSacola', () => {
  it('começa vazia e com total zero', () => {
    const { result } = renderHook(() => useSacola());
    expect(result.current.itens).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it('soma o total dos itens', () => {
    const { result } = renderHook(() => useSacola());
    act(() => result.current.adicionar(item('Vaso de Flores', 320)));
    act(() => result.current.adicionar(item('Órbita', 420)));
    expect(result.current.total).toBe(740);
  });

  it('remove pela chave, preservando os outros itens', () => {
    const { result } = renderHook(() => useSacola());
    act(() => result.current.adicionar(item('Vaso de Flores', 320)));
    act(() => result.current.adicionar(item('Órbita', 420)));

    const alvo = result.current.itens[0].key;
    act(() => result.current.remover(alvo));

    expect(result.current.itens).toHaveLength(1);
    expect(result.current.itens[0].nome).toBe('Órbita');
    expect(result.current.total).toBe(420);
  });

  it('aceita a mesma peça duas vezes como linhas separadas', () => {
    // duas unidades da mesma peça são dois itens, não um com quantidade
    const { result } = renderHook(() => useSacola());
    act(() => result.current.adicionar(item('Vaso de Flores', 320)));
    act(() => result.current.adicionar(item('Vaso de Flores', 320)));

    expect(result.current.itens).toHaveLength(2);
    expect(result.current.total).toBe(640);
  });

  it('dá chaves distintas a itens adicionados no mesmo milissegundo', () => {
    const { result } = renderHook(() => useSacola());
    act(() => {
      result.current.adicionar(item('Vaso de Flores', 320));
      result.current.adicionar(item('Órbita', 420));
    });

    const chaves = result.current.itens.map((i) => i.key);
    expect(new Set(chaves).size).toBe(chaves.length);
  });
});
