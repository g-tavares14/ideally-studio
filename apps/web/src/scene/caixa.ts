import * as THREE from 'three';
import type { ParteGeo } from '../types';

/**
 * A caixa imaginária. Toda peça é encaixada nela: escalada para caber, apoiada
 * pelo chão da caixa e centrada em X/Z. É o que garante que as peças — cujas
 * geometrias têm tamanhos muito diferentes entre si — pousem do mesmo jeito
 * sobre os pedestais e sejam enquadradas pela mesma câmera.
 */
export interface Caixa {
  largura: number;
  altura: number;
  profundidade: number;
}

/** Menor que o topo do pedestal (0.72), para nenhuma peça transbordar a base. */
export const CAIXA_PADRAO: Caixa = { largura: 0.62, altura: 0.72, profundidade: 0.62 };

export interface Encaixe {
  /** escala uniforme que faz a peça caber na caixa */
  escala: number;
  /** deslocamento que centra em X/Z e apoia a base em y = 0 */
  offset: [number, number, number];
  /** dimensões ocupadas dentro da caixa padrão */
  largura: number;
  altura: number;
  profundidade: number;
}

/**
 * Mede as partes e devolve a transformação que as encaixa na caixa.
 *
 * O offset é multiplicado pela escala porque a matriz de um `Group` é
 * `T · R · S`: a posição é aplicada no espaço do pai, já a geometria vem
 * encolhida pela escala.
 */
export function encaixar(partes: ParteGeo[], caixa: Caixa = CAIXA_PADRAO): Encaixe {
  const raiz = new THREE.Object3D();
  partes.forEach((p) => {
    const o = new THREE.Mesh(p.geo);
    if (p.pos) o.position.fromArray(p.pos);
    if (p.rot) o.rotation.fromArray(p.rot);
    raiz.add(o);
  });
  raiz.updateWorldMatrix(false, true);

  const bb = new THREE.Box3().setFromObject(raiz);
  const tam = bb.getSize(new THREE.Vector3());
  const centro = bb.getCenter(new THREE.Vector3());

  const escala = Math.min(
    caixa.largura / Math.max(tam.x, 1e-6),
    caixa.altura / Math.max(tam.y, 1e-6),
    caixa.profundidade / Math.max(tam.z, 1e-6),
  );

  return {
    escala,
    offset: [-centro.x * escala, -bb.min.y * escala, -centro.z * escala],
    largura: tam.x * escala,
    altura: tam.y * escala,
    profundidade: tam.z * escala,
  };
}

const RAD = Math.PI / 180;
/** folga entre a caixa e a borda do quadro */
const MARGEM = 1.14;
/** inclinação da câmera de produto, em radianos (~10°) */
const ELEVACAO = 0.175;
export interface Enquadramento {
  /** distância da câmera ao ponto de mira */
  dist: number;
  /** altura da mira acima da base da caixa */
  alvoY: number;
  /** deslocamento lateral que joga a peça para fora do painel de produto */
  offsetX: number;
  /** posição da câmera relativa à base da caixa */
  camY: number;
  camZ: number;
}

/** Os oito cantos da caixa, com a base em y = 0 e centrada em X/Z. */
function cantos(caixa: Caixa, fator: number) {
  const hx = (caixa.largura * fator) / 2;
  const hz = (caixa.profundidade * fator) / 2;
  const hy = caixa.altura * fator;
  const pts: [number, number, number][] = [];
  for (const x of [-hx, hx])
    for (const y of [0, hy]) for (const z of [-hz, hz]) pts.push([x, y, z]);
  return pts;
}

/**
 * A caixa cabe inteira no quadro a esta distância?
 *
 * Projeta os oito cantos de verdade, em vez de comparar alturas num plano: a
 * câmera é inclinada e o topo da caixa fica acima dela, então a aproximação
 * planar subestima o quanto a peça sobe no quadro.
 */
function cabe(
  dist: number,
  alvoY: number,
  tanV: number,
  aspect: number,
  pf: number,
  pts: [number, number, number][],
) {
  const tanH = tanV * aspect;
  const camY = alvoY + Math.sin(ELEVACAO) * dist;
  const camZ = Math.cos(ELEVACAO) * dist;
  const offsetX = pf * dist * tanH;
  // eixo de visada e vertical do quadro, com a câmera mirando (offsetX, alvoY, 0)
  const fy = -Math.sin(ELEVACAO);
  const fz = -Math.cos(ELEVACAO);
  const uy = Math.cos(ELEVACAO);
  const uz = -Math.sin(ELEVACAO);
  // o painel corta a direita: o x útil vai de -1 a 1 - 2·pf, centrado em -pf
  const semiUtil = (1 - pf) / MARGEM;

  for (const [px, py, pz] of pts) {
    const vx = px - offsetX;
    const vy = py - camY;
    const vz = pz - camZ;
    const prof = vy * fy + vz * fz;
    if (prof <= 0.01) return false;
    if (Math.abs((vy * uy + vz * uz) / (prof * tanV)) > 1 / MARGEM) return false;
    if (Math.abs(vx / (prof * tanH) + pf) > semiUtil) return false;
  }
  return true;
}

/**
 * Enquadramento da tela de produto, derivado da caixa — nenhum número mágico
 * por peça. A distância é resolvida para o maior tamanho visual (no mínimo M)
 * e não muda com o tamanho escolhido: é assim que trocar P/M/G se *vê* como a
 * peça crescendo. Quem desenha cotas passa a caixa já expandida.
 */
export function enquadrarCaixa(opts: {
  fov: number;
  aspect: number;
  larguraPx: number;
  /** largura do ProdutoPanel, que cobre a direita da tela */
  painelPx: number;
  /** maior fator de escala entre os tamanhos disponíveis */
  fatorMax: number;
  caixa?: Caixa;
}): Enquadramento {
  const { fov, aspect, larguraPx, painelPx, fatorMax } = opts;
  const caixa = opts.caixa ?? CAIXA_PADRAO;
  const tanV = Math.tan((fov / 2) * RAD);
  /** P não aproxima a câmera: o quadro é no mínimo o do tamanho M. */
  const fatorDeEnquadramento = Math.max(fatorMax, 1);

  // mira no meio do caminho entre o centro da caixa em M e o centro em G: nada
  // é cortado no tamanho maior e a peça não fica no rodapé do quadro no menor
  const alvoY = (caixa.altura * (fatorDeEnquadramento + 1)) / 4;
  // em telas estreitas o painel comeria o quadro inteiro; guarda um mínimo útil
  const pf = Math.min(0.55, painelPx / Math.max(larguraPx, 1));
  const pts = cantos(caixa, fatorDeEnquadramento);

  // bissecção: afastar sempre ajuda, então o menor `dist` que cabe é o certo
  let baixo = 0.5;
  let alto = 40;
  for (let i = 0; i < 40; i++) {
    const meio = (baixo + alto) / 2;
    if (cabe(meio, alvoY, tanV, aspect, pf, pts)) alto = meio;
    else baixo = meio;
  }
  const dist = alto;

  return {
    dist,
    alvoY,
    offsetX: pf * dist * tanV * aspect,
    camY: alvoY + Math.sin(ELEVACAO) * dist,
    camZ: Math.cos(ELEVACAO) * dist,
  };
}
