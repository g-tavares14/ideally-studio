import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { PRODUTOS } from '@cria-forma/shared';
import { CAIXA_PADRAO, encaixar, enquadrarCaixa } from './caixa';
import { partesDe } from './pecas';

/**
 * `encaixar()` é geometria pura: determinística, sem renderer e sem React —
 * o único pedaço da camada 3D que dá para testar direto.
 *
 * O que ela promete é a premissa de que o resto da cena depende: as seis peças
 * ocupam a mesma caixa, então pedestais e câmera não precisam de ajuste por
 * peça.
 */

/** Monta a peça como o `<Peca>` monta e devolve a caixa que ela ocupa de fato. */
function caixaResultante(id: string) {
  const partes = partesDe(id);
  const encaixe = encaixar(partes);

  const grupo = new THREE.Group();
  for (const parte of partes) {
    const mesh = new THREE.Mesh(parte.geo);
    if (parte.pos) mesh.position.fromArray(parte.pos);
    if (parte.rot) mesh.rotation.fromArray(parte.rot);
    grupo.add(mesh);
  }
  // idêntico a <group position={encaixe.offset} scale={encaixe.escala}>
  grupo.position.fromArray(encaixe.offset);
  grupo.scale.setScalar(encaixe.escala);
  grupo.updateMatrixWorld(true);

  return new THREE.Box3().setFromObject(grupo);
}

const ids = PRODUTOS.map((p) => p.id);
const FOLGA = 1e-3;

describe('encaixar', () => {
  it.each(ids)('mantém %s dentro da caixa padrão', (id) => {
    const tam = caixaResultante(id).getSize(new THREE.Vector3());
    expect(tam.x).toBeLessThanOrEqual(CAIXA_PADRAO.largura + FOLGA);
    expect(tam.y).toBeLessThanOrEqual(CAIXA_PADRAO.altura + FOLGA);
    expect(tam.z).toBeLessThanOrEqual(CAIXA_PADRAO.profundidade + FOLGA);
  });

  it.each(ids)('apoia a base de %s em y = 0', (id) => {
    // é o que permite pousar a peça no topo do pedestal sem ajuste por peça
    expect(caixaResultante(id).min.y).toBeCloseTo(0, 3);
  });

  it.each(ids)('centra %s em X e Z', (id) => {
    const centro = caixaResultante(id).getCenter(new THREE.Vector3());
    expect(centro.x).toBeCloseTo(0, 3);
    expect(centro.z).toBeCloseTo(0, 3);
  });

  it.each(ids)('aproveita a caixa toda em algum eixo, para %s', (id) => {
    // se sobrasse folga nos três eixos ao mesmo tempo, a escala não seria a
    // maior possível e a peça apareceria menor do que poderia
    const tam = caixaResultante(id).getSize(new THREE.Vector3());
    const encosta =
      Math.abs(tam.x - CAIXA_PADRAO.largura) < FOLGA ||
      Math.abs(tam.y - CAIXA_PADRAO.altura) < FOLGA ||
      Math.abs(tam.z - CAIXA_PADRAO.profundidade) < FOLGA;
    expect(encosta).toBe(true);
  });

  it('cabe no topo do pedestal, que é mais largo que a caixa', () => {
    // CLAUDE.md: a caixa é menor que o topo (0.72) de propósito
    expect(CAIXA_PADRAO.largura).toBeLessThan(0.72);
    expect(CAIXA_PADRAO.profundidade).toBeLessThan(0.72);
  });
});

describe('enquadrarCaixa', () => {
  const base = {
    fov: 38,
    aspect: 16 / 9,
    larguraPx: 1440,
    painelPx: 440,
  };

  it('afasta a câmera quando o tamanho máximo cresce', () => {
    const emM = enquadrarCaixa({ ...base, fatorMax: 1 });
    const emG = enquadrarCaixa({ ...base, fatorMax: 1.45 });

    expect(emG.dist).toBeGreaterThan(emM.dist);
  });

  it('não deixa um fator abaixo de 1 encolher o enquadramento máximo', () => {
    const emM = enquadrarCaixa({ ...base, fatorMax: 1 });
    const abaixoDeM = enquadrarCaixa({ ...base, fatorMax: 0.78 });

    expect(abaixoDeM.dist).toBeCloseTo(emM.dist, 5);
    expect(abaixoDeM.alvoY).toBeCloseTo(emM.alvoY, 5);
  });
});
