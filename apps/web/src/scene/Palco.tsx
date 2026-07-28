import type { Ambiente } from '../types';

export interface Lugar {
  x: number;
  z: number;
  /** altura do pedestal — o topo, onde o chão da caixa da peça se apoia */
  alturaPedestal: number;
}

/**
 * Os lugares em arco raso, na ordem do catálogo.
 *
 * Depende só de *quantos* produtos existem, não de quais — por isso recebe a
 * quantidade em vez de importar o catálogo. É o que permite ao catálogo vir do
 * banco sem que a cena precise saber disso.
 */
export function lugares(quantidade: number): Lugar[] {
  return Array.from({ length: quantidade }, (_, i) => {
    const a = (i / (quantidade - 1) - 0.5) * 2.05;
    const R = 3.9;
    return {
      x: Math.sin(a) * R,
      z: -Math.cos(a) * R * 0.42 - 0.4,
      alturaPedestal: 1.02 - Math.abs(a) * 0.06,
    };
  });
}

/** Largura do topo do pedestal. A caixa padrão é menor que isto de propósito. */
export const TOPO_PEDESTAL = 0.72;

/** Tudo que não é peça: fundo, chão, parede, luzes e pedestais. */
export default function Palco({ ambiente, lugares }: { ambiente: Ambiente; lugares: Lugar[] }) {
  const penumbra = ambiente === 'Penumbra';
  const bg = penumbra ? '#00143D' : '#FFF8F2';
  const corChao = penumbra ? '#082555' : '#F0F4FA';
  const corParede = penumbra ? '#061E4A' : '#F7F9FC';
  const corPedestal = penumbra ? '#12336A' : '#DDE6F2';

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 9, 22]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={corChao} roughness={0.95} />
      </mesh>

      <mesh position={[0, 12, -7]} receiveShadow>
        <planeGeometry args={[60, 24]} />
        <meshStandardMaterial color={corParede} roughness={1} />
      </mesh>

      <ambientLight intensity={penumbra ? 0.25 : 0.75} />
      <directionalLight
        position={[3.4, 7, 4.6]}
        intensity={penumbra ? 2.4 : 1.7}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0007}
      />
      <directionalLight position={[-5, 3.5, 2.5]} intensity={penumbra ? 0.35 : 0.55} />

      {lugares.map((l, i) => (
        <mesh key={i} position={[l.x, l.alturaPedestal / 2, l.z]} castShadow receiveShadow>
          <boxGeometry args={[TOPO_PEDESTAL, l.alturaPedestal, TOPO_PEDESTAL]} />
          <meshStandardMaterial color={corPedestal} roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}
