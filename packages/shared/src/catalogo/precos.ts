import { MATERIAIS, TAMANHOS } from './catalogo.seed';
import type { Produto } from './tipos';

export const BRL = (n: number) => 'R$ ' + n.toLocaleString('pt-BR');

/** Preço final arredondado para a dezena mais próxima. */
export function precoDe(produto: Produto, matId: string, tamId: string) {
  const base = produto.preco + MATERIAIS.find((m) => m.id === matId)!.delta;
  return Math.round((base * TAMANHOS.find((t) => t.id === tamId)!.mult) / 10) * 10;
}
