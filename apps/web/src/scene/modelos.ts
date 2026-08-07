import { encaixar, type Encaixe } from './caixa';
import { partesDe } from './pecas';
import type { ParteGeo } from '../types';

export interface Modelo {
  partes: ParteGeo[];
  encaixe: Encaixe;
}

const cache = new Map<string, Modelo>();

/**
 * O modelo vivo de uma peça: geometria mais o encaixe na caixa padrão do editor.
 *
 * Fica em cache pela vida da página — são seis produtos, a geometria é
 * determinística e a cena inteira compartilha as mesmas instâncias. Quem
 * precisa de cópias descartáveis (as miniaturas) chama `partesDe()` direto.
 */
export function modeloDe(id: string): Modelo {
  let m = cache.get(id);
  if (!m) {
    const partes = partesDe(id);
    m = { partes, encaixe: encaixar(partes) };
    cache.set(id, m);
  }
  return m;
}
