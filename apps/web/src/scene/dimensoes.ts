import type { Produto } from '@cria-forma/shared';
import type { Encaixe } from './caixa';

export interface DimensoesCm {
  largura: number;
  altura: number;
  profundidade: number;
}

/**
 * Converte a caixa normalizada da cena para medidas físicas.
 *
 * A altura cadastrada é a medida real do tamanho M. Largura e profundidade
 * preservam a proporção da geometria 3D, e o fator P/M/G escala os três eixos.
 */
export function dimensoesDoProduto(
  produto: Pick<Produto, 'altura'>,
  encaixe: Pick<Encaixe, 'largura' | 'altura' | 'profundidade'>,
  fator: number,
): DimensoesCm {
  const alturaBaseCm = Number.parseFloat(produto.altura.replace(',', '.'));

  if (
    !Number.isFinite(alturaBaseCm) ||
    alturaBaseCm <= 0 ||
    !Number.isFinite(fator) ||
    fator <= 0 ||
    encaixe.altura <= 0
  ) {
    throw new Error('Produto ou encaixe sem medidas físicas válidas.');
  }

  const altura = alturaBaseCm * fator;
  const cmPorUnidade = altura / encaixe.altura;

  return {
    largura: encaixe.largura * cmPorUnidade,
    altura,
    profundidade: encaixe.profundidade * cmPorUnidade,
  };
}

export function formatarNumeroCm(valor: number) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(valor);
}
