import type * as THREE from 'three';

/**
 * Tipos de interface e de cena — só do app web.
 *
 * O vocabulário de domínio (`Produto`, `Material`, `Cor`, `Tamanho`,
 * `ItemSacola`) vive em `@cria-forma/shared`, porque o banco e um eventual
 * backend precisam concordar com ele. O que está aqui não atravessa essa
 * fronteira: ou é estado de tela, ou depende do Three.js.
 */

export type Ambiente = 'Claro' | 'Penumbra';

/** Uma parte de uma peça: geometria pura mais a sua pose dentro do grupo. */
export interface ParteGeo {
  geo: THREE.BufferGeometry;
  pos?: [number, number, number];
  rot?: [number, number, number];
}

export type Thumbs = Record<string, string>;
