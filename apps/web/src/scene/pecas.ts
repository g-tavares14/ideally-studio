import * as THREE from 'three';
import type { ParteGeo } from '../types';

/**
 * Geometria de uma peça, sem material — quem renderiza decide o acabamento.
 * As poses aqui são as do modelo cru; não se preocupe em apoiar a peça no
 * y = 0 nem em manter a mesma altura das outras: `encaixar()` mede o resultado
 * e reposiciona tudo dentro da caixa padrão.
 */
export function partesDe(id: string): ParteGeo[] {
  const partes: ParteGeo[] = [];
  const add = (
    geo: THREE.BufferGeometry,
    y: number,
    extra?: { x?: number; rot?: [number, number, number] },
  ) => {
    partes.push({ geo, pos: [extra?.x ?? 0, y, 0], rot: extra?.rot });
  };

  if (id === 'vaso') {
    // perfil torneado; o sin(t * 22) é a marca das camadas de impressão
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      pts.push(
        new THREE.Vector2(
          0.3 + Math.sin(t * Math.PI * 1.15) * 0.2 + Math.sin(t * 22) * 0.012,
          t * 1.15,
        ),
      );
    }
    add(new THREE.LatheGeometry(pts, 96), 0);
  } else if (id === 'anel') {
    const prof = [
      new THREE.Vector2(0.3, 0),
      new THREE.Vector2(0.3, 0.34),
      new THREE.Vector2(0.265, 0.34),
      new THREE.Vector2(0.265, 0),
    ];
    add(new THREE.LatheGeometry(prof, 96), 0);
    add(new THREE.TorusGeometry(0.302, 0.028, 24, 120), 0.17, { rot: [Math.PI / 2, 0, 0] });
    [0.09, 0.25].forEach((y) => {
      add(new THREE.TorusGeometry(0.302, 0.008, 16, 100), y, { rot: [Math.PI / 2, 0, 0] });
    });
  } else if (id === 'guardanapo') {
    add(new THREE.BoxGeometry(0.66, 0.045, 0.4), 0.022);
    [-0.2, 0.2].forEach((x) => {
      add(new THREE.TorusGeometry(0.26, 0.032, 20, 60, Math.PI), 0.045, {
        x,
        rot: [0, Math.PI / 2, 0],
      });
    });
    add(new THREE.BoxGeometry(0.045, 0.2, 0.3), 0.145);
  } else if (id === 'controle') {
    add(new THREE.CylinderGeometry(0.31, 0.34, 0.05, 64), 0.025);
    add(new THREE.CylinderGeometry(0.05, 0.06, 0.62, 32), 0.35);
    add(new THREE.TorusGeometry(0.27, 0.035, 20, 60, Math.PI * 0.85), 0.7, {
      rot: [Math.PI / 2, 0, Math.PI * 0.075],
    });
    [-0.24, 0.24].forEach((x) => {
      add(new THREE.SphereGeometry(0.038, 24, 16), 0.78, { x });
    });
  } else if (id === 'trama') {
    add(new THREE.TorusKnotGeometry(0.4, 0.095, 240, 36, 3, 4), 0.54);
  } else if (id === 'orbita') {
    add(new THREE.TorusGeometry(0.42, 0.045, 28, 140), 0.52, { rot: [1.15, 0.3, 0.2] });
    add(new THREE.SphereGeometry(0.2, 48, 32), 0.42);
  }

  return partes;
}

/** Libera as geometrias de um conjunto criado por `partesDe()`. */
export function descartarPartes(partes: ParteGeo[]) {
  partes.forEach((p) => p.geo.dispose());
}
