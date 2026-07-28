import { describe, expect, it } from 'vitest';
import { BRL, precoDe } from './precos';
import { MATERIAIS, PRODUTOS, TAMANHOS } from './catalogo.seed';

const vaso = PRODUTOS.find((p) => p.id === 'vaso')!;
const anel = PRODUTOS.find((p) => p.id === 'anel')!;

describe('precoDe', () => {
  it('devolve o preço base com PLA no tamanho M', () => {
    // PLA tem delta 0 e M multiplica por 1 — o preço é o do catálogo
    expect(precoDe(vaso, 'pla', 'm')).toBe(320);
  });

  it('soma o acréscimo do material antes de multiplicar pela escala', () => {
    // 320 + 240 = 560, e não 320 * 1.4 + 240
    expect(precoDe(vaso, 'metal', 'm')).toBe(560);
  });

  it('arredonda para a dezena mais próxima', () => {
    // (320 + 240) * 1.4 = 784 → 780
    expect(precoDe(vaso, 'metal', 'g')).toBe(780);
    // (90 + 90) * 0.7 = 126 → 130
    expect(precoDe(anel, 'resina', 'p')).toBe(130);
  });

  it('arredonda para cima no meio da dezena', () => {
    // (90 + 240) * 0.7 = 231 → 230; (320+90) * 0.7 = 287 → 290
    expect(precoDe(anel, 'metal', 'p')).toBe(230);
    expect(precoDe(vaso, 'resina', 'p')).toBe(290);
  });

  it('nunca devolve fração de real, em nenhuma combinação do catálogo', () => {
    for (const p of PRODUTOS) {
      for (const m of MATERIAIS) {
        for (const t of TAMANHOS) {
          const preco = precoDe(p, m.id, t.id);
          expect(Number.isInteger(preco)).toBe(true);
          expect(preco % 10).toBe(0);
          expect(preco).toBeGreaterThan(0);
        }
      }
    }
  });

  it('cresce junto com a escala, para todo produto e material', () => {
    for (const p of PRODUTOS) {
      for (const m of MATERIAIS) {
        expect(precoDe(p, m.id, 'p')).toBeLessThan(precoDe(p, m.id, 'm'));
        expect(precoDe(p, m.id, 'm')).toBeLessThan(precoDe(p, m.id, 'g'));
      }
    }
  });
});

describe('BRL', () => {
  it('formata no padrão brasileiro, com separador de milhar', () => {
    expect(BRL(320)).toBe('R$ 320');
    expect(BRL(1200)).toBe('R$ 1.200');
  });
});
