import { describe, expect, it } from 'vitest';
import { PRODUTOS, TAMANHOS } from '@cria-forma/shared';
import { dimensoesDoProduto } from './dimensoes';
import { modeloDe } from './modelos';

describe('dimensoesDoProduto', () => {
  it.each(PRODUTOS)('calcula medidas físicas para %s', (produto) => {
    const dimensoes = dimensoesDoProduto(produto, modeloDe(produto.id).encaixe, 1);

    expect(dimensoes.largura).toBeGreaterThan(0);
    expect(dimensoes.altura).toBe(Number.parseFloat(produto.altura));
    expect(dimensoes.profundidade).toBeGreaterThan(0);
  });

  it('escala largura, altura e profundidade junto com o tamanho escolhido', () => {
    const produto = PRODUTOS[0];
    const encaixe = modeloDe(produto.id).encaixe;
    const padrao = dimensoesDoProduto(produto, encaixe, TAMANHOS[1].fator);
    const grande = dimensoesDoProduto(produto, encaixe, TAMANHOS[2].fator);

    expect(grande.largura / padrao.largura).toBeCloseTo(TAMANHOS[2].fator, 5);
    expect(grande.altura / padrao.altura).toBeCloseTo(TAMANHOS[2].fator, 5);
    expect(grande.profundidade / padrao.profundidade).toBeCloseTo(TAMANHOS[2].fator, 5);
  });
});
