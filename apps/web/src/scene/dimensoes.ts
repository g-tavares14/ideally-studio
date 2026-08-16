import type { Encaixe } from './caixa';

export interface DimensoesCm {
  largura: number;
  altura: number;
  profundidade: number;
}

/**
 * Converte a caixa normalizada da cena para medidas físicas.
 *
 * `alturaCm` é a medida real do tamanho M. Largura e profundidade preservam a
 * proporção da geometria 3D, e o fator P/M/G escala os três eixos.
 */
export function dimensoesDoProduto(
  alturaCm: number,
  encaixe: Pick<Encaixe, 'largura' | 'altura' | 'profundidade'>,
  fator: number,
): DimensoesCm {
  const altura = alturaCm * fator;
  const cmPorUnidade = altura / encaixe.altura;

  return {
    largura: encaixe.largura * cmPorUnidade,
    altura,
    profundidade: encaixe.profundidade * cmPorUnidade,
  };
}
