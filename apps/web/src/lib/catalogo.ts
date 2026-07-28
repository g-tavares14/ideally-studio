import { PRODUTOS } from '@cria-forma/shared';
import type { Produto } from '@cria-forma/shared';

/**
 * A costura entre a aplicação e a origem dos dados.
 *
 * Hoje devolve o catálogo semente do pacote compartilhado. Quando o banco
 * entrar, só o corpo destas funções muda — nenhum componente sabe de onde os
 * produtos vêm. Por isso as assinaturas já são assíncronas, mesmo sem precisar:
 * é o que evita mexer em todos os pontos de chamada depois.
 *
 * São funções de servidor, não um cliente HTTP: os Server Components chamam
 * direto.
 */

export async function listarProdutos(): Promise<Produto[]> {
  return PRODUTOS;
}

export async function buscarProduto(slug: string): Promise<Produto | undefined> {
  return PRODUTOS.find((p) => p.id === slug);
}
