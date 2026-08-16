import { describe, expect, it } from 'vitest';
import { CAIXA_PADRAO, enquadrarCaixa } from './caixa';
import { COTA, caixaComCotas, cotasDoEncaixe, folgaDasCotas } from './cotas';

const ENCAIXE = { largura: 0.5, altura: 0.6, profundidade: 0.4 };
const TEXTOS = { altura: '24 cm', largura: '20 cm', profundidade: '16 cm' };

describe('folgaDasCotas', () => {
  it('sai da spec visual, sem número paralelo', () => {
    expect(folgaDasCotas()).toBe(COTA.gap + COTA.fonte / 2 + COTA.outline + COTA.pontaAltura / 2);
  });
});

describe('caixaComCotas', () => {
  it('expande a caixa só o alcance das cotas', () => {
    const folga = folgaDasCotas();
    expect(caixaComCotas(CAIXA_PADRAO)).toEqual({
      largura: CAIXA_PADRAO.largura + folga * 2,
      altura: CAIXA_PADRAO.altura + folga,
      profundidade: CAIXA_PADRAO.profundidade + folga * 2,
    });
  });
});

describe('cotasDoEncaixe', () => {
  it('produz uma cota por eixo, com o texto correspondente', () => {
    const cotas = cotasDoEncaixe(ENCAIXE, TEXTOS);

    expect(cotas.map((c) => c.eixo)).toEqual(['altura', 'largura', 'profundidade']);
    expect(cotas.map((c) => c.texto)).toEqual(['24 cm', '20 cm', '16 cm']);
  });

  it('coloca a cota de altura à esquerda da peça e acima da base', () => {
    const altura = cotasDoEncaixe(ENCAIXE, TEXTOS).find((c) => c.eixo === 'altura')!;

    expect(altura.inicio[0]).toBeLessThan(-ENCAIXE.largura / 2);
    expect(altura.inicio[1]).toBeGreaterThan(0);
    expect(altura.fim[1]).toBeLessThan(ENCAIXE.altura);
  });

  it('não inverte as pontas quando o encaixe é menor que a seta', () => {
    const miudo = { largura: 0.04, altura: 0.05, profundidade: 0.03 };
    const [altura, largura, profundidade] = cotasDoEncaixe(miudo, TEXTOS);

    expect(altura.fim[1]).toBeGreaterThanOrEqual(altura.inicio[1]);
    expect(largura.fim[0]).toBeGreaterThanOrEqual(largura.inicio[0]);
    expect(profundidade.fim[2]).toBeGreaterThanOrEqual(profundidade.inicio[2]);
  });
});

describe('enquadrarCaixa com cotas', () => {
  const base = {
    fov: 38,
    aspect: 16 / 9,
    larguraPx: 1440,
    painelPx: 440,
    fatorMax: 1.45,
  };

  it('afasta a câmera quando a caixa recebida já inclui as cotas', () => {
    const semCotas = enquadrarCaixa(base);
    const comCotas = enquadrarCaixa({ ...base, caixa: caixaComCotas(CAIXA_PADRAO) });

    expect(comCotas.dist).toBeGreaterThan(semCotas.dist);
  });
});
