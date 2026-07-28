import * as THREE from 'three';
import { MATERIAIS } from '@cria-forma/shared';
import type { Produto } from '@cria-forma/shared';
import { CAIXA_PADRAO, encaixar } from './caixa';
import { descartarPartes, partesDe } from './pecas';
import type { Thumbs } from '../types';

const RAD = Math.PI / 180;
const FOV = 30;

/**
 * Renderiza cada peça isolada num renderer fora de tela e devolve data URLs.
 * Usadas pelas miniaturas do catálogo e pelas linhas da sacola.
 *
 * As peças passam pela mesma caixa padrão do showroom, então a câmera é fixa:
 * todas as miniaturas saem no mesmo tamanho aparente.
 */
export function gerarThumbs(corPeca: string, produtos: Produto[]): Thumbs {
  const r = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  r.setSize(520, 400);
  r.setPixelRatio(2);
  r.toneMapping = THREE.ACESFilmicToneMapping;

  const sc = new THREE.Scene();
  sc.add(new THREE.AmbientLight(0xffffff, 0.8));
  const d = new THREE.DirectionalLight(0xffffff, 1.9);
  d.position.set(2.5, 4, 3);
  sc.add(d);
  const d2 = new THREE.DirectionalLight(0xffffff, 0.5);
  d2.position.set(-3, 1.5, 2);
  sc.add(d2);

  // distância constante, derivada da caixa — as miniaturas guardam entre si a
  // mesma proporção que as peças têm no showroom; só a mira acompanha a peça
  const cam = new THREE.PerspectiveCamera(FOV, 520 / 400, 0.1, 50);
  const dist =
    (Math.max(CAIXA_PADRAO.altura, CAIXA_PADRAO.largura) * 1.35) / Math.tan((FOV / 2) * RAD);

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(corPeca),
    roughness: MATERIAIS[0].rough,
    metalness: MATERIAIS[0].metal,
  });

  const out: Thumbs = {};
  produtos.forEach((p) => {
    const partes = partesDe(p.id);
    const encaixe = encaixar(partes);
    const g = new THREE.Group();
    g.position.fromArray(encaixe.offset);
    g.scale.setScalar(encaixe.escala);
    partes.forEach((parte) => {
      const m = new THREE.Mesh(parte.geo, mat);
      if (parte.pos) m.position.fromArray(parte.pos);
      if (parte.rot) m.rotation.fromArray(parte.rot);
      g.add(m);
    });

    sc.add(g);
    const alvoY = encaixe.altura / 2;
    cam.position.set(dist * 0.32, alvoY + encaixe.altura * 0.3, dist);
    cam.lookAt(0, alvoY, 0);
    r.render(sc, cam);
    out[p.id] = r.domElement.toDataURL('image/png');
    sc.remove(g);
    descartarPartes(partes);
  });

  mat.dispose();
  r.dispose();
  r.forceContextLoss();
  return out;
}
