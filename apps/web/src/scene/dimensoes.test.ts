import { describe, expect, it } from 'vitest';
import { TAMANHOS } from '@cria-forma/shared';
import { dimensoesDoProduto } from './dimensoes';

const ENCAIXE = { largura: 0.4, altura: 0.5, profundidade: 0.3 };

describe('dimensoesDoProduto', () => {
  it('usa a altura cadastrada do tamanho M e deriva o resto da geometria', () => {
    const dimensoes = dimensoesDoProduto(24, ENCAIXE, 1);

    expect(dimensoes.altura).toBe(24);
    expect(dimensoes.largura).toBeCloseTo(19.2, 5);
    expect(dimensoes.profundidade).toBeCloseTo(14.4, 5);
  });

  it('escala largura, altura e profundidade junto com o tamanho escolhido', () => {
    const padrao = dimensoesDoProduto(24, ENCAIXE, TAMANHOS[1].fator);
    const grande = dimensoesDoProduto(24, ENCAIXE, TAMANHOS[2].fator);

    expect(grande.largura / padrao.largura).toBeCloseTo(TAMANHOS[2].fator, 5);
    expect(grande.altura / padrao.altura).toBeCloseTo(TAMANHOS[2].fator, 5);
    expect(grande.profundidade / padrao.profundidade).toBeCloseTo(TAMANHOS[2].fator, 5);
  });
});
