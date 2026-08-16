import type { Caixa, Encaixe } from './caixa';

/**
 * Geometria visual de uma cota no espaço do modelo.
 *
 * Overlay e enquadramento leem esta spec — não há um segundo número de folga.
 */
export const COTA = {
  gap: 0.11,
  pontaRaio: 0.032,
  pontaAltura: 0.08,
  fonte: 0.075,
  outline: 0.012,
  frente: 0.04,
  texto: '#001E5A',
  textoContorno: '#FFF8F2',
} as const;

export type Ponto3D = [number, number, number];

export type EixoCota = 'altura' | 'largura' | 'profundidade';

export interface Cota {
  eixo: EixoCota;
  inicio: Ponto3D;
  fim: Ponto3D;
  inicioRotacao: Ponto3D;
  fimRotacao: Ponto3D;
  textoPosicao: Ponto3D;
  texto: string;
}

/** Alcance da cota além da caixa, no espaço do modelo. */
export function folgaDasCotas(spec = COTA): number {
  const alcanceTexto = spec.fonte / 2 + spec.outline;
  const alcancePonta = spec.pontaAltura / 2;
  return spec.gap + alcanceTexto + alcancePonta;
}

export function caixaComCotas(caixa: Caixa, spec = COTA): Caixa {
  const folga = folgaDasCotas(spec);
  return {
    largura: caixa.largura + folga * 2,
    altura: caixa.altura + folga,
    profundidade: caixa.profundidade + folga * 2,
  };
}

export function cotasDoEncaixe(
  encaixe: Pick<Encaixe, 'largura' | 'altura' | 'profundidade'>,
  textos: Record<EixoCota, string>,
  spec = COTA,
): Cota[] {
  const recuo = Math.min(
    spec.pontaAltura / 2,
    encaixe.altura / 2,
    encaixe.largura / 2,
    encaixe.profundidade / 2,
  );
  const xAltura = -(encaixe.largura / 2 + spec.gap);
  const yComprimento = encaixe.altura + spec.gap;
  const xProfundidade = encaixe.largura / 2 + spec.gap;

  return [
    {
      eixo: 'altura',
      inicio: [xAltura, recuo, spec.frente],
      fim: [xAltura, encaixe.altura - recuo, spec.frente],
      inicioRotacao: [0, 0, 0],
      fimRotacao: [0, 0, Math.PI],
      textoPosicao: [xAltura, encaixe.altura / 2, spec.frente],
      texto: textos.altura,
    },
    {
      eixo: 'largura',
      inicio: [-encaixe.largura / 2 + recuo, yComprimento, spec.frente],
      fim: [encaixe.largura / 2 - recuo, yComprimento, spec.frente],
      inicioRotacao: [0, 0, Math.PI / 2],
      fimRotacao: [0, 0, -Math.PI / 2],
      textoPosicao: [0, yComprimento, spec.frente],
      texto: textos.largura,
    },
    {
      eixo: 'profundidade',
      inicio: [xProfundidade, encaixe.altura / 2, -encaixe.profundidade / 2 + recuo],
      fim: [xProfundidade, encaixe.altura / 2, encaixe.profundidade / 2 - recuo],
      inicioRotacao: [Math.PI / 2, 0, 0],
      fimRotacao: [-Math.PI / 2, 0, 0],
      textoPosicao: [xProfundidade, encaixe.altura / 2, 0],
      texto: textos.profundidade,
    },
  ];
}
