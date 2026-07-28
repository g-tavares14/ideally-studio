'use client';

import { useCallback, useState } from 'react';

export interface ConfigProduto {
  mat: string;
  cor: number;
  tam: string;
  adicionado: boolean;
  escolherMat: (id: string) => void;
  escolherCor: (indice: number) => void;
  escolherTam: (id: string) => void;
  marcarAdicionado: () => void;
  reiniciar: () => void;
}

const PADRAO = { mat: 'pla', cor: 0, tam: 'm' };

/**
 * A configuração corrente do produto aberto.
 *
 * Cada escolha limpa o `adicionado`: o botão volta a "Adicionar à sacola"
 * porque o que está configurado deixou de ser o que foi adicionado.
 */
export function useConfigProduto(): ConfigProduto {
  const [mat, setMat] = useState(PADRAO.mat);
  const [cor, setCor] = useState(PADRAO.cor);
  const [tam, setTam] = useState(PADRAO.tam);
  const [adicionado, setAdicionado] = useState(false);

  const escolherMat = useCallback((id: string) => {
    setMat(id);
    setAdicionado(false);
  }, []);

  const escolherCor = useCallback((indice: number) => {
    setCor(indice);
    setAdicionado(false);
  }, []);

  const escolherTam = useCallback((id: string) => {
    setTam(id);
    setAdicionado(false);
  }, []);

  const marcarAdicionado = useCallback(() => setAdicionado(true), []);

  /** Abrir uma peça sempre parte do padrão — o configurador não guarda a escolha anterior. */
  const reiniciar = useCallback(() => {
    setMat(PADRAO.mat);
    setCor(PADRAO.cor);
    setTam(PADRAO.tam);
    setAdicionado(false);
  }, []);

  return {
    mat,
    cor,
    tam,
    adicionado,
    escolherMat,
    escolherCor,
    escolherTam,
    marcarAdicionado,
    reiniciar,
  };
}
